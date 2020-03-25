'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = function log(msg) {
  console.log('AutoDllPlugin:', msg);
};

log.tap = function (msg) {
  return function (res) {
    log((0, _isFunction2.default)(msg) ? msg(res) : msg);
    return res;
  };
};

var createLogger = function createLogger(showLogs) {
  if (!showLogs) {
    var _log = function _log() {};
    _log.tap = function () {
      return function (res) {
        return res;
      };
    };
    return _log;
  }

  return log;
};

exports.default = createLogger;