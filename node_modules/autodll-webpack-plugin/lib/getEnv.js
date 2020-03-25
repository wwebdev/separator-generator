'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _getEnv = exports._getEnv = function _getEnv(process) {
  return function (env) {
    return env || process.env.NODE_ENV || 'development';
  };
};
exports.default = _getEnv(process);