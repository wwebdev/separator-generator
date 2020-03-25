/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const EventEmitter = require("events").EventEmitter;
const async = require("neo-async");
const fs = require("graceful-fs");
const path = require("path");

const watcherManager = require("./watcherManager");

const EXISTANCE_ONLY_TIME_ENTRY = Object.freeze({});

let FS_ACCURACY = 1000;

const IS_OSX = require("os").platform() === "darwin";
const WATCHPACK_POLLING = process.env.WATCHPACK_POLLING;
const FORCE_POLLING =
	`${+WATCHPACK_POLLING}` === WATCHPACK_POLLING
		? +WATCHPACK_POLLING
		: !!WATCHPACK_POLLING && WATCHPACK_POLLING !== "false";

function withoutCase(str) {
	return str.toLowerCase();
}

class Watcher extends EventEmitter {
	constructor(directoryWatcher, filePath, startTime) {
		super();
		this.directoryWatcher = directoryWatcher;
		this.path = filePath;
		this.startTime = startTime && +startTime;
	}

	checkStartTime(mtime, initial) {
		const startTime = this.startTime;
		if (typeof startTime !== "number") return !initial;
		return startTime <= mtime;
	}

	close() {
		this.emit("closed");
	}
}

class DirectoryWatcher extends EventEmitter {
	constructor(directoryPath, options) {
		super();
		if (FORCE_POLLING) {
			options.poll = FORCE_POLLING;
		}
		this.options = options;
		this.path = directoryPath;
		// safeTime is the point in time after which reading is safe to be unchanged
		// timestamp is a value that should be compared with another timestamp (mtime)
		/** @type {Map<string, { safeTime: number, timestamp: number }} */
		this.files = new Map();
		this.directories = new Map();
		this.lastWatchEvent = 0;
		this.initialScan = true;
		this.ignored = options.ignored;
		this.nestedWatching = false;
		this.polledWatching =
			typeof options.poll === "number"
				? options.poll
				: options.poll
				? 5007
				: false;
		this.initialScanRemoved = new Set();
		this.watchers = new Map();
		this.parentWatcher = null;
		this.refs = 0;
		this._activeEvents = new Map();
		this.closed = false;
		this.scanning = false;
		this.scanAgain = false;
		this.scanAgainInitial = false;

		this.createWatcher();
		this.doScan(true);
	}

	checkIgnore(path) {
		if (!this.ignored) return false;
		path = path.replace(/\\/g, "/");
		return this.ignored.test(path);
	}

	createWatcher() {
		try {
			if (this.polledWatching) {
				// Poll for changes
				const interval = setInterval(() => {
					this.doScan(false);
				}, this.polledWatching);
				this.watcher = {
					close: () => {
						clearInterval(interval);
					}
				};
			} else {
				if (IS_OSX) {
					this.watchInParentDirectory();
				}
				this.watcher = fs.watch(this.path);
				this.watcher.on("change", this.onWatchEvent.bind(this));
				this.watcher.on("error", this.onWatcherError.bind(this));
			}
		} catch (err) {
			this.onWatcherError(err);
		}
	}

	forEachWatcher(path, fn) {
		const watchers = this.watchers.get(withoutCase(path));
		if (watchers !== undefined) {
			for (const w of watchers) {
				fn(w);
			}
		}
	}

	setMissing(itemPath, initial, type) {
		if (this.initialScan) {
			this.initialScanRemoved.add(itemPath);
		}

		const oldDirectory = this.directories.get(itemPath);
		if (oldDirectory) {
			if (this.nestedWatching) oldDirectory.close();
			this.directories.delete(itemPath);

			this.forEachWatcher(itemPath, w => w.emit("remove", type));
			if (!initial) {
				this.forEachWatcher(this.path, w =>
					w.emit("change", itemPath, null, type)
				);
			}
		}

		const oldFile = this.files.get(itemPath);
		if (oldFile) {
			this.files.delete(itemPath);

			this.forEachWatcher(itemPath, w => w.emit("remove", type));
			if (!initial) {
				this.forEachWatcher(this.path, w =>
					w.emit("change", itemPath, null, type)
				);
			}
		}
	}

