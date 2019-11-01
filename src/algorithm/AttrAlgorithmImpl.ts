import { DOMAlgorithm, AttrAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { Attr, Element } from '../dom/interfaces'

/**
 * Contains attribute algorithms.
 */
export class AttrAlgorithmImpl extends SubAlgorithmImpl implements AttrAlgorithm {

  /**
   * Initializes a new `AttrAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  setAnExistingAttributeValue(attribute: Attr, value: string): void {
    /**
     * 1. If attribute’s element is null, then set attribute’s value to value.
     * 2. Otherwise, change attribute from attribute’s element to value.
     */
    if(attribute._element === null) {
      attribute._value = value
    } else {
      this.dom.element.change(attribute, attribute._element as Element, value)
    }
  }

}
