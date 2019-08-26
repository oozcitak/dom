import { Element } from '../interfaces'
import { OrderedSet } from './OrderedSet'

/**
 * Includes conversion methods.
 */
export class Convert {

  /**
   * Converts the space separated tokens of an attribute's value to
   * a set.
   * 
   * @param ownerElement - the element owning the attribute
   * @param localName - the name of the attribute
   * 
   * @returns a {@link Set} of tokens
   */
  static attValueToSet(ownerElement: Element, localName: string): Set<string> {
    const attValue = ownerElement.getAttribute(localName) || ''
    return OrderedSet.parse(attValue)
  }

  /**
   * Converts the given set to a space separated token list and sets it
   * as the value of an attribute.
   * 
   * @param ownerElement - the element owning the attribute
   * @param localName - the name of the attribute
   * 
   * @returns a {@link Set} of tokens
   */
  static setToAttValue(ownerElement: Element, localName: string, set: Set<string>) {
    if (!ownerElement.hasAttribute(localName) && set.size === 0)
      return

    const attValue = OrderedSet.serialize(set)
    ownerElement.setAttribute(localName, attValue)
  }
}