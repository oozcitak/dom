import { dom } from "../dom"
import { MutationRecord, MutationObserver, Node } from "../dom/interfaces"
import { Guard } from "../util"
import { list as infraList, set as infraSet } from "@oozcitak/infra"
import { create_mutationRecord, create_nodeListStatic } from "./CreateAlgorithm"
import { tree_getFirstAncestorNode, tree_getNextAncestorNode } from "./TreeAlgorithm"
import { event_fireAnEvent } from "./EventAlgorithm"

/**
 * Queues a mutation observer microtask to the surrounding agent’s mutation
 * observers.
 */
export function observer_queueAMutationObserverMicrotask(): void {
  /**
   * 1. If the surrounding agent’s mutation observer microtask queued is true,
   * then return.
   * 2. Set the surrounding agent’s mutation observer microtask queued to true.
   * 3. Queue a microtask to notify mutation observers.
   */
  const window = dom.window

  if (window._mutationObserverMicrotaskQueued) return
  window._mutationObserverMicrotaskQueued = true
  Promise.resolve().then(() => { observer_notifyMutationObservers() })
}

/**
 * Notifies the surrounding agent’s mutation observers.
 */
export function observer_notifyMutationObservers(): void {
  /**
   * 1. Set the surrounding agent’s mutation observer microtask queued to false.
   * 2. Let notifySet be a clone of the surrounding agent’s mutation observers.
   * 3. Let signalSet be a clone of the surrounding agent’s signal slots.
   * 4. Empty the surrounding agent’s signal slots.
   */
  const window = dom.window

  window._mutationObserverMicrotaskQueued = false
  const notifySet = infraSet.clone(window._mutationObservers)
  const signalSet = infraSet.clone(window._signalSlots)
  infraSet.empty(window._signalSlots)
  /**
   * 5. For each mo of notifySet:
   */
  for (const mo of notifySet) {
    /**
     * 5.1. Let records be a clone of mo’s record queue.
     * 5.2. Empty mo’s record queue.
     */
    const records = infraList.clone(mo._recordQueue)
    infraList.empty(mo._recordQueue)
    /**
     * 5.3. For each node of mo’s node list, remove all transient registered 
     * observers whose observer is mo from node’s registered observer list.
     */
    for (let i = 0; i < mo._nodeList.length; i++) {
      const node = mo._nodeList[i];      
      infraList.remove(node._registeredObserverList, (observer) => {
        return Guard.isTransientRegisteredObserver(observer) && observer.observer === mo
      })
    }
    /**
     * 5.4. If records is not empty, then invoke mo’s callback with « records, 
     * mo », and mo. If this throws an exception, then report the exception.
     */
    if (!infraList.isEmpty(records)) {
      try {
        mo._callback.call(mo, records, mo)
      } catch (err) {
        // TODO: Report the exception
      }
    }
  }
  /**
   * 6. For each slot of signalSet, fire an event named slotchange, with its 
   * bubbles attribute set to true, at slot.
   */
  if (dom.features.slots) {
    signalSet.forEach(slot =>
      event_fireAnEvent("slotchange", slot, undefined, { bubbles: true })
    )
  }
}

