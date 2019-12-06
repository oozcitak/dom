import {
  Node, MutationObserverInit, MutationRecord, MutationCallback, MutationObserver
} from "./interfaces"
import { globalStore, Guard } from "../util"
import { list as infraList, set as infraSet } from '@oozcitak/infra'

/**
 * Represents an object that can be used to observe mutations to the tree of
 * nodes.
 */
export class MutationObserverImpl implements MutationObserver {

  _callback: MutationCallback
  _nodeList: Node[] = []
  _recordQueue: MutationRecord[] = []

  /**
   * Initializes a new instance of `MutationObserver`.
   *
   * @param callback - the callback function
   */
  public constructor(callback: MutationCallback) {
    /**
     * 1. Let mo be a new MutationObserver object whose callback is callback.
     * 2. Append mo to mo’s relevant agent’s mutation observers.
     * 3. Return mo.
     */
    this._callback = callback
    const window = globalStore.dom.window
    infraSet.append(window._mutationObservers, this)
  }

  /** @inheritdoc */
  observe(target: Node, options?: MutationObserverInit): void {
    options = options || {
      childList: false,
      subtree: false
    }

    /**
     * 1. If either options’s attributeOldValue or attributeFilter is present 
     * and options’s attributes is omitted, then set options’s attributes 
     * to true.
     * 2. If options’s characterDataOldValue is present and options’s 
     * characterData is omitted, then set options’s characterData to true.
     * 3. If none of options’s childList, attributes, and characterData is 
     * true, then throw a TypeError.
     * 4. If options’s attributeOldValue is true and options’s attributes is 
     * false, then throw a TypeError.
     * 5. If options’s attributeFilter is present and options’s attributes is
     *  false, then throw a TypeError.
     * 6. If options’s characterDataOldValue is true and options’s characterData 
     * is false, then throw a TypeError.
     */
    if ((options.attributeOldValue !== undefined || options.attributeFilter !== undefined) &&
      options.attributes === undefined) {
      options.attributes = true
    }
    if (options.characterDataOldValue !== undefined && options.characterData === undefined) {
      options.characterData = true
    }
    if (!options.childList && !options.attributes && !options.characterData) {
      throw new TypeError()
    }
    if (options.attributeOldValue && !options.attributes) {
      throw new TypeError()
    }
    if (options.attributeFilter !== undefined && !options.attributes) {
      throw new TypeError()
    }
    if (options.characterDataOldValue && !options.characterData) {
      throw new TypeError()
    }

    /**
     * 7. For each registered of target’s registered observer list, if 
     * registered’s observer is the context object:
     */
    let isRegistered = false
    for (const registered of target._registeredObserverList) {
      if (registered.observer === this) {
        isRegistered = true
        /**
         * 7.1. For each node of the context object’s node list, remove all
         * transient registered observers whose source is registered from node’s
         * registered observer list.
         */
        for (const node of this._nodeList) {
          infraList.remove((node)._registeredObserverList, (ob) => 
            Guard.isTransientRegisteredObserver(ob) && ob.source === registered
          )
        }
        /**
         * 7.2. Set registered’s options to options.
         */
        registered.options = options
      }
    }

    /**
     * 8. Otherwise:
     * 8.1. Append a new registered observer whose observer is the context
     * object and options is options to target’s registered observer list.
     * 8.2. Append target to the context object’s node list.
     */
    if (!isRegistered) {
      target._registeredObserverList.push({ observer: this, options: options })
      this._nodeList.push(target)
    }
  }

  /** @inheritdoc */
  disconnect(): void {
    /**
     * 1. For each node of the context object’s node list, remove any 
     * registered observer from node’s registered observer list for which the 
     * context object is the observer.
     */
    for (const node of this._nodeList) {
      infraList.remove((node)._registeredObserverList, (ob) =>
        ob.observer === this
      )
    }

    /**
     * 2. Empty the context object’s record queue.
     */
    this._recordQueue = []
  }

  /** @inheritdoc */
  takeRecords(): MutationRecord[] {
    /**
     * 1. Let records be a clone of the context object’s record queue.
     * 2. Empty the context object’s record queue.
     * 3. Return records.
     */
    const records = this._recordQueue
    this._recordQueue = []
    return records
  }

}