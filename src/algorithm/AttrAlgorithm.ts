import { Attr } from "../dom/interfaces"
import { element_change } from "./ElementAlgorithm"

/**
 * Changes the value of an existing attribute.
 * 
 * @param attribute - an attribute node
 * @param value - attribute value
 */
export function attr_setAnExistingAttributeValue(attribute: Attr, value: string): void {
  /**
   * 1. If attribute’s element is null, then set attribute’s value to value.
   * 2. Otherwise, change attribute from attribute’s element to value.
   */
  if (attribute._element === null) {
    attribute._value = value
  } else {
    element_change(attribute, attribute._element, value)
  }
}
