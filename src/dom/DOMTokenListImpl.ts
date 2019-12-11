import { dom } from "../"
import { SyntaxError, InvalidCharacterError } from "./DOMException"
import { DOMTokenList, Element, Attr } from "./interfaces"
import { codePoint as infraCodePoint, set as infraSet } from "@oozcitak/infra"
import {
  dom_runAttributeChangeSteps, element_getAnAttributeValue,
  element_setAnAttributeValue, tokenList_updateSteps, tokenList_validationSteps,
  tokenList_serializeSteps, orderedSet_parse
} from "../algorithm"

/**
 * Represents a token set.
 */
export class DOMTokenListImpl implements DOMTokenList {

  _element: Element
  _attribute: Attr
  _tokenSet: Set<string>

  /**
   * Initializes a new instance of `DOMTokenList`.
   *
   * @param element - associated element
   * @param attribute - associated attribute
   */
  private constructor(element: Element, attribute: Attr) {

    /**
     * 1. Let element be associated element.
     * 2. Let localName be associated attribute’s local name.
     * 3. Let value be the result of getting an attribute value given element 
     * and localName.
     * 4. Run the attribute change steps for element, localName, value, value, 
     * and null.
     */
    this._element = element
    this._attribute = attribute
    this._tokenSet = new Set()

    const localName = attribute._localName
    const value = element_getAnAttributeValue(element, localName)

    // define a closure to be called when the associated attribute's value changes
    const thisObj = this
    function updateTokenSet(element: Element, localName: string,
      oldValue: string | null, value: string | null, namespace: string | null): void {
      /**
       * 1. If localName is associated attribute’s local name, namespace is null,
       * and value is null, then empty token set.
       * 2. Otherwise, if localName is associated attribute’s local name,
       * namespace is null, then set token set to value, parsed.
       */
      if (localName === thisObj._attribute.localName && namespace === null) {
        if (!value)
          thisObj._tokenSet.clear()
        else
          thisObj._tokenSet = orderedSet_parse(value)
      }
    }
    // add the closure to the associated element's attribute change steps
    this._element._attributeChangeSteps.push(updateTokenSet)

    if (dom.features.steps) {
      dom_runAttributeChangeSteps(element, localName, value, value, null)
    }
  }

  /** @inheritdoc */
  get length(): number {
    /**
     * The length attribute' getter must return context object’s token set’s 
     * size.
     */
    return this._tokenSet.size
  }

  /** @inheritdoc */
  item(index: number): string | null {
    /**
     * 1. If index is equal to or greater than context object’s token set’s 
     * size, then return null.
     * 2. Return context object’s token set[index].
     */
    let i = 0
    for (const token of this._tokenSet) {
      if (i === index) return token
      i++
    }
    return null
  }

  /** @inheritdoc */
  contains(token: string): boolean {
    /**
     * The contains(token) method, when invoked, must return true if context 
     * object’s token set[token] exists, and false otherwise.
     */
    return this._tokenSet.has(token)
  }

  /** @inheritdoc */
  add(...tokens: string[]): void {
    /**
     * 1. For each token in tokens:
     * 1.1. If token is the empty string, then throw a "SyntaxError" 
     * DOMException.
     * 1.2. If token contains any ASCII whitespace, then throw an 
     * "InvalidCharacterError" DOMException.
     * 2. For each token in tokens, append token to context object’s token set.
     * 3. Run the update steps.
     */
    for (const token of tokens) {
      if (token === '') {
        throw new SyntaxError("Cannot add an empty token.")
      } else if (infraCodePoint.ASCIIWhiteSpace.test(token)) {
        throw new InvalidCharacterError("Token cannot contain whitespace.")
      } else {
        this._tokenSet.add(token)
      }
    }
    tokenList_updateSteps(this)
  }

