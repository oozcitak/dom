import { Event, Node, Document, Element, NodeIterator } from "../dom/interfaces"
import { tree_isAncestorOf, tree_getFollowingNode, tree_isDescendantOf, tree_getDescendantElements } from "./TreeAlgorithm"

const supportedTokens = new Map()

/**
 * Runs removing steps for node.
 * 
 * @param removedNode - removed node
 * @param oldParent - old parent node
 */
export function dom_runRemovingSteps(removedNode: Node, oldParent?: Node | null): void {
  // No steps defined
}

/**
 * Runs cloning steps for node.
 * 
 * @param copy - node clone
 * @param node - node
 * @param document - document to own the cloned node
 * @param cloneChildrenFlag - whether child nodes are cloned
 */
export function dom_runCloningSteps(copy: Node, node: Node, document: Document, 
  cloneChildrenFlag?: boolean): void {
  // No steps defined
}

/**
 * Runs adopting steps for node.
 * 
 * @param node - node
 * @param oldDocument - old document
 */
export function dom_runAdoptingSteps(node: Node, oldDocument: Document): void {
  // No steps defined
}

/**
 * Runs attribute change steps for an element node.
 * 
 * @param element - element node owning the attribute
 * @param localName - attribute's local name
 * @param oldValue - attribute's old value
 * @param value - attribute's new value
 * @param namespace - attribute's namespace
 */
export function dom_runAttributeChangeSteps(element: Element, localName: string, 
  oldValue: string | null, value: string | null,
  namespace: string | null): void {
  for (const attributeChangeStep of element._attributeChangeSteps) {
    attributeChangeStep.call(element, element, localName, oldValue, value, namespace)
  }
}

/**
 * Runs insertion steps for a node.
 * 
 * @param insertedNode - inserted node
 */
export function dom_runInsertionSteps(insertedNode: Node): void {
  // No steps defined
}

/**
 * Runs pre-removing steps for a node iterator and node.
 * 
 * @param nodeIterator - a node iterator
 * @param toBeRemoved - node to be removed
 */
export function dom_runNodeIteratorPreRemovingSteps(nodeIterator: NodeIterator,
  toBeRemoved: Node): void {
  removeNodeIterator.call(nodeIterator, nodeIterator, toBeRemoved)
}

/**
 * Determines if there are any supported tokens defined for the given 
 * attribute name.
 * 
 * @param attributeName - an attribute name
 */
export function dom_hasSupportedTokens(attributeName: string): boolean {
  return supportedTokens.has(attributeName)
}

/**
 * Returns the set of supported tokens defined for the given attribute name.
 * 
 * @param attributeName - an attribute name
 */
export function dom_getSupportedTokens(attributeName: string): Set<string> {
  return supportedTokens.get(attributeName) || new Set()
}

/**
 * Runs event construction steps.
 * 
 * @param event - an event
 */
export function dom_runEventConstructingSteps(event: Event): void {
  // No steps defined
}

/**
 * Runs child text content change steps for a parent node.
 * 
 * @param parent - parent node with text node child nodes
 */
export function dom_runChildTextContentChangeSteps(parent: Node): void {
  // No steps defined
}

/**
 * Defines pre-removing steps for a node iterator.
 */
function removeNodeIterator(nodeIterator: NodeIterator,
  toBeRemovedNode: Node): void {
  /**
   * 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s 
   * reference, or toBeRemovedNode is nodeIterator’s root, then return.
   */
  if (toBeRemovedNode === nodeIterator._root ||
    !tree_isAncestorOf(nodeIterator._reference, toBeRemovedNode, true)) {
    return
  }

  /**
   * 2. If nodeIterator’s pointer before reference is true, then:
   */
  if (nodeIterator._pointerBeforeReference) {
    /**
     * 2.1. Let next be toBeRemovedNode’s first following node that is an
     * inclusive descendant of nodeIterator’s root and is not an inclusive
     * descendant of toBeRemovedNode, and null if there is no such node.
     */
    while (true) {
      const nextNode = tree_getFollowingNode(nodeIterator._root, toBeRemovedNode)
      if (nextNode !== null &&
        tree_isDescendantOf(nodeIterator._root, nextNode, true) &&
        !tree_isDescendantOf(toBeRemovedNode, nextNode, true)) {
        /**
         * 2.2. If next is non-null, then set nodeIterator’s reference to next 
         * and return.
         */
        nodeIterator._reference = nextNode
        return
      } else if (nextNode === null) {
        /**
         * 2.3. Otherwise, set nodeIterator’s pointer before reference to false.        
         */
        nodeIterator._pointerBeforeReference = false
        return
      }
    }
  }

  /**
   * 3. Set nodeIterator’s reference to toBeRemovedNode’s parent, if 
   * toBeRemovedNode’s previous sibling is null, and to the inclusive 
   * descendant of toBeRemovedNode’s previous sibling that appears last in 
   * tree order otherwise.
   */
  if (toBeRemovedNode._previousSibling === null) {
    if (toBeRemovedNode._parent !== null) {
      nodeIterator._reference = toBeRemovedNode._parent
    }
  } else {
    let childNode = toBeRemovedNode._previousSibling
    for (childNode of tree_getDescendantElements(toBeRemovedNode._previousSibling, true)) {
      // loop through to get the last descendant node
    }
    nodeIterator._reference = childNode
  }
}
