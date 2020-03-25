/**
 * JSON Schema
 *
 * Documentation corresponds to the work-in-progress draft-07 of JSON Schema.
 *
 * The latest published drafts are:
 * - draft-handrews-json-schema-01
 * - draft-handrews-json-schema-validation-01
 *
 * For more information, visit: http://json-schema.org/.
 *
 * Draft date: March 19, 2018.
 *
 * @public
 */
export interface JSONSchema {
  /**
   * This keyword is reserved for comments from schema authors to readers or
   * maintainers of the schema. The value of this keyword MUST be a string.
   * Implementations MUST NOT present this string to end users. Tools for
   * editing schemas SHOULD support displaying and editing this keyword.
   *
   * The value of this keyword MAY be used in debug or error output which is
   * intended for developers making use of schemas. Schema vocabularies SHOULD
   * allow "$comment" within any object containing vocabulary keywords.
   *
   * Implementations MAY assume "$comment" is allowed unless the vocabulary
   * specifically forbids it. Vocabularies MUST NOT specify any effect of
   * "$comment" beyond what is described in this specification. Tools that
   * translate other media types or programming languages to and from
   * application/schema+json MAY choose to convert that media type or
   * programming language's native comments to or from "$comment" values.
   *
   * The behavior of such translation when both native comments and "$comment"
   * properties are present is implementation-dependent. Implementations SHOULD
   * treat "$comment" identically to an unknown extension keyword.
   *
   * They MAY strip "$comment" values at any point during processing. In
   * particular, this allows for shortening schemas when the size of deployed
   * schemas is a concern. Implementations MUST NOT take any other action based
   * on the presence, absence, or contents of "$comment" properties.
   */
  $comment?: string
  /**
   * The "$id" keyword defines a URI for the schema, and the base URI that other
   * URI references within the schema are resolved against. A subschema's "$id"
   * is resolved against the base URI of its parent schema. If no parent sets an
   * explicit base with "$id", the base URI is that of the entire document, as
   * determined per [RFC 3986 section 5][RFC3986].
   *
   * If present, the value for this keyword MUST be a string, and MUST represent
   * a valid [URI-reference][RFC3986]. This value SHOULD be normalized, and
   * SHOULD NOT be an empty fragment <#> or an empty string <>.
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-core.html#RFC3986
   */
  $id?: string
  /**
   * The "$ref" keyword is used to reference a schema, and provides the ability
   * to validate recursive structures through self-reference.
   *
   * An object schema with a "$ref" property MUST be interpreted as a "$ref"
   * reference. The value of the "$ref" property MUST be a URI Reference.
   * Resolved against the current URI base, it identifies the URI of a schema to
   * use. All other properties in a "$ref" object MUST be ignored.
   *
   * The URI is not a network locator, only an identifier. A schema need not be
   * downloadable from the address if it is a network-addressable URL, and
   * implementations SHOULD NOT assume they should perform a network operation
   * when they encounter a network-addressable URI.
   *
   * A schema MUST NOT be run into an infinite loop against a schema. For
   * example, if two schemas "#alice" and "#bob" both have an "allOf" property
   * that refers to the other, a naive validator might get stuck in an infinite
   * recursive loop trying to validate the instance. Schemas SHOULD NOT make use
   * of infinite recursive nesting like this; the behavior is undefined.
   */
  $ref?: string
  /**
   * The "$schema" keyword is both used as a JSON Schema version identifier and
   * the location of a resource which is itself a JSON Schema, which describes
   * any schema written for this particular version.
   *
   * The value of this keyword MUST be a [URI][RFC3986] (containing a scheme)
   * and this URI MUST be normalized. The current schema MUST be valid against
   * the meta-schema identified by this URI.
   *
   * If this URI identifies a retrievable resource, that resource SHOULD be of
   * media type "application/schema+json".
   *
   * The "$schema" keyword SHOULD be used in a root schema. It MUST NOT appear
   * in subschemas.
   *
   * Values for this property are defined in other documents and by other
   * parties. JSON Schema implementations SHOULD implement support for current
   * and previous published drafts of JSON Schema vocabularies as deemed
   * reasonable.
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-core.html#RFC3986
   */
  $schema?: string
  /**
   * The value of "additionalItems" MUST be a valid JSON Schema.
   *
   * This keyword determines how child instances validate for arrays, and does
   * not directly validate the immediate instance itself.
   *
   * If "items" is an array of schemas, validation succeeds if every instance
   * element at a position greater than the size of "items" validates against
   * "additionalItems".
   *
   * Otherwise, "additionalItems" MUST be ignored, as the "items" schema
   * (possibly the default value of an empty schema) is applied to all elements.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  additionalItems?: JSONSchema | boolean
  /**
   * The value of "additionalProperties" MUST be a valid JSON Schema.
   *
   * This keyword determines how child instances validate for objects, and does
   * not directly validate the immediate instance itself.
   *
   * Validation with "additionalProperties" applies only to the child values of
   * instance names that do not match any names in "properties", and do not
   * match any regular expression in "patternProperties".
   *
   * For all such properties, validation succeeds if the child instance
   * validates against the "additionalProperties" schema.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  additionalProperties?: JSONSchema | boolean
  /**
   * This keyword's value MUST be a non-empty array. Each item of the array MUST
   * be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates
   * successfully against all schemas defined by this keyword's value.
   */
  allOf?: (JSONSchema | boolean)[]
  /**
   * This keyword's value MUST be a non-empty array. Each item of the array MUST
   * be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates
   * successfully against at least one schema defined by this keyword's value.
   */
  anyOf?: (JSONSchema | boolean)[]
  /**
   * The value of this keyword MAY be of any type, including null.
   *
   * An instance validates successfully against this keyword if its value is
   * equal to the value of the keyword.
   */
  const?: any
  /**
   * The value of this keyword MUST be a valid JSON Schema.
   *
   * An array instance is valid against "contains" if at least one of its
   * elements is valid against the given schema.
   */
  contains?: JSONSchema | boolean
  /**
   * If the instance value is a string, this property defines that the string
   * SHOULD be interpreted as binary data and decoded using the encoding named
   * by this property. [RFC 2045, Sec 6.1][RFC2045] lists the possible values for
   * this property.
   *
   * The value of this property SHOULD be ignored if the instance described is
   * not a string.
   *
   * [RFC2045]: https://tools.ietf.org/html/rfc2045#section-6.1
   */
  contentEncoding?: JSONSchemaContentEncodingName | JSONSchemaContentEncoding
  /**
   * The value of this property must be a media type, as defined by
   * [RFC 2046][RFC2046]. This property defines the media type of instances
   * which this schema defines.
   *
   * The value of this property SHOULD be ignored if the instance described is
   * not a string.
   *
   * If the "contentEncoding" property is not present, but the instance value is
   * a string, then the value of this property SHOULD specify a text document
   * type, and the character set SHOULD be the character set into which the
   * JSON string value was decoded (for which the default is Unicode).
   *
   * [RFC2046]: https://tools.ietf.org/html/rfc2046
   */
  contentMediaType?: string
  /**
   * There are no restrictions placed on the value of this keyword. When
   * multiple occurrences of this keyword are applicable to a single
   * sub-instance, implementations SHOULD remove duplicates.
   *
   * This keyword can be used to supply a default JSON value associated with a
   * particular schema. It is RECOMMENDED that a default value be valid against
   * the associated schema.
   */
  default?: any
  /**
   * The "definitions" keywords provides a standardized location for schema
   * authors to inline re-usable JSON Schemas into a more general schema. The
   * keyword does not directly affect the validation result.
   *
   * This keyword's value MUST be an object. Each member value of this object
   * MUST be a valid JSON Schema.
   */
  definitions?: {
    [key: string]: JSONSchema | boolean
  }
  /**
   * This keyword specifies rules that are evaluated if the instance is an
   * object and contains a certain property.
   *
   * This keyword's value MUST be an object. Each property specifies a
   * dependency. Each dependency value MUST be an array or a valid JSON Schema.
   *
   * If the dependency value is a subschema, and the dependency key is a
   * property in the instance, the entire instance must validate against the
   * dependency value.
   *
   * If the dependency value is an array, each element in the array, if any,
   * MUST be a string, and MUST be unique. If the dependency key is a property
   * in the instance, each of the items in the dependency value must be a
   * property that exists in the instance.
   *
   * Omitting this keyword has the same behavior as an empty object.
   */
  dependencies?:
    | {
        [key: string]: JSONSchema | boolean | string[]
      }
    | string[]
  /**
   * Can be used to decorate a user interface with explanation or information
   * about the data produced.
   */
  description?: string
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * When "if" is present, and the instance fails to validate against its
   * subschema, then validation succeeds against this keyword if the instance
   * successfully validates against this keyword's subschema.
   *
   * This keyword has no effect when "if" is absent, or when the instance
   * successfully validates against its subschema. Implementations MUST NOT
   * evaluate the instance against this keyword, for either validation or
   * annotation collection purposes, in such cases.
   */
  else?: JSONSchema | boolean
  /**
   * The value of this keyword MUST be an array. This array SHOULD have at least
   * one element. Elements in the array SHOULD be unique.
   *
   * An instance validates successfully against this keyword if its value is
   * equal to one of the elements in this keyword's array value.
   *
   * Elements in the array might be of any value, including null.
   */
  enum?: any[]
  /**
   * The value of this keyword MUST be an array. There are no restrictions
   * placed on the values within the array. When multiple occurrences of this
   * keyword are applicable to a single sub-instance, implementations MUST
   * provide a flat array of all values rather than an array of arrays.
   *
   * This keyword can be used to provide sample JSON values associated with a
   * particular schema, for the purpose of illustrating usage. It is RECOMMENDED
   * that these values be valid against the associated schema.
   *
   * Implementations MAY use the value(s) of "default", if present, as an
   * additional example. If "examples" is absent, "default" MAY still be used in
   * this manner.
   */
  examples?: any[]
  /**
   * The value of "exclusiveMaximum" MUST be number, representing an exclusive
   * upper limit for a numeric instance.
   *
   * If the instance is a number, then the instance is valid only if it has a
   * value strictly less than (not equal to) "exclusiveMaximum".
   */
  exclusiveMaximum?: number
  /**
   * The value of "exclusiveMinimum" MUST be number, representing an exclusive
   * lower limit for a numeric instance.
   *
   * If the instance is a number, then the instance is valid only if it has a
   * value strictly greater than (not equal to) "exclusiveMinimum".
   */
  exclusiveMinimum?: number
  /**
   * The "format" keyword functions as both an [annotation][annotation] and as
   * an [assertion][assertion]. While no special effort is required to implement
   * it as an annotation conveying semantic meaning, implementing validation is
   * non-trivial.
   *
   * Implementations MAY support the "format" keyword as a validation assertion.
   * Should they choose to do so:
   *
   *  - they SHOULD implement validation for attributes defined below;
   *  - they SHOULD offer an option to disable validation for this keyword.
   *
   * Implementations MAY add custom format attributes. Save for agreement
   * between parties, schema authors SHALL NOT expect a peer implementation to
   * support this keyword and/or custom format attributes.
   *
   * [annotation]: http://json-schema.org/latest/json-schema-validation.html#annotations
   * [assertion]: http://json-schema.org/latest/json-schema-validation.html#assertions
   */
  format?:
    | JSONSchemaFormat
    | 'date'
    | 'date-time'
    | 'email'
    | 'full-date'
    | 'full-time'
    | 'hostname'
    | 'idn-email'
    | 'idn-hostname'
    | 'ipv4'
    | 'ipv6'
    | 'iri'
    | 'iri-reference'
    | 'json-pointer'
    | 'json-pointer-uri-fragment'
    | 'regex'
    | 'relative-json-pointer'
    | 'time'
    | 'uri'
    | 'uri-reference'
    | 'uri-template'
    | 'uuid'
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * This validation outcome of this keyword's subschema has no direct effect on
   * the overall validation result. Rather, it controls which of the "then" or
   * "else" keywords are evaluated.
   *
   * Instances that successfully validate against this keyword's subschema MUST
   * also be valid against the subschema value of the "then" keyword, if
   * present.
   *
   * Instances that fail to validate against this keyword's subschema MUST also
   * be valid against the subschema value of the "else" keyword, if present.
   *
   * If [annotations][annotations] are being collected, they are collected from
   * this keyword's subschema in the usual way, including when the keyword is
   * present without either "then" or "else".
   *
   * [annotations]: http://json-schema.org/latest/json-schema-validation.html#annotations
   */
  if?: JSONSchema | boolean
  /**
   * The value of "items" MUST be either a valid JSON Schema or an array of
   * valid JSON Schemas.
   *
   * This keyword determines how child instances validate for arrays, and does
   * not directly validate the immediate instance itself.
   *
   * If "items" is a schema, validation succeeds if all elements in the array
   * successfully validate against that schema.
   *
   * If "items" is an array of schemas, validation succeeds if each element of
   * the instance validates against the schema at the same position, if any.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  items?: JSONSchema | boolean | (JSONSchema | boolean)[]
  /**
   * The value of "maximum" MUST be a number, representing an inclusive upper
   * limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates only if the
   * instance is less than or exactly equal to "maximum".
   */
  maximum?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An array instance is valid against "maxItems" if its size is less than, or
   * equal to, the value of this keyword.
   */
  maxItems?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * A string instance is valid against this keyword if its length is less than,
   * or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters
   * as defined by [RFC 7159][RFC7159].
   *
   * [RFC7159]: http://json-schema.org/latest/json-schema-validation.html#RFC7159
   */
  maxLength?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An object instance is valid against "maxProperties" if its number of
   * properties is less than, or equal to, the value of this keyword.
   */
  maxProperties?: number
  /**
   * The value of "minimum" MUST be a number, representing an inclusive lower
   * limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates only if the
   * instance is greater than or exactly equal to "minimum".
   */
  minimum?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * A string instance is valid against this keyword if its length is greater
   * than, or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters
   * as defined by [RFC 7159][RFC7159].
   *
   * Omitting this keyword has the same behavior as a value of 0.
   *
   * [RFC7159]: http://json-schema.org/latest/json-schema-validation.html#RFC7159
   */
  minLength?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An array instance is valid against "minItems" if its size is greater than,
   * or equal to, the value of this keyword.
   *
   * Omitting this keyword has the same behavior as a value of 0.
   */
  minItems?: number
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * An object instance is valid against "minProperties" if its number of
   * properties is greater than, or equal to, the value of this keyword.
   *
   * Omitting this keyword has the same behavior as a value of 0.
   */
  minProperties?: number
  /**
   * The value of "multipleOf" MUST be a number, strictly greater than 0.
   *
   * A numeric instance is valid only if division by this keyword's value
   * results in an integer.
   */
  multipleOf?: number
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * An instance is valid against this keyword if it fails to validate
   * successfully against the schema defined by this keyword.
   */
  not?: JSONSchema | boolean
  /**
   * This keyword's value MUST be a non-empty array. Each item of the array MUST
   * be a valid JSON Schema.
   *
   * An instance validates successfully against this keyword if it validates
   * successfully against exactly one schema defined by this keyword's value.
   */
  oneOf?: (JSONSchema | boolean)[]
  /**
   * The value of this keyword MUST be a string. This string SHOULD be a valid
   * regular expression, according to the ECMA 262 regular expression dialect.
   *
   * A string instance is considered valid if the regular expression matches the
   * instance successfully. Recall: regular expressions are not implicitly
   * anchored.
   */
  pattern?: string
  /**
   * The value of "patternProperties" MUST be an object. Each property name of
   * this object SHOULD be a valid regular expression, according to the ECMA 262
   * regular expression dialect. Each property value of this object MUST be a
   * valid JSON Schema.
   *
   * This keyword determines how child instances validate for objects, and does
   * not directly validate the immediate instance itself. Validation of the
   * primitive instance type against this keyword always succeeds.
   *
   * Validation succeeds if, for each instance name that matches any regular
   * expressions that appear as a property name in this keyword's value, the
   * child instance for that name successfully validates against each schema
   * that corresponds to a matching regular expression.
   *
   * Omitting this keyword has the same behavior as an empty object.
   */
  patternProperties?: {
    [key: string]: JSONSchema | boolean
  }
  /**
   * The value of "properties" MUST be an object. Each value of this object MUST
   * be a valid JSON Schema.
   *
   * This keyword determines how child instances validate for objects, and does
   * not directly validate the immediate instance itself.
   *
   * Validation succeeds if, for each name that appears in both the instance and
   * as a name within this keyword's value, the child instance for that name
   * successfully validates against the corresponding schema.
   *
   * Omitting this keyword has the same behavior as an empty object.
   */
  properties?: {
    [key: string]: JSONSchema | boolean
  }
  /**
   * The value of "propertyNames" MUST be a valid JSON Schema.
   *
   * If the instance is an object, this keyword validates if every property name
   * in the instance validates against the provided schema. Note the property
   * name that the schema is testing will always be a string.
   *
   * Omitting this keyword has the same behavior as an empty schema.
   */
  propertyNames?: JSONSchema | boolean
  /**
   * The value of this keywords MUST be a boolean. When multiple occurrences of
   * this keyword are applicable to a single sub-instance, the resulting value
   * MUST be true if any occurrence specifies a true value, and MUST be false
   * otherwise.
   *
   * If "readOnly" has a value of boolean true, it indicates that the value of
   * the instance is managed exclusively by the owning authority, and attempts
   * by an application to modify the value of this property are expected to be
   * ignored or rejected by that owning authority.
   *
   * An instance document that is marked as "readOnly for the entire document
   * MAY be ignored if sent to the owning authority, or MAY result in an error,
   * at the authority's discretion.
   *
   * For example, "readOnly" would be used to mark a database-generated serial
   * number as read-only.
   *
   * This keywords can be used to assist in user interface instance generation.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * The value of this keyword MUST be an array. Elements of this array, if any,
   * MUST be strings, and MUST be unique.
   *
   * An object instance is valid against this keyword if every item in the array
   * is the name of a property in the instance.
   *
   * Omitting this keyword has the same behavior as an empty array.
   *
   * @default []
   */
  required?: string[]
  /**
   * This keyword's value MUST be a valid JSON Schema.
   *
   * When "if" is present, and the instance successfully validates against its
   * subschema, then validation succeeds against this keyword if the instance
   * also successfully validates against this keyword's subschema.
   *
   * This keyword has no effect when "if" is absent, or when the instance fails
   * to validate against its subschema. Implementations MUST NOT evaluate the
   * instance against this keyword, for either validation or annotation
   * collection purposes, in such cases.
   */
  then?: JSONSchema | boolean
  /**
   * Can be used to decorate a user interface with a short label about the data
   * produced.
   */
  title?: string
  /**
   * The value of this keyword MUST be either a string or an array. If it is an
   * array, elements of the array MUST be strings and MUST be unique.
   *
   * String values MUST be one of the six primitive types ("null", "boolean",
   * "object", "array", "number", or "string"), or "integer" which matches any
   * number with a zero fractional part.
   *
   * An instance validates if and only if the instance is in any of the sets
   * listed for this keyword.
   */
  type?:
    | JSONSchemaType
    | JSONSchemaTypeName
    | (JSONSchemaType | JSONSchemaTypeName)[]
  /**
   * The value of this keyword MUST be a boolean.
   *
   * If this keyword has boolean value false, the instance validates
   * successfully. If it has boolean value true, the instance validates
   * successfully if all of its elements are unique.
   *
   * Omitting this keyword has the same behavior as a value of false.
   *
   * @default false
   */
  uniqueItems?: boolean
  /**
   * The value of this keyword MUST be a boolean. When multiple occurrences of
   * this keyword is applicable to a single sub-instance, the resulting value
   * MUST be true if any occurrence specifies a true value, and MUST be false
   * otherwise.
   *
   * If "writeOnly" has a value of boolean true, it indicates that the value is
   * never present when the instance is retrieved from the owning authority. It
   * can be present when sent to the owning authority to update or create the
   * document (or the resource it represents), but it will not be included in
   * any updated or newly created version of the instance.
   *
   * An instance document that is marked as "writeOnly" for the entire document
   * MAY be returned as a blank document of some sort, or MAY produce an error
   * upon retrieval, or have the retrieval request ignored, at the authority's
   * discretion.
   *
   * For example, "writeOnly" would be used to mark a password input field.
   *
   * These keywords can be used to assist in user interface instance generation.
   * In particular, an application MAY choose to use a widget that hides input
   * values as they are typed for write-only fields.
   *
   * @default false
   */
  writeOnly?: boolean
}
/**
 * String formats.
 *
 * @public
 */
