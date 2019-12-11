import { DOMTokenList } from "../dom/interfaces"
import { orderedSet_serialize } from "./OrderedSetAlgorithm"
import { dom_hasSupportedTokens, dom_getSupportedTokens } from "./DOMAlgorithm"
import {
  element_setAnAttributeValue, element_getAnAttributeValue
} from "./ElementAlgorithm"

/**
 * Validates a given token against the supported tokens defined for the given
 * token lists' associated attribute.
 * 
 * @param tokenList - a token list
 * @param token - a token
 */
export function tokenList_validationSteps(tokenList: DOMTokenList,
  token: string): boolean {
  /**
   * 1. If the associated attribute’s local name does not define supported 
   * tokens, throw a TypeError.
   * 2. Let lowercase token be a copy of token, in ASCII lowercase.
   * 3. If lowercase token is present in supported tokens, return true.
   * 4. Return false.
   */
  if (!dom_hasSupportedTokens(tokenList._attribute._localName)) {
    throw new TypeError(`There are no supported tokens defined for attribute name: '${tokenList._attribute._localName}'.`)
  }
  return dom_getSupportedTokens(tokenList._attribute._localName).has(token.toLowerCase())
}

/**
 * Updates the value of the token lists' associated attribute.
 * 
 * @param tokenList - a token list
 */
export function tokenList_updateSteps(tokenList: DOMTokenList): void {
  /**
   * 1. If the associated element does not have an associated attribute and 
   * token set is empty, then return.
   * 2. Set an attribute value for the associated element using associated
   * attribute’s local name and the result of running the ordered set
   * serializer for token set.
   */
  if (!tokenList._element.hasAttribute(tokenList._attribute._localName) &&
    tokenList._tokenSet.size === 0) {
    return
  }
  element_setAnAttributeValue(tokenList._element,
    tokenList._attribute._localName, orderedSet_serialize(tokenList._tokenSet))
}

/**
 * Gets the value of the token lists' associated attribute.
 * 
 * @param tokenList - a token list
 */
export function tokenList_serializeSteps(tokenList: DOMTokenList): string {
  /**
   * A DOMTokenList object’s serialize steps are to return the result of 
   * running get an attribute value given the associated element and the
   * associated attribute’s local name.
   */
  return element_getAnAttributeValue(
    tokenList._element, tokenList._attribute._localName)
}
