import {
  Event, EventListener, EventTarget, AddEventListenerOptions,
  EventListenerOptions, EventListenerEntry
} from './interfaces'
import { DOMException } from './DOMException'
import { EventTargetInternal, EventInternal } from './interfacesInternal'

/**
 * Represents a target to which an event can be dispatched.
 */
export abstract class EventTargetImpl implements EventTargetInternal {

  _eventListenerList: EventListenerEntry[] = []

  /**
   * Initializes a new instance of `EventTarget`.
   */
  public constructor() { }

  /**
   * Registers an event handler.
   * 
   * @param type - event type to listen for.
   * @param callback - object to receive a notification when an event occurs.
   * @param options - object that specifies event characteristics.
   */
  addEventListener(type: string,
    callback: EventListener | null | ((event: Event) => void),
    options: AddEventListenerOptions | boolean = { passive: false, once: false, capture: false }): void {

    // flatten options
    const [capture, passive, once] = EventTargetImpl._flattenMore(options)

    // convert callback function to EventListener, return if null
    let listenerCallback: EventListener
    if (!callback) {
      return
    } else if ((<EventListener>callback).handleEvent) {
      listenerCallback = <EventListener>callback
    } else {
      listenerCallback = { handleEvent: <((event: Event) => void)>callback }
    }

    // add to listener list
    EventTargetImpl._addEventListener(this, {
      type: type,
      callback: listenerCallback,
      capture: capture,
      passive: passive,
      once: once,
      removed: false
    })
  }

  /**
   * Removes an event listener.
   * 
   * @param type - event type to listen for.
   * @param callback - object to receive a notification when an event occurs.
   * @param options - object that specifies event characteristics.
   */
  removeEventListener(type: string,
    callback: EventListener | null | ((event: Event) => void),
    options: EventListenerOptions | boolean = { capture: false }): void {

    // flatten options
    const capture = EventTargetImpl._flatten(options)

    // convert callback function to EventListener, return if null
    let listenerCallback: EventListener
    if (!callback) {
      return
    } else if ((<EventListener>callback).handleEvent) {
      listenerCallback = <EventListener>callback
    } else {
      listenerCallback = { handleEvent: <((event: Event) => void)>callback }
    }

    // check if the listener is defined
    let i = 0
    let index = -1
    for (const entry of this._eventListenerList) {
      if (entry.type === type && entry.callback === listenerCallback
        && entry.capture === capture) {
        index = i
        EventTargetImpl._removeEventListener(this, entry, index)
        break
      }
      i++
    }
  }

  /**
   * Dispatches an event to this event target.
   * 
   * @param event - the event to dispatch.
   */
  dispatchEvent(event: EventInternal): boolean {
    if (event._dispatchFlag || !event._initializedFlag) {
      throw DOMException.InvalidStateError
    }
    event._isTrustedFlag = false

    return EventTargetImpl._dispatchEvent(event, this)
  }

  /**
   * Gets the parent event target for the given event.
   * 
   * @param event - an event
   */
  _getTheParent(event: Event): EventTarget | null {
    return null
  }

  /**
   * Defines optional activation behavior for the given event.
   * 
   * _Note:_ This exists because user agents perform certain actions for certain
   * EventTarget objects, e.g., the area element, in response to synthetic
   * MouseEvent events whose type attribute is click. Web compatibility
   * prevented it from being removed and it is now the enshrined way of
   * defining an activation of something.
   * 
   * @param event - an event
   */
  _activationBehavior?(event: Event): void

  /**
   * Defines optional legacy pre-activation behavior for the given event.
   *
   * _Note:_ These algorithms only exist for checkbox and radio input elements
   * and are not to be used for anything else.
   * 
   * @param event - an event
   */
  _legacyPreActivationBehavior?(event: Event): void

  /**
   * Defines optional legacy canceled activation behavior for the given event.
   *
   * _Note:_ These algorithms only exist for checkbox and radio input elements
   * and are not to be used for anything else.
   * 
   * @param event - an event
   */
  _legacyCanceledActivationBehavior?(event: Event): void

}
