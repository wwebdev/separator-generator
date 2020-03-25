'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('./utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _paths = require('./paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createStoreStats = function createStoreStats(fs, statsPath) {
  return function (stats) {
    return fs.writeFileAsync(statsPath, JSON.stringify(stats));
  };
};

var createRetrieveStats = function createRetrieveStats(memory, statsPath) {
  return function () {
    return Promise.resolve().then(function () {
      var statsFromMemory = memory.getStats();

      if (statsFromMemory) {
        return {
          source: 'memory',
          stats: statsFromMemory
        };
      }

      return _fs2.default.readFileAsync(statsPath).then(function (buffer) {
        return JSON.parse(buffer);
      }).then(function (statsFromFS) {
        return {
          source: 'fs',
          stats: statsFromFS
        };
      });
    });
  };
};

var _createHandleStats = function _createHandleStats(fs, cacheDir) {
  return function (log, hash, memory) {
    var statsPath = (0, _path.join)(cacheDir, hash, 'stats.json');
    var storeStats = createStoreStats(fs, statsPath);
    var retrieveStats = createRetrieveStats(memory, statsPath);

    return function (statsFromBuild) {
      if (statsFromBuild) {
        var stats = statsFromBuild.toJson();
        return storeStats(stats).then(function () {
          return {
            source: 'build',
            stats: stats
          };
        });
      }

      return retrieveStats().then(function (_ref) {
        var stats = _ref.stats,
            source = _ref.source;

        return {
          source: source,
          stats: stats
        };
      });
    };
  };
};

exports.default = _createHandleStats(_fs2.default, _paths.cacheDir);