/**
 * Queues a mutation record of the given type for target.
 * 
 * @param type - mutation record type
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
export function observer_queueMutationRecord(type: "attributes" | "characterData" | "childList",
  target: Node, name: string | null,
  namespace: string | null, oldValue: string | null,
  addedNodes: Node[], removedNodes: Node[],
  previousSibling: Node | null, nextSibling: Node | null): void {

  /**
   * 1. Let interestedObservers be an empty map.
   * 2. Let nodes be the inclusive ancestors of target.
   * 3. For each node in nodes, and then for each registered of node’s 
   * registered observer list:
   */
  const interestedObservers = new Map<MutationObserver, string | null>()
  let node = tree_getFirstAncestorNode(target, true)
  while (node !== null) {
    for (let i = 0; i < node._registeredObserverList.length; i++) {
      const registered = node._registeredObserverList[i];
      /**
       * 3.1. Let options be registered’s options.
       * 3.2. If none of the following are true
       * - node is not target and options’s subtree is false
       * - type is "attributes" and options’s attributes is not true
       * - type is "attributes", options’s attributeFilter is present, and 
       * options’s attributeFilter does not contain name or namespace is 
       * non-null
       * - type is "characterData" and options’s characterData is not true
       * - type is "childList" and options’s childList is false
       */
      const options = registered.options

      if (node !== target && !options.subtree) continue
      if (type === "attributes" && !options.attributes) continue
      if (type === "attributes" && options.attributeFilter &&
        (!options.attributeFilter.includes(name || '') || namespace !== null)) continue
      if (type === "characterData" && !options.characterData) continue
      if (type === "childList" && !options.childList) continue

      /**
       * then:
       * 3.2.1. Let mo be registered’s observer.
       * 3.2.2. If interestedObservers[mo] does not exist, then set
       * interestedObservers[mo] to null.
       * 3.2.3. If either type is "attributes" and options’s attributeOldValue 
       * is true, or type is "characterData" and options’s 
       * characterDataOldValue is true, then set interestedObservers[mo] 
       * to oldValue.
       */
      const mo = registered.observer
      if (!interestedObservers.has(mo)) {
        interestedObservers.set(mo, null)
      }
      if ((type === "attributes" && options.attributeOldValue) ||
        (type === "characterData" && options.characterDataOldValue)) {
        interestedObservers.set(mo, oldValue)
      }
    }
    node = tree_getNextAncestorNode(target, node, true)
  }

  /**
   * 4. For each observer → mappedOldValue of interestedObservers:
   */
  interestedObservers.forEach((mappedOldValue, observer) => {
    /**
     * 4.1. Let record be a new MutationRecord object with its type set to 
     * type, target set to target, attributeName set to name, 
     * attributeNamespace set to namespace, oldValue set to mappedOldValue,
     * addedNodes set to addedNodes, removedNodes set to removedNodes, 
     * previousSibling set to previousSibling, and nextSibling set to 
     * nextSibling.
     * 4.2. Enqueue record to observer’s record queue.
     */
    const record = create_mutationRecord(type, target,
      create_nodeListStatic(target, addedNodes),
      create_nodeListStatic(target, removedNodes),
      previousSibling, nextSibling, name, namespace, mappedOldValue)

    const queue: MutationRecord[] = observer._recordQueue
    queue.push(record)
  })

  /**
   * 5. Queue a mutation observer microtask.
   */
  observer_queueAMutationObserverMicrotask()
}

/**
 * Queues a tree mutation record for target.
 * 
 * @param target - target node
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
export function observer_queueTreeMutationRecord(target: Node,
  addedNodes: Node[], removedNodes: Node[],
  previousSibling: Node | null, nextSibling: Node | null): void {
  /**
   * To queue a tree mutation record for target with addedNodes, removedNodes, 
   * previousSibling, and nextSibling, queue a mutation record of "childList" 
   * for target with null, null, null, addedNodes, removedNodes, 
   * previousSibling, and nextSibling.
   */
  observer_queueMutationRecord("childList", target, null, null, null,
    addedNodes, removedNodes, previousSibling, nextSibling)
}

/**
 * Queues an attribute mutation record for target.
 * 
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 */
export function observer_queueAttributeMutationRecord(target: Node, name: string | null,
  namespace: string | null, oldValue: string | null): void {
  /**
   * To queue an attribute mutation record for target with name, namespace, 
   * and oldValue, queue a mutation record of "attributes" for target with 
   * name, namespace, oldValue, « », « », null, and null.
   */
  observer_queueMutationRecord("attributes", target, name, namespace,
    oldValue, [], [], null, null)
}
