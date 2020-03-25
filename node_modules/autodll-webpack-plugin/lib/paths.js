'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInjectPath = exports.getManifestPath = exports.cacheDir = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _findCacheDir = require('find-cache-dir');

var _findCacheDir2 = _interopRequireDefault(_findCacheDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cacheDir = exports.cacheDir = (0, _findCacheDir2.default)({ name: 'autodll-webpack-plugin' });

var getManifestPath = exports.getManifestPath = function getManifestPath(hash) {
  return function (bundleName) {
    return _path2.default.resolve(cacheDir, hash, `${bundleName}.manifest.json`);
  };
};

var getInjectPath = exports.getInjectPath = function getInjectPath(_ref) {
  var publicPath = _ref.publicPath,
      pluginPath = _ref.pluginPath,
      filename = _ref.filename;

  var injectPublicPath = publicPath;
  var injectRestPath = _path2.default.posix.join(pluginPath, filename);
  // Ensure that injectPublicPath and injectRestPath can be safely concatinated
  if (injectPublicPath && !injectPublicPath.endsWith('/')) {
    injectPublicPath += '/';
  }
  if (injectRestPath.startsWith('/')) {
    injectRestPath = injectRestPath.substr(1);
  }
  return injectPublicPath + injectRestPath;
};