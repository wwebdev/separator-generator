'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloneDeepWith = require('lodash/cloneDeepWith');

var _cloneDeepWith2 = _interopRequireDefault(_cloneDeepWith);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var safeClone = function safeClone(config) {
  return (0, _cloneDeepWith2.default)(config, function (value) {
    if ((0, _isObject2.default)(value) && !(0, _isPlainObject2.default)(value) && !Array.isArray(value)) {
      return value;
    }
  });
};

exports.default = safeClone;