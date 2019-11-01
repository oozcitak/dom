import { DOMAlgorithm, TreeWalkerAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { TreeWalkerInternal, NodeInternal } from '../dom/interfacesInternal'
import { FilterResult } from '../dom/interfaces'

/**
 * Contains tree walker algorithms.
 */
export class TreeWalkerAlgorithmImpl extends SubAlgorithmImpl implements TreeWalkerAlgorithm {

  /**
   * Initializes a new `TreeWalkerAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  traverseChildren(walker: TreeWalkerInternal, first: boolean): NodeInternal | null {
    /**
     * 1. Let node be walker’s current.
     * 2. Set node to node’s first child if type is first, and node’s last child
     * if type is last.
     * 3. While node is non-null:
     */
    let node = (first ? walker._current.firstChild : walker._current.lastChild) as NodeInternal | null
    while (node !== null) {
      /**
       * 3.1. Let result be the result of filtering node within walker.
       */
      const result = this.dom.traversal.filter(walker, node)

      if (result === FilterResult.Accept) {
        /**
         * 3.2. If result is FILTER_ACCEPT, then set walker’s current to node and
         * return node.
         */
        walker._current = node
        return node
      } else if (result === FilterResult.Skip) {
        /**
         * 3.3. If result is FILTER_SKIP, then:
         * 3.3.1. Let child be node’s first child if type is first, and node’s
         * last child if type is last.
         * 3.3.2. If child is non-null, then set node to child and continue.
         */
        const child = (first ? node.firstChild : node.lastChild) as NodeInternal | null
        if (child !== null) {
          node = child
          continue
        }
      }

      /**
       * 3.4. While node is non-null:
       */
      while (node) {
        /**
         * 3.4.1. Let sibling be node’s next sibling if type is first, and
         * node’s previous sibling if type is last.
         * 3.4.2. If sibling is non-null, then set node to sibling and break.
         */
        const sibling = (first ? node.nextSibling : node.previousSibling) as NodeInternal | null
        if (sibling !== null) {
          node = sibling
          break
        }

        /**
         * 3.4.3. Let parent be node’s parent.
         * 3.4.4. If parent is null, walker’s root, or walker’s current, then
         * return null.
         */
        const parent = node.parentNode as NodeInternal | null
        if (parent === null || parent === walker._root || parent === walker._current) {
          return null
        }
        /**
         * 3.4.5. Set node to parent.
         */
        node = parent
      }
    }

    /** 
     * 5. Return null 
     */
    return null
  }

  /** @inheritdoc */
  traverseSiblings(walker: TreeWalkerInternal, next: boolean): NodeInternal | null {
    /**
     * 1. Let node be walker’s current.
     * 2. If node is root, then return null.
     * 3. While node is non-null:
     */
    let node: NodeInternal | null = walker._current as NodeInternal
    if (node === walker._root) return null

    while(true) {
      /**
       * 3.1. Let sibling be node’s next sibling if type is next, and node’s
       * previous sibling if type is previous.
       * 3.2. While sibling is non-null:
       */
      let sibling = (next ? node.nextSibling : node.previousSibling)  as NodeInternal | null

      while (sibling) {
        /**
         * 3.2.1. Set node to sibling.
         * 3.2.2. Let result be the result of filtering node within walker.
         * 3.2.3. If result is FILTER_ACCEPT, then set walker’s current to node
         * and return node.
         */
        node = sibling
        const result = this.dom.traversal.filter(walker, node)
        if (result === FilterResult.Accept) {
          walker._current = node
          return node
        }

        /**
         * 3.2.4. Set sibling to node’s first child if type is next, and node’s
         * last child if type is previous.
         * 3.2.5. If result is FILTER_REJECT or sibling is null, then set
         * sibling to node’s next sibling if type is next, and node’s previous
         * sibling if type is previous.
         */
        sibling = (next ? node.firstChild : node.lastChild) as NodeInternal | null
        if (result === FilterResult.Reject || sibling === null) {
          sibling = (next ? node.nextSibling : node.previousSibling) as NodeInternal | null
        }
      }

      /**
       * 3.3. Set node to node’s parent.
       * 3.4. If node is null or walker’s root, then return null.
       */
      node = node.parentNode as NodeInternal | null
      if (node === null || node === walker._root) {
        return null
      }

      /**
       * 3.5. If the return value of filtering node within walker is FILTER_ACCEPT, 
       * then return null.
       */
      if (this.dom.traversal.filter(walker, node) === FilterResult.Accept) {
        return null
      }
    }
  }

}
