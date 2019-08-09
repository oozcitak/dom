import { BoundaryPointAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { NodeInternal } from '../interfacesInternal'
import { BoundaryPoint, BoundaryPosition } from '../interfaces'

/**
 * Contains boundary point algorithms.
 */
export class BoundaryPointAlgorithmImpl extends SubAlgorithmImpl implements BoundaryPointAlgorithm {

  /**
   * Initializes a new `BoundaryPointAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  position(bp: BoundaryPoint, relativeTo: BoundaryPoint): BoundaryPosition {

    const nodeA = bp[0] as NodeInternal
    const offsetA = bp[1]
    const nodeB = relativeTo[0] as NodeInternal
    const offsetB = relativeTo[1]

    /**
     * 1. Assert: nodeA and nodeB have the same root.
     */
    if (this.dom.tree.rootNode(nodeA) !== this.dom.tree.rootNode(nodeB)) {
      throw new Error("Boundary points must share the same root node.")
    }

    /**
     * 2. If nodeA is nodeB, then return equal if offsetA is offsetB, before 
     * if offsetA is less than offsetB, and after if offsetA is greater than
     * offsetB.
     */
    if (nodeA === nodeB) {
      if (offsetA === offsetB) {
        return BoundaryPosition.Equal
      } else if (offsetA < offsetB) {
        return BoundaryPosition.Before
      } else {
        return BoundaryPosition.After        
      }
    }

    /**
     * 3. If nodeA is following nodeB, then if the position of (nodeB, offsetB) 
     * relative to (nodeA, offsetA) is before, return after, and if it is after, 
     * return before.
     */
    if (this.dom.tree.isFollowing(nodeB, nodeA)) {
      if (this.position(relativeTo, bp) === BoundaryPosition.Before) {
        return BoundaryPosition.After
      } else {
        return BoundaryPosition.Before
      }
    }

    /**
     * 4. If nodeA is an ancestor of nodeB:
     */
    if (this.dom.tree.isAncestorOf(nodeB, nodeA)) {
      /**
       * 4.1. Let child be nodeB.
       * 4.2. While child is not a child of nodeA, set child to its parent.
       * 4.3. If child’s index is less than offsetA, then return after.
       */
      let child = nodeB

      while (!this.dom.tree.isChildOf(nodeA, child)) {
        if (child.parentNode === null) {
          throw new Error("Node has no parent node.")
        } else {
          child = child.parentNode as NodeInternal
        }
      }

      if (this.dom.tree.index(child) < offsetA) {
        return BoundaryPosition.After
      }
    }

    /**
     * 5. Return before.
     */
    return BoundaryPosition.Before
  }

  /** @inheritdoc */
  nodeStart(node: NodeInternal): BoundaryPoint {
    return [node, 0]
  }

  /** @inheritdoc */
  nodeEnd(node: NodeInternal): BoundaryPoint {
    return [node, this.dom.tree.nodeLength(node)]
  }

 }
