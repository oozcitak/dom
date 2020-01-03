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
      n === 58 || n === 95 || // ':' or '_'
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
      (n >= 0x10000 && n <= 0xEFFFF)) {
      continue
    } else if (i === 0) {
      return false
    } else if (n === 45 || n === 46 || // '-' or '.'
      (n >= 48 && n <= 57) || // [0-9]
      (n === 0xB7) ||
      (n >= 0x0300 && n <= 0x036F) ||
      (n >= 0x203F && n <= 0x2040)) {
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
  let colonFound = false
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
      n === 95 || // or '_'
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
      (n >= 0x10000 && n <= 0xEFFFF)) {
      continue
    } else if (i === 0) {
      return false
    } else if (n === 58) { // ':'
      if (colonFound) return false // multiple colons in qname
      if (i === name.length - 1) return false // colon at the end of qname
      colonFound = true
      continue
    } else if (n === 45 || n === 46 || // '-' or '.'
      (n >= 48 && n <= 57) || // [0-9]
      (n === 0xB7) ||
      (n >= 0x0300 && n <= 0x036F) ||
      (n >= 0x203F && n <= 0x2040)) {
      continue
    } else {
      return false
    }
  }
  return true
}

/**
 * Determines if the given string contains legal characters.
 * 
 * @param chars - sequence of characters to test
 * @param xmlVersion - XML specification version
 */
export function xml_isLegalChar(chars: string, xmlVersion: "1.0" | "1.1" = "1.0"): boolean {
  for (let i = 0; i < chars.length; i++) {
    const c1 = chars.charCodeAt(i)
    let n = c1
    if (c1 >= 0xD800 && c1 <= 0xDBFF && i < chars.length - 1) {
      const c2 = chars.charCodeAt(i + 1)
      if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
        n = (c1 - 0xD800) * 0x400 + c2 - 0xDC00 + 0x10000 
      }
    }

    if (xmlVersion === "1.0") {
      // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
      if (n === 0x9 || n === 0xA || n === 0xD ||
        (n >= 0x20 && n <= 0xD7FF) ||
        (n >= 0xE000 && n <= 0xFFFD) ||
        (n >= 0x10000 && n <= 0x10FFFF)) {
        continue
      } else {
        return false
      }
    } else {
      // [#x1-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
      if ((n >= 0x1 && n <= 0xD7FF) ||
        (n >= 0xE000 && n <= 0xFFFD) ||
        (n >= 0x10000 && n <= 0x10FFFF)) {
        continue
      } else {
        return false
      }
    }
  }
  return true
}

/**
 * Determines if the given string contains legal characters for a public 
 * identifier.
 * 
 * @param chars - sequence of characters to test
 */
export function xml_isPubidChar(chars: string): boolean {
  for (let i = 0; i < chars.length; i++) {
    const c1 = chars.charCodeAt(i)
    let n = c1
    if (c1 >= 0xD800 && c1 <= 0xDBFF && i < chars.length - 1) {
      const c2 = chars.charCodeAt(i + 1)
      if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
        n = (c1 - 0xD800) * 0x400 + c2 - 0xDC00 + 0x10000 
      }
    }

    // #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]
    if ((n >= 97 && n <= 122) || // [a-z]
      (n >= 65 && n <= 90) || // [A-Z]
      (n >= 48 && n <= 57) || // [0-9]
      n === 0x20 || n === 0xD || n === 0xA ||
      n === 45 || n === 39 || n === 40 || n === 41 || n === 43 || n === 44 ||
      n === 46 || n === 47 || n === 58 || n === 61 || n === 63 || n === 59 ||
      n === 33 || n === 42 || n === 35 || n === 64 || n === 36 || n === 95 ||
      n === 37) {
      continue
    } else {
      return false
    }
  }
  return true
}
