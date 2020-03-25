# watchpack

Wrapper library for directory and file watching.

[![Build Status][build-status]][build-status-url]
[![Build status][build-status-veyor]][build-status-veyor-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![codecov][codecov]][codecov-url]
[![downloads][downloads]][downloads-url]
[![Github contributors][contributors]][contributors-url]

## Concept

watchpack high level API doesn't map directly to watchers. Instead a three level architecture ensures that for each directory only a single watcher exists.

- The high level API requests `DirectoryWatchers` from a `WatcherManager`, which ensures that only a single `DirectoryWatcher` per directory is created.
- A user-faced `Watcher` can be obtained from a `DirectoryWatcher` and provides a filtered view on the `DirectoryWatcher`.
- Reference-counting is used on the `DirectoryWatcher` and `Watcher` to decide when to close them.
- The real watchers are created by the `DirectoryWatcher`.
- Files are never watched directly. This should keep the watcher count low.
- Watching can be started in the past. This way watching can start after file reading.
- Symlinks are not followed, instead the symlink is watched.

## API

```javascript
var Watchpack = require("watchpack");

var wp = new Watchpack({
	// options:
	aggregateTimeout: 1000
	// fire "aggregated" event when after a change for 1000ms no additional change occurred
	// aggregated defaults to undefined, which doesn't fire an "aggregated" event

	poll: true
	// poll: true - use polling with the default interval
	// poll: 10000 - use polling with an interval of 10s
	// poll defaults to undefined, which prefer native watching methods
	// Note: enable polling when watching on a network path
	// When WATCHPACK_POLLING environment variable is set it will override this option

	ignored: "**/.git",
	// ignored: "string" - a glob pattern for files or folders that should not be watched
	// ignored: ["string", "string"] - multiple glob patterns that should be ignored
	// All subdirectories are ignored too
});

// Watchpack.prototype.watch(files: string[], directories: string[], startTime?: number)
wp.watch(listOfFiles, listOfDirectories, Date.now() - 10000);
// starts watching these files and directories
// calling this again will override the files and directories

wp.on("change", function(filePath, mtime) {
	// filePath: the changed file
	// mtime: last modified time for the changed file (null if file was removed)
	// for folders it's a time before that all changes in the directory happened
});

wp.on("aggregated", function(changes, removals) {
	// changes: a Set of all changed files
	// removals: a Set of all removed files
});

// Watchpack.prototype.pause()
wp.pause();
// stops emitting events, but keeps watchers open
// next "watch" call can reuse the watchers

// Watchpack.prototype.close()
wp.close();
// stops emitting events and closes all watchers

// Watchpack.prototype.getTimeInfoEntries()
var fileTimes = wp.getTimeInfoEntries();
// returns a Map with all known time info objects for files and directories
// this include info from files not directly watched
// key: absolute path, value: object with { safeTime, timestamp }
// safeTime: the time before that all changes happened
// timestamp: only for files, the mtime timestamp of the file

// (deprecated)
// Watchpack.prototype.getTimes()
var fileTimes = wp.getTimes();
// returns an object with all known change times for files
// this include timestamps from files not directly watched
// key: absolute path, value: timestamp as number
```

[build-status]: https://travis-ci.org/webpack/watchpack.svg?branch=master
[build-status-url]: https://travis-ci.org/webpack/watchpack
[build-status-veyor]: https://ci.appveyor.com/api/projects/status/e5u2qvmugtv0r647/branch/master?svg=true
[build-status-veyor-url]: https://ci.appveyor.com/project/sokra/watchpack/branch/master
[coveralls-url]: https://coveralls.io/r/webpack/watchpack/
[coveralls-image]: https://img.shields.io/coveralls/webpack/watchpack.svg
[codecov]: https://codecov.io/gh/webpack/watchpack/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/webpack/watchpack
[downloads]: https://img.shields.io/npm/dm/watchpack.svg
[downloads-url]: https://www.npmjs.com/package/watchpack
[contributors]: https://img.shields.io/github/contributors/webpack/watchpack.svg
[contributors-url]: https://github.com/webpack/watchpack/graphs/contributors
