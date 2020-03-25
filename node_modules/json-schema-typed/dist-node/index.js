'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

(function (JSONSchemaFormat) {
  JSONSchemaFormat["Date"] = "date";
  JSONSchemaFormat["DateTime"] = "date-time";
  JSONSchemaFormat["Email"] = "email";
  JSONSchemaFormat["Hostname"] = "hostname";
  JSONSchemaFormat["IDNEmail"] = "idn-email";
  JSONSchemaFormat["IDNHostname"] = "idn-hostname";
  JSONSchemaFormat["IPv4"] = "ipv4";
  JSONSchemaFormat["IPv6"] = "ipv6";
  JSONSchemaFormat["IRI"] = "iri";
  JSONSchemaFormat["IRIReference"] = "iri-reference";
  JSONSchemaFormat["JSONPointer"] = "json-pointer";
  JSONSchemaFormat["JSONPointerURIFragment"] = "json-pointer-uri-fragment";
  JSONSchemaFormat["RegEx"] = "regex";
  JSONSchemaFormat["RelativeJSONPointer"] = "relative-json-pointer";
  JSONSchemaFormat["Time"] = "time";
  JSONSchemaFormat["URI"] = "uri";
  JSONSchemaFormat["URIReference"] = "uri-reference";
  JSONSchemaFormat["URITemplate"] = "uri-template";
  JSONSchemaFormat["UUID"] = "uuid";
})(exports.JSONSchemaFormat || (exports.JSONSchemaFormat = {}));

(function (JSONSchemaType) {
  JSONSchemaType["Array"] = "array";
  JSONSchemaType["Boolean"] = "boolean";
  JSONSchemaType["Integer"] = "integer";
  JSONSchemaType["Null"] = "null";
  JSONSchemaType["Number"] = "number";
  JSONSchemaType["Object"] = "object";
  JSONSchemaType["String"] = "string";
})(exports.JSONSchemaType || (exports.JSONSchemaType = {}));

(function (JSONSchemaContentEncoding) {
  JSONSchemaContentEncoding["7bit"] = "7bit";
  JSONSchemaContentEncoding["8bit"] = "8bit";
  JSONSchemaContentEncoding["Binary"] = "binary";
  JSONSchemaContentEncoding["QuotedPrintable"] = "quoted-printable";
  JSONSchemaContentEncoding["Base64"] = "base64";
  JSONSchemaContentEncoding["IETFToken"] = "ietf-token";
  JSONSchemaContentEncoding["XToken"] = "x-token";
})(exports.JSONSchemaContentEncoding || (exports.JSONSchemaContentEncoding = {}));

const JSONSchemaKeys = ['$comment', '$id', '$ref', '$schema', 'additionalItems', 'additionalProperties', 'allOf', 'anyOf', 'const', 'contains', 'contentEncoding', 'contentMediaType', 'default', 'definitions', 'dependencies', 'description', 'else', 'enum', 'examples', 'exclusiveMaximum', 'exclusiveMinimum', 'format', 'if', 'items', 'maximum', 'maxItems', 'maxLength', 'maxProperties', 'minimum', 'minItems', 'minLength', 'minProperties', 'multipleOf', 'not', 'oneOf', 'pattern', 'patternProperties', 'properties', 'propertyNames', 'readOnly', 'required', 'then', 'title', 'type', 'uniqueItems', 'writeOnly'];

exports.JSONSchemaKeys = JSONSchemaKeys;
//# sourceMappingURL=index.js.map
