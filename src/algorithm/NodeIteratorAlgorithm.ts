import { dom } from "../dom/DOMImpl"
import { FilterResult, Node, NodeIterator } from "../dom/interfaces"
import { FixedSizeSet } from "@oozcitak/util"
import { traversal_filter } from "./TraversalAlgorithm"
import { tree_getFollowingNode, tree_getPrecedingNode } from "./TreeAlgorithm"

/**
 * Returns the next or previous node in the subtree, or `null` if 
 * there are none.
 * 
 * @param iterator - the `NodeIterator` instance
 * @param forward- `true` to return the next node, or `false` to 
 * return the previous node.
 */
export function nodeIterator_traverse(iterator: NodeIterator, forward: boolean): Node | null {
  /**
   * 1. Let node be iterator’s reference.
   * 2. Let beforeNode be iterator’s pointer before reference.
   */
  let node = iterator._reference
  let beforeNode = iterator._pointerBeforeReference

  /**
   * 3. While true:
   */
  while (true) {
    /**
     * 3.1. Branch on direction:
     */
    if (forward) {
      /**
       * - next
       */
      if (!beforeNode) {
        /**
         * If beforeNode is false, then set node to the first node following
         * node in iterator’s iterator collection. If there is no such node, 
         * then return null.
         */
        const nextNode = tree_getFollowingNode(iterator._root, node)
        if (nextNode) {
          node = nextNode
        } else {
          return null
        }
      } else {
        /**
         * If beforeNode is true, then set it to false.
         */
        beforeNode = false
      }
    } else {
      /**
       * - previous
       */
      if (beforeNode) {
        /**
         * If beforeNode is true, then set node to the first node preceding 
         * node in iterator’s iterator collection. If there is no such node,
         * then return null.
         */
        const prevNode = tree_getPrecedingNode(iterator.root, node)
        if (prevNode) {
          node = prevNode
        } else {
          return null
        }
      } else {
        /**
         * If beforeNode is false, then set it to true.
         */
        beforeNode = true
      }
    }

    /**
     * 3.2. Let result be the result of filtering node within iterator.
     * 3.3. If result is FILTER_ACCEPT, then break.
     */
    const result = traversal_filter(iterator, node)
    if (result === FilterResult.Accept) {
      break
    }
  }

  /**
   * 4. Set iterator’s reference to node.
   * 5. Set iterator’s pointer before reference to beforeNode.
   * 6. Return node.
   */
  iterator._reference = node
  iterator._pointerBeforeReference = beforeNode
  return node
}

/**
 * Gets the global iterator list.
 */
export function nodeIterator_iteratorList(): FixedSizeSet<NodeIterator> {
  return dom.window._iteratorList
}
