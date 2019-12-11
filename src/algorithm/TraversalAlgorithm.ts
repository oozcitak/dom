import { FilterResult, NodeIterator, Node, TreeWalker } from "../dom/interfaces"
import { InvalidStateError } from "../dom/DOMException"

/**
 * Applies the filter to the given node and returns the result.
 * 
 * @param traverser - the `NodeIterator` or `TreeWalker` instance
 * @param node - the node to filter
 */
export function traversal_filter(traverser: NodeIterator | TreeWalker,
  node: Node): FilterResult {
  /**
   * 1. If traverser’s active flag is set, then throw an "InvalidStateError"
   * DOMException.
   */
  if (traverser._activeFlag) {
    throw new InvalidStateError()
  }

  /**
   * 2. Let n be node’s nodeType attribute value − 1.
   */
  const n = node.nodeType - 1

  /**
   * 3. If the nth bit (where 0 is the least significant bit) of traverser’s 
   * whatToShow is not set, then return FILTER_SKIP.
   */
  const mask = 1 << n
  if ((traverser.whatToShow & mask) === 0) {
    return FilterResult.Skip
  }

  /**
   * 4. If traverser’s filter is null, then return FILTER_ACCEPT.
   */
  if (!traverser.filter) {
    return FilterResult.Accept
  }

  /**
   * 5. Set traverser’s active flag.
   */
  traverser._activeFlag = true

  /**
   * 6. Let result be the return value of call a user object’s operation with
   * traverser’s filter, "acceptNode", and « node ». If this throws an
   * exception, then unset traverser’s active flag and rethrow the exception.
   */
  let result = FilterResult.Reject
  try {
    result = traverser.filter.acceptNode(node)
  } catch (err) {
    traverser._activeFlag = false
    throw err
  }

  /**
   * 7. Unset traverser’s active flag.
   * 8. Return result.
   */
  traverser._activeFlag = false
  return result
}
