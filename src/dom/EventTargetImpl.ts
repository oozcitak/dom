import {
  Event, EventListener, EventTarget, AddEventListenerOptions,
  EventListenerOptions, EventListenerEntry
} from './interfaces'
import { DOMException } from './DOMException'
import { EventTargetInternal, EventInternal } from './interfacesInternal'
import { DOMAlgorithm } from './algorithm/interfaces'
import { globalStore } from '../util'
import { Guard } from './util'

/**
 * Represents a target to which an event can be dispatched.
 */
export abstract class EventTargetImpl implements EventTargetInternal {

  _eventListenerList: EventListenerEntry[] = []

  protected _algo: DOMAlgorithm

  /**
   * Initializes a new instance of `EventTarget`.
   */
  public constructor() {
    this._algo = globalStore.algorithm as DOMAlgorithm
  }

  /** @inheritdoc */
  addEventListener(type: string,
    callback: EventListener | null | ((event: Event) => void),
    options: AddEventListenerOptions | boolean = { passive: false, once: false, capture: false }): void {

    /**
     * 1. Let capture, passive, and once be the result of flattening more options.
     */
    const [capture, passive, once] = this._algo.eventTarget.flattenMore(options)

    // convert callback function to EventListener, return if null
    let listenerCallback: EventListener
    if (!callback) {
      return
    } else if (Guard.isEventListener(callback)) {
      listenerCallback = callback
    } else {
      listenerCallback = { handleEvent: <((event: Event) => void)>callback }
    }

    /**
     * 2. Add an event listener with the context object and an event listener 
     * whose type is type, callback is callback, capture is capture, passive is
     * passive, and once is once.
     */
    this._algo.eventTarget.addEventListener(this, {
      type: type,
      callback: listenerCallback,
      capture: capture,
      passive: passive,
      once: once,
      removed: false
    })
  }

  /** @inheritdoc */
  removeEventListener(type: string,
    callback: EventListener | null | ((event: Event) => void),
    options: EventListenerOptions | boolean = { capture: false }): void {

    /**
     * TODO: Implement realms
     * 1. If the context object’s relevant global object is a
     * ServiceWorkerGlobalScope object and its associated service worker’s 
     * script resource’s has ever been evaluated flag is set, then throw
     * a TypeError. [SERVICE-WORKERS]
     */

    /**
     * 2. Let capture be the result of flattening options.
     */
    const capture = this._algo.eventTarget.flatten(options)

    if (!callback) return

    /**
     * 3. If the context object’s event listener list contains an event listener 
     * whose type is type, callback is callback, and capture is capture, then
     * remove an event listener with the context object and that event listener.
     */
    let i = 0
    for (const entry of this._eventListenerList) {
      if (entry.type !== type || entry.capture !== capture) continue
      if (Guard.isEventListener(callback) && entry.callback === callback) {
        this._algo.eventTarget.removeEventListener(this, entry, i)
        break
      } else if (callback && entry.callback.handleEvent === callback) {
        this._algo.eventTarget.removeEventListener(this, entry, i)
        break
      }
      i++
    }
  }

  /** @inheritdoc */
  dispatchEvent(event: EventInternal): boolean {
    /**
     * 1. If event’s dispatch flag is set, or if its initialized flag is not
     * set, then throw an "InvalidStateError" DOMException.
     * 2. Initialize event’s isTrusted attribute to false.
     * 3. Return the result of dispatching event to the context object.
     */
    if (event._dispatchFlag || !event._initializedFlag) {
      throw DOMException.InvalidStateError
    }
    event._isTrusted = false

    return this._algo.event.dispatch(event, this)
  }

  /** @inheritdoc */
  _getTheParent(event: Event): EventTarget | null {
    return null
  }

  /** @inheritdoc */
  _activationBehavior?(event: Event): void

  /** @inheritdoc */
  _legacyPreActivationBehavior?(event: Event): void

  /** @inheritdoc */
  _legacyCanceledActivationBehavior?(event: Event): void

}
