import { Element } from './interfaces'
import { NonElementParentNodeInternal } from './interfacesInternal'
import { Cast } from './util/Cast'
import { globalStore } from '../util'
import { DOMAlgorithm } from './algorithm/interfaces'

/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */
export class NonElementParentNodeImpl implements NonElementParentNodeInternal {

  /** @inheritdoc */
  getElementById(id: string): Element | null {
    /**
     * The getElementById(elementId) method, when invoked, must return the first
     * element, in tree order, within the context object’s descendants, 
     * whose ID is elementId, and null if there is no such element otherwise.
     */
    const algo = globalStore.algorithm as DOMAlgorithm
    for (const ele of algo.tree.getDescendantElements(Cast.asNode(this))) {
      if (ele._uniqueIdentifier === id) {
        return ele
      }
    }

    return null
  }
  
}
