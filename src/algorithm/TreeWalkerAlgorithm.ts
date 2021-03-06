import { FilterResult, TreeWalker, Node } from "../dom/interfaces"
import { traversal_filter } from "./TraversalAlgorithm"

/**
 * Returns the first or last child node, or `null` if there are none.
 * 
 * @param walker - the `TreeWalker` instance
 * @param first - `true` to return the first child node, or `false` to 
 * return the last child node.
 */
export function treeWalker_traverseChildren(walker: TreeWalker, first: boolean): Node | null {
  /**
   * 1. Let node be walker’s current.
   * 2. Set node to node’s first child if type is first, and node’s last child
   * if type is last.
   * 3. While node is non-null:
   */
  let node = (first ? walker._current._firstChild : walker._current._lastChild)
  while (node !== null) {
    /**
     * 3.1. Let result be the result of filtering node within walker.
     */
    const result = traversal_filter(walker, node)

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
      const child = (first ? node._firstChild : node._lastChild)
      if (child !== null) {
        node = child
        continue
      }
    }

    /**
     * 3.4. While node is non-null:
     */
    while (node !== null) {
      /**
       * 3.4.1. Let sibling be node’s next sibling if type is first, and
       * node’s previous sibling if type is last.
       * 3.4.2. If sibling is non-null, then set node to sibling and break.
       */
      const sibling = (first ? node._nextSibling : node._previousSibling)
      if (sibling !== null) {
        node = sibling
        break
      }

      /**
       * 3.4.3. Let parent be node’s parent.
       * 3.4.4. If parent is null, walker’s root, or walker’s current, then
       * return null.
       */
      const parent: Node | null = node._parent
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

/**
 * Returns the next or previous sibling node, or `null` if there are none.
 * 
 * @param walker - the `TreeWalker` instance
 * @param next - `true` to return the next sibling node, or `false` to 
 * return the previous sibling node.
 */
export function treeWalker_traverseSiblings(walker: TreeWalker, next: boolean): Node | null {
  /**
   * 1. Let node be walker’s current.
   * 2. If node is root, then return null.
   * 3. While node is non-null:
   */
  let node: Node | null = walker._current
  if (node === walker._root) return null

  while (true) {
    /**
     * 3.1. Let sibling be node’s next sibling if type is next, and node’s
     * previous sibling if type is previous.
     * 3.2. While sibling is non-null:
     */
    let sibling: Node | null = (next ? node._nextSibling : node._previousSibling)

    while (sibling !== null) {
      /**
       * 3.2.1. Set node to sibling.
       * 3.2.2. Let result be the result of filtering node within walker.
       * 3.2.3. If result is FILTER_ACCEPT, then set walker’s current to node
       * and return node.
       */
      node = sibling
      const result = traversal_filter(walker, node)
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
      sibling = (next ? node._firstChild : node._lastChild)
      if (result === FilterResult.Reject || sibling === null) {
        sibling = (next ? node._nextSibling : node._previousSibling)
      }
    }

    /**
     * 3.3. Set node to node’s parent.
     * 3.4. If node is null or walker’s root, then return null.
     */
    node = node._parent
    if (node === null || node === walker._root) {
      return null
    }

    /**
     * 3.5. If the return value of filtering node within walker is FILTER_ACCEPT, 
     * then return null.
     */
    if (traversal_filter(walker, node) === FilterResult.Accept) {
      return null
    }
  }
}
