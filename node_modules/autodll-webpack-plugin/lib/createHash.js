'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createHash = function createHash(settings) {
  var hash = _crypto2.default.createHash('md5');
  var settingsJSON = JSON.stringify(settings);

  hash.update(settingsJSON);

  return [settings.env, settings.id, hash.digest('hex')].join('_');
};

exports.default = createHash;