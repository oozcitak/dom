import { dom } from "../dom/DOMImpl"
import { Slotable, Slot, Element, ShadowRoot, Node } from "../dom/interfaces"
import { Cast, Guard } from "../util"
import { isEmpty } from "@oozcitak/util"
import {
  tree_rootNode, tree_getFirstDescendantNode, tree_getNextDescendantNode
} from "./TreeAlgorithm"
import { observer_queueAMutationObserverMicrotask } from "./MutationObserverAlgorithm"

/**
 * Signals a slot change to the given slot.
 * 
 * @param slot - a slot
 */
export function shadowTree_signalASlotChange(slot: Slot): void {
  /**
   * 1. Append slot to slot’s relevant agent’s signal slots.
   * 2. Queue a mutation observer microtask.
   */
  const window = dom.window
  window._signalSlots.add(slot)
  observer_queueAMutationObserverMicrotask()
}

/**
 * Determines whether a the shadow tree of the given element node is
 * connected to a document node.
 * 
 * @param element - an element node of the shadow tree
 */
export function shadowTree_isConnected(element: Element): boolean {
  /**
   * An element is connected if its shadow-including root is a document.
   */
  return Guard.isDocumentNode(tree_rootNode(element, true))
}

/**
 * Determines whether a slotable is assigned.
 * 
 * @param slotable - a slotable
 */
export function shadowTree_isAssigned(slotable: Slotable): boolean {
  /**
   * A slotable is assigned if its assigned slot is non-null.
   */
  return (slotable._assignedSlot !== null)
}

/**
 * Finds a slot for the given slotable.
 * 
 * @param slotable - a slotable
 * @param openFlag - `true` to search open shadow tree's only
 */
export function shadowTree_findASlot(slotable: Slotable, openFlag:
  boolean = false): Slot | null {
  /**
   * 1. If slotable’s parent is null, then return null.
   * 2. Let shadow be slotable’s parent’s shadow root.
   * 3. If shadow is null, then return null.
   * 4. If the open flag is set and shadow’s mode is not "open", then 
   * return null.
   * 5. Return the first slot in tree order in shadow’s descendants whose name 
   * is slotable’s name, if any, and null otherwise.
   */
  const node = Cast.asNode(slotable)
  const parent = node._parent as Element | null
  if (parent === null) return null
  const shadow = (parent._shadowRoot as ShadowRoot | null) || null
  if (shadow === null) return null
  if (openFlag && shadow._mode !== "open") return null

  let child = tree_getFirstDescendantNode(shadow, false, true, (e) => Guard.isSlot(e))
  while (child !== null) {
    if ((child as Slot)._name === slotable._name) return (child as Slot)
    child = tree_getNextDescendantNode(shadow, child, false, true, (e) => Guard.isSlot(e))
  }

  return null
}

/**
 * Finds slotables for the given slot.
 * 
 * @param slot - a slot
 */
export function shadowTree_findSlotables(slot: Slot): Slotable[] {
  /**
   * 1. Let result be an empty list.
   * 2. If slot’s root is not a shadow root, then return result.
   */
  const result: Slotable[] = []
  const root = tree_rootNode(slot)
  if (!Guard.isShadowRoot(root)) return result

  /**
   * 3. Let host be slot’s root’s host.
   * 4. For each slotable child of host, slotable, in tree order:
   */
  const host = root._host
  for (const slotable of host._children) {
    if (Guard.isSlotable(slotable)) {
      /**
       * 4.1. Let foundSlot be the result of finding a slot given slotable.
       * 4.2. If foundSlot is slot, then append slotable to result.
       */
      const foundSlot = shadowTree_findASlot(slotable)
      if (foundSlot === slot) {
        result.push(slotable)
      }
    }
  }

  /**
   * 5. Return result.
   */
  return result
}

/**
 * Finds slotables for the given slot.
 * 
 * @param slot - a slot
 */
export function shadowTree_findFlattenedSlotables(slot: Slot): Slotable[] {
  /**
   * 1. Let result be an empty list.
   * 2. If slot’s root is not a shadow root, then return result.
   */
  const result: Slotable[] = []
  const root = tree_rootNode(slot)
  if (!Guard.isShadowRoot(root)) return result

  /**
   * 3. Let slotables be the result of finding slotables given slot.
   * 4. If slotables is the empty list, then append each slotable child of 
   * slot, in tree order, to slotables.
   */
  const slotables = shadowTree_findSlotables(slot)
  if (isEmpty(slotables)) {
    for (const slotable of slot._children) {
      if (Guard.isSlotable(slotable)) {
        slotables.push(slotable)
      }
    }
  }

  /**
   * 5. For each node in slotables:
   */
  for (const node of slotables) {
    /**
     * 5.1. If node is a slot whose root is a shadow root, then:
     */
    if (Guard.isSlot(node) && Guard.isShadowRoot(tree_rootNode(node))) {
      /**
       * 5.1.1. Let temporaryResult be the result of finding flattened slotables given node.
       * 5.1.2. Append each slotable in temporaryResult, in order, to result.
       */
      const temporaryResult = shadowTree_findFlattenedSlotables(node)
      result.push(...temporaryResult)
    } else {
      /**
       * 5.2. Otherwise, append node to result.
       */
      result.push(node)
    }
  }

  /**
   * 6. Return result.
   */
  return result
}

/**
 * Assigns slotables to the given slot.
 * 
 * @param slot - a slot
 */
export function shadowTree_assignSlotables(slot: Slot): void {
  /**
   * 1. Let slotables be the result of finding slotables for slot.
   * 2. If slotables and slot’s assigned nodes are not identical, then run 
   * signal a slot change for slot.
   */
  const slotables = shadowTree_findSlotables(slot)
  if (slotables.length === slot._assignedNodes.length) {
    let nodesIdentical = true
    for (let i = 0; i < slotables.length; i++) {
      if (slotables[i] !== slot._assignedNodes[i]) {
        nodesIdentical = false
        break
      }
    }
    if (!nodesIdentical) {
      shadowTree_signalASlotChange(slot)
    }
  }

  /**
   * 3. Set slot’s assigned nodes to slotables.
   * 4. For each slotable in slotables, set slotable’s assigned slot to slot.
   */
  slot._assignedNodes = slotables
  for (const slotable of slotables) {
    slotable._assignedSlot = slot
  }
}

/**
 * Assigns slotables to all nodes of a tree.
 * 
 * @param root - root node
 */
export function shadowTree_assignSlotablesForATree(root: Node): void {
  /**
   * To assign slotables for a tree, given a node root, run assign slotables
   * for each slot slot in root’s inclusive descendants, in tree order.
   */
  let descendant = tree_getFirstDescendantNode(root, true, false, (e: Node) => Guard.isSlot(e))
  while (descendant !== null) {
    shadowTree_assignSlotables(descendant as Slot)
    descendant = tree_getNextDescendantNode(root, descendant, true, false, (e: Node) => Guard.isSlot(e))
  }
}

/**
 * Assigns a slot to a slotables.
 * 
 * @param slotable - a slotable
 */
export function shadowTree_assignASlot(slotable: Slotable): void {
  /**
   * 1. Let slot be the result of finding a slot with slotable.
   * 2. If slot is non-null, then run assign slotables for slot.
   */
  const slot = shadowTree_findASlot(slotable)
  if (slot !== null) {
    shadowTree_assignSlotables(slot)
  }
}