export declare enum JSONSchemaFormat {
  /**
   * A string instance is valid against this attribute if it is a valid
   * representation according to the "full-date" production in
   * [RFC 3339][RFC3339].
   *
   * [RFC3339]: http://json-schema.org/latest/json-schema-validation.html#RFC3339
   */
  Date = 'date',
  /**
   * A string instance is valid against this attribute if it is a valid
   * representation according to the "date-time" production in
   * [RFC 3339][RFC3339].
   *
   * [RFC3339]: http://json-schema.org/latest/json-schema-validation.html#RFC3339
   */
  DateTime = 'date-time',
  /**
   * A string instance is valid against these attributes if it is a valid
   * Internet email address as defined by [RFC 5322, section 3.4.1][RFC5322].
   *
   * [RFC5322]: http://json-schema.org/latest/json-schema-validation.html#RFC5322
   */
  Email = 'email',
  /**
   * As defined by [RFC 1034, section 3.1][RFC1034], including host names
   * produced using the Punycode algorithm specified in
   * [RFC 5891, section 4.4][RFC5891].
   *
   * [RFC1034]: http://json-schema.org/latest/json-schema-validation.html#RFC1034
   * [RFC5891]: http://json-schema.org/latest/json-schema-validation.html#RFC5891
   */
  Hostname = 'hostname',
  /**
   * A string instance is valid against these attributes if it is a valid
   * Internet email address as defined by [RFC 6531][RFC6531].
   *
   * [RFC6531]: http://json-schema.org/latest/json-schema-validation.html#RFC6531
   */
  IDNEmail = 'idn-email',
  /**
   * As defined by either [RFC 1034, section 3.1][RFC1034] as for hostname, or
   * an internationalized hostname as defined by
   * [RFC 5890, section 2.3.2.3][RFC5890].
   *
   * [RFC1034]: http://json-schema.org/latest/json-schema-validation.html#RFC1034
   * [RFC5890]: http://json-schema.org/latest/json-schema-validation.html#RFC5890
   */
  IDNHostname = 'idn-hostname',
  /**
   * An IPv4 address according to the "dotted-quad" ABNF syntax as defined in
   * [RFC 2673, section 3.2][RFC2673].
   *
   * [RFC2673]: http://json-schema.org/latest/json-schema-validation.html#RFC2673
   */
  IPv4 = 'ipv4',
  /**
   * An IPv6 address as defined in [RFC 4291, section 2.2][RFC4291].
   *
   * [RFC4291]: http://json-schema.org/latest/json-schema-validation.html#RFC4291
   */
  IPv6 = 'ipv6',
  /**
   * A string instance is valid against this attribute if it is a valid IRI,
   * according to [RFC3987][RFC3987].
   *
   * [RFC3987]: http://json-schema.org/latest/json-schema-validation.html#RFC3987
   */
  IRI = 'iri',
  /**
   * A string instance is valid against this attribute if it is a valid IRI
   * Reference (either an IRI or a relative-reference), according to
   * [RFC3987][RFC3987].
   *
   * [RFC3987]: http://json-schema.org/latest/json-schema-validation.html#RFC3987
   */
  IRIReference = 'iri-reference',
  /**
   * A string instance is valid against this attribute if it is a valid JSON
   * string representation of a JSON Pointer, according to
   * [RFC 6901, section 5][RFC6901].
   *
   * [RFC6901]: http://json-schema.org/latest/json-schema-validation.html#RFC6901
   */
  JSONPointer = 'json-pointer',
  /**
   * A string instance is valid against this attribute if it is a valid JSON
   * string representation of a JSON Pointer fragment, according to
   * [RFC 6901, section 5][RFC6901].
   *
   * [RFC6901]: http://json-schema.org/latest/json-schema-validation.html#RFC6901
   */
  JSONPointerURIFragment = 'json-pointer-uri-fragment',
  /**
   * This attribute applies to string instances.
   *
   * A regular expression, which SHOULD be valid according to the
   * [ECMA 262][ecma262] regular expression dialect.
   *
   * Implementations that validate formats MUST accept at least the subset of
   * [ECMA 262][ecma262] defined in the [Regular Expressions][regexInterop]
   * section of this specification, and SHOULD accept all valid
   * [ECMA 262][ecma262] expressions.
   *
   * [ecma262]: http://json-schema.org/latest/json-schema-validation.html#ecma262
   * [regexInterop]: http://json-schema.org/latest/json-schema-validation.html#regexInterop
   */
  RegEx = 'regex',
  /**
   * A string instance is valid against this attribute if it is a valid
   * [Relative JSON Pointer][relative-json-pointer].
   *
   * [relative-json-pointer]: http://json-schema.org/latest/json-schema-validation.html#relative-json-pointer
   */
  RelativeJSONPointer = 'relative-json-pointer',
  /**
   * A string instance is valid against this attribute if it is a valid
   * representation according to the "time" production in [RFC 3339][RFC3339].
   *
   * [RFC3339]: http://json-schema.org/latest/json-schema-validation.html#RFC3339
   */
  Time = 'time',
  /**
   * A string instance is valid against this attribute if it is a valid URI,
   * according to [RFC3986][RFC3986].
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-validation.html#RFC3986
   */
  URI = 'uri',
  /**
   * A string instance is valid against this attribute if it is a valid URI
   * Reference (either a URI or a relative-reference), according to
   * [RFC3986][RFC3986].
   *
   * [RFC3986]: http://json-schema.org/latest/json-schema-validation.html#RFC3986
   */
  URIReference = 'uri-reference',
  /**
   * A string instance is valid against this attribute if it is a valid URI
   * Template (of any level), according to [RFC6570][RFC6570].
   *
   * Note that URI Templates may be used for IRIs; there is no separate IRI
   * Template specification.
   *
   * [RFC6570]: http://json-schema.org/latest/json-schema-validation.html#RFC6570
   */
  URITemplate = 'uri-template',
  /**
   * UUID
   */
  UUID = 'uuid'
}
/**
 * JSON Schema type.
 *
 * @public
 */