  /** @inheritdoc */
  remove(...tokens: string[]): void {
    /**
     * 1. For each token in tokens:
     * 1.1. If token is the empty string, then throw a "SyntaxError" 
     * DOMException.
     * 1.2. If token contains any ASCII whitespace, then throw an 
     * "InvalidCharacterError" DOMException.
     * 2. For each token in tokens, remove token from context object’s token set.
     * 3. Run the update steps.
     */
    for (const token of tokens) {
      if (token === '') {
        throw new SyntaxError("Cannot remove an empty token.")
      } else if (infraCodePoint.ASCIIWhiteSpace.test(token)) {
        throw new InvalidCharacterError("Token cannot contain whitespace.")
      } else {
        this._tokenSet.delete(token)
      }
    }
    tokenList_updateSteps(this)
  }

  /** @inheritdoc */
  toggle(token: string, force: boolean | undefined = undefined): boolean {
    /**
     * 1. If token is the empty string, then throw a "SyntaxError" DOMException.
     * 2. If token contains any ASCII whitespace, then throw an 
     * "InvalidCharacterError" DOMException.
     */
    if (token === '') {
      throw new SyntaxError("Cannot toggle an empty token.")
    } else if (infraCodePoint.ASCIIWhiteSpace.test(token)) {
      throw new InvalidCharacterError("Token cannot contain whitespace.")
    }

    /**
     * 3. If context object’s token set[token] exists, then:
     */
    if (this._tokenSet.has(token)) {
      /**
       * 3.1. If force is either not given or is false, then remove token from 
       * context object’s token set, run the update steps and return false.
       * 3.2. Return true.
       */
      if (force === undefined || force === false) {
        this._tokenSet.delete(token)
        tokenList_updateSteps(this)
        return false
      }

      return true
    }

    /**
     * 4. Otherwise, if force not given or is true, append token to context 
     * object’s token set, run the update steps, and return true.
     */
    if (force === undefined || force === true) {
      this._tokenSet.add(token)
      tokenList_updateSteps(this)
      return true
    }

    /**
     * 5. Return false.
     */
    return false
  }

  /** @inheritdoc */
  replace(token: string, newToken: string): boolean {
    /**
     * 1. If either token or newToken is the empty string, then throw a 
     * "SyntaxError" DOMException.
     * 2. If either token or newToken contains any ASCII whitespace, then throw
     * an "InvalidCharacterError" DOMException.
     */
    if (token === '' || newToken === '') {
      throw new SyntaxError("Cannot replace an empty token.")
    } else if (infraCodePoint.ASCIIWhiteSpace.test(token) || infraCodePoint.ASCIIWhiteSpace.test(newToken)) {
      throw new InvalidCharacterError("Token cannot contain whitespace.")
    }

    /**
     * 3. If context object’s token set does not contain token, then return 
     * false.
     */
    if (!this._tokenSet.has(token)) return false

    /**
     * 4. Replace token in context object’s token set with newToken.
     * 5. Run the update steps.
     * 6. Return true.
     */
    infraSet.replace(this._tokenSet, token, newToken)
    tokenList_updateSteps(this)
    return true
  }

  /** @inheritdoc */
  supports(token: string): boolean {
    /**
     * 1. Let result be the return value of validation steps called with token.
     * 2. Return result.
     */
    return tokenList_validationSteps(this, token)
  }

  /** @inheritdoc */
  get value(): string {
    /**
     * The value attribute must return the result of running context object’s 
     * serialize steps.
     */
    return tokenList_serializeSteps(this)
  }
  set value(value: string) {
    /**
     * Setting the value attribute must set an attribute value for the
     * associated element using associated attribute’s local name and the given
     * value.
     */
    element_setAnAttributeValue(this._element,
      this._attribute.localName, value)
  }

  /**
   * Returns an iterator for the token set.
   */
  [Symbol.iterator](): Iterator<string> {
    const it = this._tokenSet[Symbol.iterator]()

    return {
      next(): IteratorResult<string> {
        return it.next()
      }
    }
  }

  /**
   * Creates a new `DOMTokenList`.
   *
   * @param element - associated element
   * @param attribute - associated attribute
   */
  static _create(element: Element, attribute: Attr): DOMTokenListImpl {
    return new DOMTokenListImpl(element, attribute)
  }

}