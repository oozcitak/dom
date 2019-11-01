import { Element, NonDocumentTypeChildNode } from './interfaces'
import { Cast, Guard } from '../util'

/**
 * Represents a mixin that extends child nodes that can have siblings
 * other than doctypes. This mixin is implemented by {@link Element} and
 * {@link CharacterData}.
 */
export class NonDocumentTypeChildNodeImpl implements NonDocumentTypeChildNode {

  /** @inheritdoc */
  get previousElementSibling(): Element | null {
    /**
     * The previousElementSibling attribute’s getter must return the first 
     * preceding sibling that is an element, and null otherwise.
     */
    let node = Cast.asNode(this).previousSibling
    while (node) {
      if (Guard.isElementNode(node))
        return node
      else
        node = node.previousSibling
    }
    return null
  }

  /** @inheritdoc */
  get nextElementSibling(): Element | null {
    /**
     * The nextElementSibling attribute’s getter must return the first 
     * following sibling that is an element, and null otherwise.
     */
    let node = Cast.asNode(this).nextSibling
    while (node) {
      if (Guard.isElementNode(node))
        return node
      else
        node = node.nextSibling
    }
    return null
  }

}
