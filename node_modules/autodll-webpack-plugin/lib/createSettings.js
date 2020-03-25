'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createSettings = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _isNil = require('lodash/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

var _createHash = require('./createHash');

var _createHash2 = _interopRequireDefault(_createHash);

var _normalizeEntry = require('./normalizeEntry');

var _normalizeEntry2 = _interopRequireDefault(_normalizeEntry);

var _getEnv = require('./getEnv');

var _getEnv2 = _interopRequireDefault(_getEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var getInstanceId = function getInstanceId(index) {
  return `instance_${index}`;
};

var _createSettings = function _createSettings(getEnv) {
  return function (_ref) {
    var originalSettings = _ref.originalSettings,
        index = _ref.index,
        parentConfig = _ref.parentConfig;

    var entry = originalSettings.entry,
        env = originalSettings.env,
        inherit = originalSettings.inherit,
        otherSettings = _objectWithoutProperties(originalSettings, ['entry', 'env', 'inherit']);

    var defaults = {
      // Keep an eye on this one.
      // Till now process.cwd() was used as default
      // but using parentConfig.context makes more sense.
      // From webpack's docs, it defaults to process.cwd() too.
      context: parentConfig.context,

      // Whether the user wants to inherit from parent config or not, we must have publicPath.
      // we'll use it later when we read the dll bundles from memory.
      // defaults to '/'
      publicPath: (0, _get2.default)(parentConfig, 'output.publicPath', '/'),

      path: '',
      entry: null,
      filename: '[name].js',
      inject: false,
      debug: false,
      inherit: false,
      config: {}
    };

    var settings = _extends({}, defaults, otherSettings, {
      entry: (0, _normalizeEntry2.default)(entry),
      id: getInstanceId(index),
      env: getEnv(env),
      inherit: (0, _isNil2.default)(inherit) ? false : inherit
    });

    return _extends({}, settings, {
      hash: (0, _createHash2.default)(settings)
    });
  };
};

exports._createSettings = _createSettings;
exports.default = _createSettings(_getEnv2.default);