export declare type JSONSchemaTypeName =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string'
/**
 * JSON Schema type.
 *
 * @public
 */
export declare enum JSONSchemaType {
  /**
   * Array
   */
  Array = 'array',
  /**
   * Boolean
   */
  Boolean = 'boolean',
  /**
   * Integer
   */
  Integer = 'integer',
  /**
   * Null
   */
  Null = 'null',
  /**
   * Number
   */
  Number = 'number',
  /**
   * Object
   */
  Object = 'object',
  /**
   * String
   */
  String = 'string'
}
/**
 * Acceptable values for the "type" property.
 *
 * @public
 */
export declare type JSONSchemaTypeValue =
  | JSONSchemaTypeName
  | JSONSchemaType
  | (JSONSchemaType | JSONSchemaTypeName)[]
/**
 * Content encoding name.
 *
 * @public
 */
export declare type JSONSchemaContentEncodingName =
  | '7bit'
  | '8bit'
  | 'binary'
  | 'quoted-printable'
  | 'base64'
  | 'ietf-token'
  | 'x-token'
/**
 * Content encoding strategy.
 *
 * @public
 * {@link https://tools.ietf.org/html/rfc2045#section-6.1}
 * {@link https://stackoverflow.com/questions/25710599/content-transfer-encoding-7bit-or-8-bit/28531705#28531705}
 */
export declare enum JSONSchemaContentEncoding {
  /**
   * Only US-ASCII characters, which use the lower 7 bits for each character.
   *
   * Each line must be less than 1,000 characters.
   */
  '7bit' = '7bit',
  /**
   * Allow extended ASCII characters which can use the 8th (highest) bit to
   * indicate special characters not available in 7bit.
   *
   * Each line must be less than 1,000 characters.
   */
  '8bit' = '8bit',
  /**
   * Same character set as 8bit, with no line length restriction.
   */
  Binary = 'binary',
  /**
   * Lines are limited to 76 characters, and line breaks are represented using
   * special characters that are escaped.
   */
  QuotedPrintable = 'quoted-printable',
  /**
   * Useful for data that is mostly non-text.
   */
  Base64 = 'base64',
  /**
   * An extension token defined by a standards-track RFC and registered with
   * IANA.
   */
  IETFToken = 'ietf-token',
  /**
   * The two characters "X-" or "x-" followed, with no intervening white space,
   * by any token.
   */
  XToken = 'x-token'
}
/**
 * An array containing all the possible keys of a draft-07 JSONSchema.
 *
 * @public
 */
export declare const JSONSchemaKeys: (keyof JSONSchema)[]
