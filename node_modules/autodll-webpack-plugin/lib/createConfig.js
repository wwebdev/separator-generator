'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpackMerge = require('webpack-merge');

var _webpack = require('webpack');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _paths = require('./paths');

var _reject = require('lodash/reject');

var _reject2 = _interopRequireDefault(_reject);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _mapParentConfig = require('./mapParentConfig');

var _mapParentConfig2 = _interopRequireDefault(_mapParentConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var webpackMerge = (0, _webpackMerge.strategy)({
  entry: 'append',
  output: 'append',
  plugins: 'append'
});

// omit properties that can break things
var prepare = function prepare(config) {
  // We don't want are own plugin in the DLL config
  var plugins = (0, _reject2.default)(config.plugins, function (plugin) {
    return (0, _get2.default)(plugin, 'constructor.name') === 'AutoDLLPlugin';
  });

  // context is omitted becouse we already assigned the parent context as the defaults in createSettings
  // plugins are ommited by default too.
  // It's not ideal, but it's better to let the user make a conscious choice about it.
  var props = ['context', 'plugins', 'entry', 'output'];
  return _extends({}, (0, _omit2.default)(config, props), { plugins });
};

var _createConfig = exports._createConfig = function _createConfig(cacheDir) {
  return function (settings, rawParentConfig) {
    var hash = settings.hash,
        _settings$filename = settings.filename,
        filename = _settings$filename === undefined ? [] : _settings$filename;

    var outputPath = _path2.default.join(cacheDir, hash);

    var parentConfig = (0, _mapParentConfig2.default)(settings, prepare(rawParentConfig));

    var ownConfig = {
      context: settings.context,
      entry: settings.entry,
      plugins: [].concat(_toConsumableArray(settings.plugins || []), [new _webpack.DllPlugin({
        path: _path2.default.join(outputPath, '[name].manifest.json'),
        name: '[name]_[chunkhash]'
      })]),
      output: {
        filename: filename,
        library: '[name]_[chunkhash]'
      }
    };

    var advanceConfig = settings.config;

    var cacheConfig = {
      // The user is not allowed to change output.path
      // otherwise bad things will happen.
      // (this is the path for the cache)
      output: {
        path: outputPath
      }
    };

    return webpackMerge(parentConfig, ownConfig, advanceConfig, cacheConfig);
  };
};

exports.default = _createConfig(_paths.cacheDir);