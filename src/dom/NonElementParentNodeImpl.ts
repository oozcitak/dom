import { Element, NonElementParentNode } from "./interfaces"
import { Cast, Guard } from "../util"
import { tree_getFirstDescendantNode, tree_getNextDescendantNode } from "../algorithm"

/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */
export class NonElementParentNodeImpl implements NonElementParentNode {

  /** @inheritdoc */
  getElementById(id: string): Element | null {
    /**
     * The getElementById(elementId) method, when invoked, must return the first
     * element, in tree order, within the context object’s descendants, 
     * whose ID is elementId, and null if there is no such element otherwise.
     */
    let ele = tree_getFirstDescendantNode(Cast.asNode(this), false, false, 
      (e) => Guard.isElementNode(e)) as Element | null
    while (ele !== null) {
      if (ele._uniqueIdentifier === id) {
        return ele
      }
      ele = tree_getNextDescendantNode(Cast.asNode(this), ele, false, false, 
        (e) => Guard.isElementNode(e)) as Element | null
    }

    return null
  }

}
