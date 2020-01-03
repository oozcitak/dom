import { dom } from "../dom"

/**
 * Determines if the given string is valid for a `"Name"` construct.
 * 
 * @param name - name string to test
 */
export function xml_isName(name: string): boolean {
  for (let i = 0; i < name.length; i++) {
    const c1 = name.charCodeAt(i)
    let n = c1
    if (c1 >= 0xD800 && c1 <= 0xDBFF && i < name.length - 1) {
      const c2 = name.charCodeAt(i + 1)
      if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
        n = (c1 - 0xD800) * 0x400 + c2 - 0xDC00 + 0x10000 
      }
    }

    // NameStartChar
    if ((n >= 97 && n <= 122) || // [a-z]
      (n >= 65 && n <= 90) || // [A-Z]
      (n === 58 || n === 95 || // ':' or '_'
      (n >= 0xC0 && n <= 0xD6) ||
      (n >= 0xD8 && n <= 0xF6) ||
      (n >= 0xF8 && n <= 0x2FF) ||
      (n >= 0x370 && n <= 0x37D) ||
      (n >= 0x37F && n <= 0x1FFF) ||
      (n >= 0x200C && n <= 0x200D) ||
      (n >= 0x2070 && n <= 0x218F) ||
      (n >= 0x2C00 && n <= 0x2FEF) ||
      (n >= 0x3001 && n <= 0xD7FF) ||
      (n >= 0xF900 && n <= 0xFDCF) ||
      (n >= 0xFDF0 && n <= 0xFFFD) ||
      (n >= 0x10000 && n <= 0xEFFFF))) {
      continue
    } else if (i === 0) {
      return false
    } else if ((n === 45 || n === 46 || // '-' or '.'
      (n >= 48 && n <= 57) || // [0-9]
      (n === 0xB7) ||
      (n >= 0x0300 && n <= 0x036F) ||
      (n >= 0x203F && n <= 0x2040))) {
      continue
    } else {
      return false
    }
  }
  return true
}

/**
 * Determines if the given string is valid for a `"QName"` construct.
 * 
 * @param name - name string to test
 */
export function xml_isQName(name: string): boolean {
  return dom.regExp.QName.value.test(name)
}

/**
 * Determines if the given string contains legal characters.
 * 
 * @param chars - sequence of characters to test
 * @param xmlVersion - XML specification version
 */
export function xml_isLegalChar(chars: string, xmlVersion: "1.0" | "1.1" = "1.0"): boolean {
  if (xmlVersion === "1.0") {
    return (!dom.regExp.InvalidChar_10.value.test(chars))
  } else {
    return (!dom.regExp.InvalidChar_11.value.test(chars))
  }
}


/**
 * Determines if the given string contains legal characters for a public 
 * identifier.
 * 
 * @param chars - sequence of characters to test
 */
export function xml_isPubidChar(chars: string): boolean {
  return dom.regExp.PubidChar.value.test(chars)
}
