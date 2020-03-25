'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('./utils/fs');

var _fs2 = _interopRequireDefault(_fs);

var _makeDir = require('make-dir');

var _makeDir2 = _interopRequireDefault(_makeDir);

var _readPkg = require('read-pkg');

var _readPkg2 = _interopRequireDefault(_readPkg);

var _paths = require('./paths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This file could be written much better.
// Ideally it should just return a boolean of the cache is valid or not
// right now it also save the last package.json to cache.
// I don't like it, But it will do for now.

// Conditions for cache invalidation (return false):
// 1. The build dir is not exist for example:
//    specs/fixtures/basic/node_modules/.cache/
//    autodll-webpack-plugin/development_instance_0_8d5207f894c329f437bd1ff655c7379a
// 2. The previous package.json is not stored in cache
// 3. The previous package.json diffrent from the current package.json

var validateCache = function validateCache(settings) {
  var prevPkgPath = _path2.default.join(_paths.cacheDir, 'package.json.hash');

  return Promise.all([_fs2.default.lstatAsync(_path2.default.join(_paths.cacheDir, settings.hash)).catch(function () {
    return null;
  }), _fs2.default.readFileAsync(prevPkgPath).catch(function () {
    return null;
  }), (0, _readPkg2.default)(settings.context).catch(function () {
    return null;
  })]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        buildHashDirExist = _ref2[0],
        prevPkgHash = _ref2[1],
        pkg = _ref2[2];

    var pkgHash = JSON.stringify(pkg);

    if (buildHashDirExist && prevPkgHash && prevPkgHash.toString() === pkgHash) {
      return true;
    }

    return (0, _makeDir2.default)(_paths.cacheDir).then(function () {
      return _fs2.default.writeFileAsync(prevPkgPath, pkgHash);
    }).then(function () {
      return false;
    });
  });
};

exports.default = validateCache;