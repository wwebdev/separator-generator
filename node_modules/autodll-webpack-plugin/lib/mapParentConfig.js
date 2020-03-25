'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The user can control what to inherit from the parent config
// by passing a fucntion to inherit the user can take only the properties he wants.

var defaultExclude = ['plugins'];

var createDefaultMapper = function createDefaultMapper(exclude) {
  return function (parentConfig) {
    return (0, _omit2.default)(parentConfig, exclude);
  };
};

var createMapper = function createMapper(inherit) {
  if ((0, _isFunction2.default)(inherit)) {
    return inherit;
  }

  if ((0, _isPlainObject2.default)(inherit)) {
    var exclude = Array.isArray(inherit.exclude) ? inherit.exclude : defaultExclude;
    return createDefaultMapper(exclude);
  }

  if (inherit === true) {
    return createDefaultMapper(defaultExclude);
  }

  // do not inherit
  return null;
};

var mapParentConfig = function mapParentConfig(settings, parentConfig) {
  var mapFn = createMapper(settings.inherit);

  // skip it if no mapFn returned
  if (!mapFn) {
    return {};
  }

  var _originalParentConfig = void 0;

  if (settings.debug) {
    _originalParentConfig = (0, _cloneDeep2.default)(parentConfig);
  }

  var mappedParentConfig = mapFn((0, _utils.safeClone)(parentConfig));

  if (settings.debug && !(0, _isEqual2.default)(parentConfig, _originalParentConfig)) {
    throw new Error('Do not modify the original config');
  }

  return mappedParentConfig;
};

exports.default = mapParentConfig;