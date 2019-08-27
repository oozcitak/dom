import { MutationObserverAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { DOMException } from '../DOMException'
import {
  NodeInternal, MutationRecordInternal, MutationObserverInternal
} from '../interfacesInternal'

/**
 * Contains mutation observer algorithms.
 */
export class MutationObserverAlgorithmImpl extends SubAlgorithmImpl
  implements MutationObserverAlgorithm {

  /**
   * Initializes a new `MutationObserverAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  queueAMutationObserverMicrotask(): void {
    /**
     * TODO:
     * 1. If the surrounding agent’s mutation observer microtask queued is true,
     * then return.
     * 2. Set the surrounding agent’s mutation observer microtask queued to true.
     * 3. Queue a microtask to notify mutation observers.
     */
    
  }

  /** @inheritdoc */
  notifyMutationObservers(): void {
    /**
     * TODO:
     * 1. Set the surrounding agent’s mutation observer microtask queued to false.
     * 2. Let notifySet be a clone of the surrounding agent’s mutation observers.
     * 3. Let signalSet be a clone of the surrounding agent’s signal slots.
     * 4. Empty the surrounding agent’s signal slots.
     * 5. For each mo of notifySet:
     * 5.1. Let records be a clone of mo’s record queue.
     * 5.2. Empty mo’s record queue.
     * 5.3. For each node of mo’s node list, remove all transient registered 
     * observers whose observer is mo from node’s registered observer list.
     * 5.4. If records is not empty, then invoke mo’s callback with « records, 
     * mo », and mo. If this throws an exception, then report the exception.
     * 6. For each slot of signalSet, fire an event named slotchange, with its 
     * bubbles attribute set to true, at slot.
     */
    
  }

  /** @inheritdoc */
  queueMutationRecord(type: "attributes" | "characterData" | "childList",
    target: NodeInternal, name: string | null,
    namespace: string | null, oldValue: string | null,
    addedNodes: NodeInternal[], removedNodes: NodeInternal[],
    previousSibling: NodeInternal | null, nextSibling: NodeInternal | null): void {

    /**
     * 1. Let interestedObservers be an empty map.
     * 2. Let nodes be the inclusive ancestors of target.
     * 3. For each node in nodes, and then for each registered of node’s 
     * registered observer list:
     */
    const interestedObservers = new Map<MutationObserverInternal, string | null>()
    for (const node of this.dom.tree.getAncestorNodes(target, true)) {
      for (const registered of node._registeredObserverList) {
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
        const mo = registered.observer as MutationObserverInternal
        if (!interestedObservers.has(mo)) {
          interestedObservers.set(mo, null)
        }
        if ((type === "attributes" && options.attributeOldValue) ||
          (type === "characterData" && options.characterDataOldValue)) {
          interestedObservers.set(mo, oldValue)
        }
      }
    }

    /**
     * 4. For each observer → mappedOldValue of interestedObservers:
     */
    for (const [observer, mappedOldValue] of interestedObservers) {
      /**
       * 4.1. Let record be a new MutationRecord object with its type set to 
       * type, target set to target, attributeName set to name, 
       * attributeNamespace set to namespace, oldValue set to mappedOldValue,
       * addedNodes set to addedNodes, removedNodes set to removedNodes, 
       * previousSibling set to previousSibling, and nextSibling set to 
       * nextSibling.
       * 4.2. Enqueue record to observer’s record queue.
       */
      const record = this.dom.create.mutationRecord(type, target,
        this.dom.create.nodeListStatic(target, addedNodes),
        this.dom.create.nodeListStatic(target, removedNodes),
        previousSibling, nextSibling, name, namespace, mappedOldValue)

      const queue: MutationRecordInternal[] = observer._recordQueue
      queue.push(record)
    }

    /**
     * 5. Queue a mutation observer microtask.
     */
    this.queueAMutationObserverMicrotask()
  }

  /** @inheritdoc */
  queueTreeMutationRecord(target: NodeInternal,
    addedNodes: NodeInternal[], removedNodes: NodeInternal[],
    previousSibling: NodeInternal | null, nextSibling: NodeInternal | null): void {
    /**
     * To queue a tree mutation record for target with addedNodes, removedNodes, 
     * previousSibling, and nextSibling, queue a mutation record of "childList" 
     * for target with null, null, null, addedNodes, removedNodes, 
     * previousSibling, and nextSibling.
     */
    this.queueMutationRecord("childList", target, null, null, null,
      addedNodes, removedNodes, previousSibling, nextSibling)
  }

  /** @inheritdoc */
  queueAttributeMutationRecord(target: NodeInternal, name: string | null,
    namespace: string | null, oldValue: string | null): void {
    /**
     * To queue an attribute mutation record for target with name, namespace, 
     * and oldValue, queue a mutation record of "attributes" for target with 
     * name, namespace, oldValue, « », « », null, and null.
     */
    this.queueMutationRecord("attributes", target, name, namespace,
      oldValue, [], [], null, null)
  }

}