	setFileTime(filePath, mtime, initial, ignoreWhenEqual, type) {
		const now = Date.now();

		if (this.checkIgnore(filePath)) return;

		const old = this.files.get(filePath);

		let safeTime, accuracy;
		if (initial) {
			safeTime = Math.min(now, mtime) + FS_ACCURACY;
			accuracy = FS_ACCURACY;
		} else {
			safeTime = now;
			accuracy = 0;
		}

		if (ignoreWhenEqual && old && old.timestamp === mtime) return;

		this.files.set(filePath, {
			safeTime,
			accuracy,
			timestamp: mtime
		});

		if (!old) {
			this.forEachWatcher(filePath, w => {
				if (!initial || w.checkStartTime(safeTime, initial)) {
					w.emit("change", mtime, type);
				}
			});
		} else if (!initial) {
			this.forEachWatcher(filePath, w => w.emit("change", mtime, type));
		}
		this.forEachWatcher(this.path, w => {
			if (!initial || w.checkStartTime(safeTime, initial)) {
				w.emit("change", filePath, safeTime, type);
			}
		});
	}

	setDirectory(directoryPath, mtime, initial, type) {
		if (this.checkIgnore(directoryPath)) return;
		if (directoryPath === this.path) {
			if (!initial) {
				this.forEachWatcher(this.path, w =>
					w.emit("change", directoryPath, mtime, type)
				);
			}
		} else {
			const old = this.directories.get(directoryPath);
			if (!old) {
				const now = Date.now();

				if (this.nestedWatching) {
					this.createNestedWatcher(directoryPath);
				} else {
					this.directories.set(directoryPath, true);
				}

				let safeTime;
				if (initial) {
					safeTime = Math.min(now, mtime) + FS_ACCURACY;
				} else {
					safeTime = now;
				}

				this.forEachWatcher(directoryPath, w => {
					if (!initial || w.checkStartTime(safeTime, false)) {
						w.emit("change", mtime, type);
					}
				});
				this.forEachWatcher(this.path, w => {
					if (!initial || w.checkStartTime(safeTime, initial)) {
						w.emit("change", directoryPath, safeTime, type);
					}
				});
			}
		}
	}

	createNestedWatcher(directoryPath) {
		const watcher = watcherManager.watchDirectory(
			directoryPath,
			this.options,
			1
		);
		watcher.on("change", (filePath, mtime, type) => {
			this.forEachWatcher(this.path, w => {
				if (w.checkStartTime(mtime, false)) {
					w.emit("change", filePath, mtime, type);
				}
			});
		});
		this.directories.set(directoryPath, watcher);
	}

	setNestedWatching(flag) {
		if (this.nestedWatching !== !!flag) {
			this.nestedWatching = !!flag;
			if (this.nestedWatching) {
				for (const directory of this.directories.keys()) {
					this.createNestedWatcher(directory);
				}
			} else {
				for (const [directory, watcher] of this.directories) {
					watcher.close();
					this.directories.set(directory, true);
				}
			}
		}
	}

	watch(filePath, startTime) {
		const key = withoutCase(filePath);
		let watchers = this.watchers.get(key);
		if (watchers === undefined) {
			watchers = new Set();
			this.watchers.set(key, watchers);
		}
		this.refs++;
		const watcher = new Watcher(this, filePath, startTime);
		watcher.on("closed", () => {
			watchers.delete(watcher);
			if (watchers.size === 0) {
				this.watchers.delete(key);
				if (this.path === filePath) this.setNestedWatching(false);
			}
			if (--this.refs <= 0) this.close();
		});
		watchers.add(watcher);
		let safeTime;
		if (filePath === this.path) {
			this.setNestedWatching(true);
			safeTime = this.lastWatchEvent;
			for (const entry of this.files.values()) {
				fixupEntryAccuracy(entry);
				safeTime = Math.max(safeTime, entry.safeTime);
			}
		} else {
			const entry = this.files.get(filePath);
			if (entry) {
				fixupEntryAccuracy(entry);
				safeTime = entry.safeTime;
			} else {
				safeTime = 0;
			}
		}
		process.nextTick(() => {
			if (this.closed) return;
			if (safeTime) {
				if (safeTime >= startTime) watcher.emit("change", safeTime);
			} else if (this.initialScan && this.initialScanRemoved.has(filePath)) {
				watcher.emit("remove");
			}
		});
		return watcher;
	}

