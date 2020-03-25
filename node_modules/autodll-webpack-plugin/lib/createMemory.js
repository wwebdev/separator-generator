'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createMemory = undefined;

var _memoryFs = require('memory-fs');

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _fs = require('./utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _paths = require('./paths');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringify = JSON.stringify,
    parse = JSON.parse;


var initializeMFS = function initializeMFS() {
  var mfs = new _memoryFs2.default();
  mfs.mkdirSync('/assets');
  return mfs;
};

var cleanup = function cleanup(mfs) {
  mfs.rmdirSync('/assets');
  mfs.mkdirSync('/assets');
  return mfs;
};

var createSync = function createSync(cacheDir, fs, mfs) {
  return function (hash, stats) {
    mfs = cleanup(mfs);

    mfs.writeFileSync('/stats.json', stringify(stats));

    return _bluebird2.default.resolve(stats.assets).map(function (_ref) {
      var name = _ref.name;
      return name;
    }).map(function (filename) {
      return _bluebird2.default.props({
        filename,
        buffer: fs.readFileAsync(_path2.default.join(cacheDir, hash, filename))
      });
    }).each(function (_ref2) {
      var filename = _ref2.filename,
          buffer = _ref2.buffer;

      mfs.writeFileSync(_path2.default.posix.join('/assets', filename), buffer);
    });
  };
};

var createGetAssets = function createGetAssets(mfs) {
  return function () {
    return mfs.readdirSync('/assets').map(function (filename) {
      return {
        filename,
        buffer: mfs.readFileSync(_path2.default.posix.join('/assets', filename))
      };
    });
  };
};

var createGetStats = function createGetStats(mfs) {
  return function () {
    try {
      var buffer = mfs.readFileSync('/stats.json');
      return parse(buffer);
    } catch (err) {
      return null;
    }
  };
};

var _createMemory = exports._createMemory = function _createMemory(fs, cacheDir) {
  return function () {
    var mfs = initializeMFS();

    return {
      sync: createSync(cacheDir, fs, mfs),
      getAssets: createGetAssets(mfs),
      getStats: createGetStats(mfs)
    };
  };
};

exports.default = _createMemory(_fs2.default, _paths.cacheDir);