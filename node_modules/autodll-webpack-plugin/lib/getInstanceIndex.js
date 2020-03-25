'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAutoDll = undefined;

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isAutoDll = exports.isAutoDll = function isAutoDll(plugin) {
  return (0, _get2.default)(plugin, ['constructor', 'name']) === 'AutoDLLPlugin';
};

var getInstanceIndex = function getInstanceIndex(plugins, instance) {
  return plugins.filter(isAutoDll).indexOf(instance);
};

exports.default = getInstanceIndex;