	onWatchEvent(eventType, filename) {
		if (this.closed) return;
		if (!filename) {
			// In some cases no filename is provided
			// This seem to happen on windows
			// So some event happened but we don't know which file is affected
			// We have to do a full scan of the directory
			this.doScan(false);
			return;
		}

		const filePath = path.join(this.path, filename);
		if (this.checkIgnore(filePath)) return;

		if (this._activeEvents.get(filename) === undefined) {
			this._activeEvents.set(filename, false);
			const checkStats = () => {
				if (this.closed) return;
				this._activeEvents.set(filename, false);
				fs.stat(filePath, (err, stats) => {
					if (this.closed) return;
					if (this._activeEvents.get(filename) === true) {
						process.nextTick(checkStats);
						return;
					}
					this._activeEvents.delete(filename);
					// ENOENT happens when the file/directory doesn't exist
					// EPERM happens when the containing directory doesn't exist
					if (err) {
						if (
							err.code !== "ENOENT" &&
							err.code !== "EPERM" &&
							err.code !== "EBUSY"
						) {
							this.onStatsError(err);
						} else {
							if (filename === path.basename(this.path)) {
								// This may indicate that the directory itself was removed
								if (!fs.existsSync(this.path)) {
									this.onDirectoryRemoved();
								}
							}
						}
					}
					this.lastWatchEvent = Date.now();
					if (!stats) {
						this.setMissing(filePath, false, eventType);
					} else if (stats.isDirectory()) {
						this.setDirectory(
							filePath,
							+stats.mtime || +stats.ctime || 1,
							false,
							eventType
						);
					} else {
						if (stats.mtime) {
							ensureFsAccuracy(stats.mtime);
						}
						this.setFileTime(
							filePath,
							+stats.mtime || +stats.ctime || 1,
							false,
							false,
							eventType
						);
					}
				});
			};
			process.nextTick(checkStats);
		} else {
			this._activeEvents.set(filename, true);
		}
	}

	onWatcherError(err) {
		if (this.closed) return;
		if (err) {
			if (err.code !== "EPERM" && err.code !== "ENOENT") {
				console.error("Watchpack Error (watcher): " + err);
			}
			this.onDirectoryRemoved();
		}
	}

	onStatsError(err) {
		if (err) {
			console.error("Watchpack Error (stats): " + err);
		}
	}

	onScanError(err) {
		if (err) {
			console.error("Watchpack Error (initial scan): " + err);
		}
	}

	onDirectoryRemoved() {
		if (this.watcher) {
			this.watcher.close(), (this.watcher = null);
		}
		this.watchInParentDirectory();
		for (const directory of this.directories.keys()) {
			this.setMissing(directory, null, "directory-removed");
		}
		for (const file of this.files.keys()) {
			this.setMissing(file, null, "directory-removed");
		}
	}

	watchInParentDirectory() {
		if (!this.parentWatcher) {
			const parentDir = path.dirname(this.path);
			// avoid watching in the root directory
			// removing directories in the root directory is not supported
			if (path.dirname(parentDir) === parentDir) return;

			this.parentWatcher = watcherManager.watchFile(this.path, this.options, 1);
			this.parentWatcher.on("change", (mtime, type) => {
				if (this.closed) return;

				// On non-osx platforms we don't need this watcher to detect
				// directory removal, as a EPERM error indicates that
				if ((!IS_OSX || this.polledWatching) && this.parentWatcher) {
					this.parentWatcher.close();
					this.parentWatcher = null;
				}
				// Try to create the watcher when parent directory is found
				if (!this.watcher) {
					this.createWatcher();
					this.doScan(false);

					// directory was created so we emit a event
					this.forEachWatcher(this.path, w =>
						w.emit("change", this.path, mtime, type)
					);
				}
			});
			this.parentWatcher.on("remove", () => {
				this.onDirectoryRemoved();
			});
		}
	}

	doScan(initial) {
		if (this.scanning) {
			if (this.scanAgain) {
				if (!initial) this.scanAgainInitial = false;
			} else {
				this.scanAgain = true;
				this.scanAgainInitial = initial;
			}
			return;
		}
		this.scanning = true;
		fs.readdir(this.path, (err, items) => {
			if (this.closed) return;
			if (err) {
				if (err.code === "ENOENT" || err.code === "EPERM") {
					this.onDirectoryRemoved();
				} else {
					this.onScanError(err);
				}
				this.initialScan = false;
				if (this.scanAgain) {
					this.scanAgain = false;
					this.doScan(this.scanAgainInitial);
				} else {
					this.scanning = false;
				}
				return;
			}
			const itemPaths = new Set(items.map(item => path.join(this.path, item)));
			for (const file of this.files.keys()) {
				if (!itemPaths.has(file)) {
					this.setMissing(file, initial, "scan (missing)");
				}
			}
			for (const directory of this.directories.keys()) {
				if (!itemPaths.has(directory)) {
					this.setMissing(directory, initial, "scan (missing)");
				}
			}
			if (this.scanAgain) {
				// Early repeat of scan
				this.scanAgain = false;
				this.doScan(initial);
				return;
			}
			async.forEach(
				itemPaths,
				(itemPath, callback) => {
					fs.stat(itemPath, (err2, stats) => {
						if (this.closed) return;
						if (err2) {
							if (
								err2.code === "ENOENT" ||
								err2.code === "EPERM" ||
								err2.code === "EBUSY"
							) {
								this.setMissing(itemPath, initial, "scan (" + err2.code + ")");
							} else {
								this.onScanError(err2);
							}
							callback();
							return;
						}
						if (stats.isFile()) {
							if (stats.mtime) {
								ensureFsAccuracy(stats.mtime);
							}
							this.setFileTime(
								itemPath,
								+stats.mtime || +stats.ctime || 1,
								initial,
								true,
								"scan (file)"
							);
						} else if (stats.isDirectory()) {
							if (!initial || !this.directories.has(itemPath))
								this.setDirectory(
									itemPath,
									+stats.mtime || +stats.ctime || 1,
									initial,
									"scan (dir)"
								);
						}
						callback();
					});
				},
				() => {
					if (this.closed) return;
					this.initialScan = false;
					this.initialScanRemoved = null;
					if (this.scanAgain) {
						this.scanAgain = false;
						this.doScan(this.scanAgainInitial);
					} else {
						this.scanning = false;
					}
				}
			);
		});
	}

