import { dom } from "../dom"

/**
 * Determines if the given string is valid for a `"Name"` construct.
 * 
 * @param name - name string to test
 */
export function xml_isName(name: string): boolean {
  return dom.regExp.Name.value.test(name)
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
