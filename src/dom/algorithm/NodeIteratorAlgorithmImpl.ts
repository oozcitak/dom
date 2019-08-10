import { DOMAlgorithm, NodeIteratorAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { NodeInternal, NodeIteratorInternal } from '../interfacesInternal'
import { FilterResult } from '../interfaces'

/**
 * Contains tree walker algorithms.
 */
export class NodeIteratorAlgorithmImpl extends SubAlgorithmImpl implements NodeIteratorAlgorithm {

  /**
   * Initializes a new `NodeIteratorAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  traverse(iterator: NodeIteratorInternal, forward: boolean): NodeInternal | null {
    /**
     * 1. Let node be iterator’s reference.
     * 2. Let beforeNode be iterator’s pointer before reference.
     */
    let node = iterator._reference as NodeInternal
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
          const nextNode = this.dom.tree.getFollowingNode(
            iterator._root as NodeInternal, node)
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
          const prevNode = this.dom.tree.getPrecedingNode(
            iterator.root as NodeInternal, node as NodeInternal)
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
      const result = this.dom.traverse.filter(iterator, node)
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

}