	getTimes() {
		const obj = Object.create(null);
		let safeTime = this.lastWatchEvent;
		for (const [file, entry] of this.files) {
			fixupEntryAccuracy(entry);
			safeTime = Math.max(safeTime, entry.safeTime);
			obj[file] = Math.max(entry.safeTime, entry.timestamp);
		}
		if (this.nestedWatching) {
			for (const w of this.directories.values()) {
				const times = w.directoryWatcher.getTimes();
				Object.keys(times).forEach(function(file) {
					const time = times[file];
					safeTime = Math.max(safeTime, time);
					obj[file] = time;
				});
			}
			obj[this.path] = safeTime;
		}
		if (!this.initialScan) {
			for (const watchers of this.watchers.values()) {
				for (const watcher of watchers) {
					const path = watcher.path;
					if (!Object.prototype.hasOwnProperty.call(obj, path)) {
						obj[path] = null;
					}
				}
			}
		}
		return obj;
	}

	getTimeInfoEntries() {
		const map = new Map();
		let safeTime = this.lastWatchEvent;
		for (const [file, entry] of this.files) {
			fixupEntryAccuracy(entry);
			safeTime = Math.max(safeTime, entry.safeTime);
			map.set(file, entry);
		}
		if (this.nestedWatching) {
			for (const w of this.directories.values()) {
				const timeInfoEntries = w.directoryWatcher.getTimeInfoEntries();
				for (const [file, entry] of timeInfoEntries) {
					if (entry) {
						safeTime = Math.max(safeTime, entry.safeTime);
					}
					map.set(file, entry);
				}
			}
			map.set(this.path, {
				safeTime
			});
		} else {
			for (const dir of this.directories.keys()) {
				// No additional info about this directory
				map.set(dir, EXISTANCE_ONLY_TIME_ENTRY);
			}
			map.set(this.path, EXISTANCE_ONLY_TIME_ENTRY);
		}
		if (!this.initialScan) {
			for (const watchers of this.watchers.values()) {
				for (const watcher of watchers) {
					const path = watcher.path;
					if (!map.has(path)) {
						map.set(path, null);
					}
				}
			}
		}
		return map;
	}

	close() {
		this.closed = true;
		this.initialScan = false;
		if (this.watcher) {
			this.watcher.close();
			this.watcher = null;
		}
		if (this.nestedWatching) {
			for (const w of this.directories.values()) {
				w.close();
			}
			this.directories.clear();
		}
		if (this.parentWatcher) {
			this.parentWatcher.close();
			this.parentWatcher = null;
		}
		this.emit("closed");
	}
}

module.exports = DirectoryWatcher;
module.exports.EXISTANCE_ONLY_TIME_ENTRY = EXISTANCE_ONLY_TIME_ENTRY;

function fixupEntryAccuracy(entry) {
	if (entry.accuracy > FS_ACCURACY) {
		entry.safeTime = entry.safeTime - entry.accuracy + FS_ACCURACY;
		entry.accuracy = FS_ACCURACY;
	}
}

function ensureFsAccuracy(mtime) {
	if (!mtime) return;
	if (FS_ACCURACY > 1 && mtime % 1 !== 0) FS_ACCURACY = 1;
	else if (FS_ACCURACY > 10 && mtime % 10 !== 0) FS_ACCURACY = 10;
	else if (FS_ACCURACY > 100 && mtime % 100 !== 0) FS_ACCURACY = 100;
}
