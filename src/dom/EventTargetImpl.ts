import {
  Event, EventListener, EventTarget, AddEventListenerOptions,
  EventListenerOptions, EventListenerEntry, EventHandlerEntry
} from "./interfaces"
import { InvalidStateError } from "./DOMException"
import { Guard } from "../util"
import {
  eventTarget_removeEventListener, eventTarget_flatten, eventTarget_flattenMore,
  eventTarget_addEventListener, event_dispatch
} from "../algorithm"

/**
 * Represents a target to which an event can be dispatched.
 */
export abstract class EventTargetImpl implements EventTarget {

  private __eventListenerList?: EventListenerEntry[]
  get _eventListenerList(): EventListenerEntry[] {
    return this.__eventListenerList || (this.__eventListenerList = [])
  }
  
  private __eventHandlerMap?: { [key: string]: EventHandlerEntry }
  get _eventHandlerMap(): { [key: string]: EventHandlerEntry } {
    return this.__eventHandlerMap || (this.__eventHandlerMap = {})
  }

  /**
   * Initializes a new instance of `EventTarget`.
   */
  public constructor() { }

  /** @inheritdoc */
  addEventListener(type: string,
    callback: EventListener | null | ((event: Event) => void),
    options: AddEventListenerOptions | boolean = { passive: false, once: false, capture: false }): void {

    /**
     * 1. Let capture, passive, and once be the result of flattening more options.
     */
    const [capture, passive, once] = eventTarget_flattenMore(options)

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
    eventTarget_addEventListener(this, {
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
    const capture = eventTarget_flatten(options)

    if (!callback) return

    /**
     * 3. If the context object’s event listener list contains an event listener 
     * whose type is type, callback is callback, and capture is capture, then
     * remove an event listener with the context object and that event listener.
     */
    for (let i = 0; i < this._eventListenerList.length; i++) {
      const entry = this._eventListenerList[i]
      if (entry.type !== type || entry.capture !== capture) continue
      if (Guard.isEventListener(callback) && entry.callback === callback) {
        eventTarget_removeEventListener(this, entry, i)
        break
      } else if (callback && entry.callback.handleEvent === callback) {
        eventTarget_removeEventListener(this, entry, i)
        break
      }
    }
  }

  /** @inheritdoc */
  dispatchEvent(event: Event): boolean {
    /**
     * 1. If event’s dispatch flag is set, or if its initialized flag is not
     * set, then throw an "InvalidStateError" DOMException.
     * 2. Initialize event’s isTrusted attribute to false.
     * 3. Return the result of dispatching event to the context object.
     */
    if (event._dispatchFlag || !event._initializedFlag) {
      throw new InvalidStateError()
    }
    event._isTrusted = false

    return event_dispatch(event, this)
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
