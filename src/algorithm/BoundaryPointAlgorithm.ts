import { BoundaryPoint, BoundaryPosition } from "../dom/interfaces"
import { 
  tree_index, tree_isAncestorOf, tree_isChildOf, tree_isFollowing, 
  tree_rootNode
} from "./TreeAlgorithm"

/**
 * Defines the position of a boundary point relative to another.
 * 
 * @param bp - a boundary point
 * @param relativeTo - a boundary point to compare to
 */
export function boundaryPoint_position(bp: BoundaryPoint, relativeTo: BoundaryPoint): BoundaryPosition {

  const nodeA = bp[0]
  const offsetA = bp[1]
  const nodeB = relativeTo[0]
  const offsetB = relativeTo[1]

  /**
   * 1. Assert: nodeA and nodeB have the same root.
   */
  console.assert(tree_rootNode(nodeA) === tree_rootNode(nodeB),
    "Boundary points must share the same root node.")

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
  if (tree_isFollowing(nodeB, nodeA)) {
    const pos = boundaryPoint_position([nodeB, offsetB], [nodeA, offsetA])
    if (pos === BoundaryPosition.Before) {
      return BoundaryPosition.After
    } else if (pos === BoundaryPosition.After) {
      return BoundaryPosition.Before
    }
  }

  /**
   * 4. If nodeA is an ancestor of nodeB:
   */
  if (tree_isAncestorOf(nodeB, nodeA)) {
    /**
     * 4.1. Let child be nodeB.
     * 4.2. While child is not a child of nodeA, set child to its parent.
     * 4.3. If child’s index is less than offsetA, then return after.
     */
    let child = nodeB

    while (!tree_isChildOf(nodeA, child)) {
      if (child._parent === null) {
        throw new Error("Node has no parent node.")
      } else {
        child = child._parent
      }
    }

    if (tree_index(child) < offsetA) {
      return BoundaryPosition.After
    }
  }

  /**
   * 5. Return before.
   */
  return BoundaryPosition.Before
}
