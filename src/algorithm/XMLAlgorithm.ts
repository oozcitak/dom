const Name = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/
const QName = /^(([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-9A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*:([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-9A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*)|(([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-9A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*)$/
const PubidChar = /^[\x20\x0D\x0AA-Z-a-z0-9-'()+,./:=?;!*#@$_%]*$/

/** 
 * Valid characters for XML 1.0 from https://www.w3.org/TR/xml/#charsets.
 * 
 * Any Unicode character, excluding the surrogate blocks, `FFFE`, and `FFFF`.
 * 
 * `#x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]`
 * 
 * This ES5 compatible Regexp has been generated using the `"regenerate"` NPM
 * module:
 * ```ts
 * let xml_10_InvalidChars = regenerate()
 *   .addRange(0x0000, 0x0008)
 *   .add(0x000B, 0x000C)
 *   .addRange(0x000E, 0x001F)
 *   .addRange(0xD800, 0xDFFF)
 *   .addRange(0xFFFE, 0xFFFF)
 * ```
 */
const InvalidChar_10 = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/

/**
 * Valid characters for XML 1.1 from https://www.w3.org/TR/xml11/#charsets.
 * 
 * Any Unicode character, excluding the surrogate blocks, `FFFE`, and `FFFF`.
 * 
 * `[#x1-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]`
 * 
 * This ES5 compatible Regexp has been generated using the `"regenerate"` NPM
 * module:
 * ```ts
 * let xml_11_InvalidChars = regenerate()
 *   .add(0x0000)
 *   .addRange(0xD800, 0xDFFF)
 *   .addRange(0xFFFE, 0xFFFF)
 * ```
 */
const InvalidChar_11 = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/

/**
 * Determines if the given string is valid for a `"Name"` construct.
 * 
 * @param name - name string to test
 */
export function xml_isName(name: string): boolean {
  return Name.test(name)
}

/**
 * Determines if the given string is valid for a `"QName"` construct.
 * 
 * @param name - name string to test
 */
export function xml_isQName(name: string): boolean {
  return QName.test(name)
}

/**
 * Determines if the given string contains legal characters.
 * 
 * @param chars - sequence of characters to test
 * @param xmlVersion - XML specification version
 */
export function xml_isLegalChar(chars: string, xmlVersion: "1.0" | "1.1" = "1.0"): boolean {
  if (xmlVersion === "1.0") {
    return (!InvalidChar_10.test(chars))
  } else {
    return (!InvalidChar_11.test(chars))
  }
}


/**
 * Determines if the given string contains legal characters for a public 
 * identifier.
 * 
 * @param chars - sequence of characters to test
 */
export function xml_isPubidChar(chars: string): boolean {
  return PubidChar.test(chars)
}
