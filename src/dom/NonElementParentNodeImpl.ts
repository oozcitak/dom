import { Element, NonElementParentNode } from "./interfaces"
import { Cast } from "../util"
import { tree_getDescendantElements } from "../algorithm"

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
    for (const ele of tree_getDescendantElements(Cast.asNode(this))) {
      if (ele._uniqueIdentifier === id) {
        return ele
      }
    }

    return null
  }

}
