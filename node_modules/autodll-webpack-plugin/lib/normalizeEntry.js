'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The point of normalizeEntry is to be a little bit more forgiving than how webpack treats its entries.
// If you pass an empty array, it will just exclude that entry.

var normalizeEntry = function normalizeEntry(entries) {
  if (!(0, _isPlainObject2.default)(entries)) {
    return entries;
  }

  return Object.keys(entries).reduce(function (validEntries, key) {
    if (Array.isArray(entries[key]) && entries[key].length) {
      validEntries[key] = entries[key];
    }

    return validEntries;
  }, {});
};

exports.default = normalizeEntry;