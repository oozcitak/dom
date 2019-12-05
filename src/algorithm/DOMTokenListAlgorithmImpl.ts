import { DOMTokenListAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { Element, DOMTokenList } from '../dom/interfaces'

/**
 * Contains DOM token list algorithms.
 */
export class DOMTokenListAlgorithmImpl extends SubAlgorithmImpl implements DOMTokenListAlgorithm {

  /**
   * Initializes a new `DOMTokenListAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  validationSteps(tokenList: DOMTokenList, token: string): boolean {
    /**
     * 1. If the associated attribute’s local name does not define supported 
     * tokens, throw a TypeError.
     * 2. Let lowercase token be a copy of token, in ASCII lowercase.
     * 3. If lowercase token is present in supported tokens, return true.
     * 4. Return false.
     */
    if (!this.dom.hasSupportedTokens(tokenList._attribute._localName)) {
      throw new TypeError(`There are no supported tokens defined for attribute name: '${tokenList._attribute._localName}'.`)
    }
    return this.dom.getSupportedTokens(tokenList._attribute._localName).has(token.toLowerCase())
  }

  /** @inheritdoc */
  updateSteps(tokenList: DOMTokenList): void {
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
    this.dom.element.setAnAttributeValue(tokenList._element,
      tokenList._attribute._localName, this.dom.orderedSet.serialize(tokenList._tokenSet))
  }

  /** @inheritdoc */
  serializeSteps(tokenList: DOMTokenList): string {
    /**
     * A DOMTokenList object’s serialize steps are to return the result of 
     * running get an attribute value given the associated element and the
     * associated attribute’s local name.
     */
    return this.dom.element.getAnAttributeValue(
      tokenList._element, tokenList._attribute._localName)
  }

}
