import { DOMAlgorithm, ShadowTreeAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import {
  SlotableInternal, SlotInternal, ElementInternal, ShadowRootInternal,
  NodeInternal,
  WindowInternal
} from '../interfacesInternal'
import { Cast, Guard } from '../util'
import { isEmpty, globalStore } from '../../util'

/**
 * Contains shadow tree algorithms.
 */
export class ShadowTreeAlgorithmImpl extends SubAlgorithmImpl implements ShadowTreeAlgorithm {

  /**
   * Initializes a new `ShadowTreeAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  isConnected(element: ElementInternal): boolean {
    /**
     * An element is connected if its shadow-including root is a document.
     */
    return Guard.isDocumentNode(this.dom.tree.rootNode(element, true))
  }

  /** @inheritdoc */
  isAssigned(slotable: SlotableInternal): boolean {
    /**
     * A slotable is assigned if its assigned slot is non-null.
     */
    return (slotable._assignedSlot !== null)
  }

  /** @inheritdoc */
  findASlot(slotable: SlotableInternal, openFlag: boolean = false):
    SlotInternal | null {
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
    const parent = node._parent as ElementInternal | null
    if (parent === null) return null
    const shadow = (parent._shadowRoot as ShadowRootInternal | null) || null
    if (shadow === null) return null
    if (openFlag && shadow._mode !== "open") return null

    for (const child of this.dom.tree.getDescendantElements(shadow, false, true)) {
      if (Guard.isSlot(child)) {
        if (child._name === slotable._name) return child
      }
    }

    return null
  }

  /** @inheritdoc */
  findSlotables(slot: SlotInternal): SlotableInternal[] {
    /**
     * 1. Let result be an empty list.
     * 2. If slot’s root is not a shadow root, then return result.
     */
    const result: SlotableInternal[] = []
    const root = this.dom.tree.rootNode(slot)
    if (!Guard.isShadowRoot(root)) return result

    /**
     * 3. Let host be slot’s root’s host.
     * 4. For each slotable child of host, slotable, in tree order:
     */
    const host = root._host
    for (const slotable of host.childNodes) {
      if (Guard.isSlotable(slotable)) {
        /**
         * 4.1. Let foundSlot be the result of finding a slot given slotable.
         * 4.2. If foundSlot is slot, then append slotable to result.
         */
        const foundSlot = this.findASlot(slotable)
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

  /** @inheritdoc */
  findFlattenedSlotables(slot: SlotInternal): SlotableInternal[] {
    /**
     * 1. Let result be an empty list.
     * 2. If slot’s root is not a shadow root, then return result.
     */
    const result: SlotableInternal[] = []
    const root = this.dom.tree.rootNode(slot)
    if (!Guard.isShadowRoot(root)) return result

    /**
     * 3. Let slotables be the result of finding slotables given slot.
     * 4. If slotables is the empty list, then append each slotable child of 
     * slot, in tree order, to slotables.
     */
    const slotables = this.findSlotables(slot)
    if (isEmpty(slotables)) {
      for (const slotable of slot.childNodes) {
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
      if (Guard.isSlot(node) && Guard.isShadowRoot(this.dom.tree.rootNode(node))) {
        /**
         * 5.1.1. Let temporaryResult be the result of finding flattened slotables given node.
         * 5.1.2. Append each slotable in temporaryResult, in order, to result.
         */
        const temporaryResult = this.findFlattenedSlotables(node)
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

  /** @inheritdoc */
  assignSlotables(slot: SlotInternal): void {
    /**
     * 1. Let slotables be the result of finding slotables for slot.
     * 2. If slotables and slot’s assigned nodes are not identical, then run 
     * signal a slot change for slot.
     */
    const slotables = this.findSlotables(slot)
    if (slotables.length === slot._assignedNodes.length) {
      let nodesIdentical = true
      for (let i = 0; i < slotables.length; i++) {
        if (slotables[i] !== slot._assignedNodes[i]) {
          nodesIdentical = false
          break
        }
      }
      if (!nodesIdentical) {
        this.signalASlotChange(slot)
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

  /** @inheritdoc */
  assignSlotablesForATree(root: NodeInternal): void {
    /**
     * To assign slotables for a tree, given a node root, run assign slotables
     * for each slot slot in root’s inclusive descendants, in tree order.
     */
    for (const slot of this.dom.tree.getDescendantNodes(root, true)) {
      if (Guard.isSlot(slot)) {
        this.assignSlotables(slot)
      }
    }
  }

  /** @inheritdoc */
  assignASlot(slotable: SlotableInternal): void {
    /**
     * 1. Let slot be the result of finding a slot with slotable.
     * 2. If slot is non-null, then run assign slotables for slot.
     */
    const slot = this.findASlot(slotable)
    if (slot !== null) {
      this.assignSlotables(slot)
    }
  }

  /** @inheritdoc */
  signalASlotChange(slot: SlotInternal): void {
    /**
     * 1. Append slot to slot’s relevant agent’s signal slots.
     * 2. Queue a mutation observer microtask.
     */
    /**
     * TODO:
     * The relevant agent for a platform object platformObject is the agent
     * whose set of realms contains platformObject's relevant Realm.
     */
    const window = globalStore.window
    window._signalSlots.add(slot)
    this.dom.observer.queueAMutationObserverMicrotask()
  }

}
