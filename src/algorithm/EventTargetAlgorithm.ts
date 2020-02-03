import {
  EventListenerOptions, AddEventListenerOptions, EventListenerEntry, EventTarget
} from "../dom/interfaces"
import { isBoolean } from "@oozcitak/util"

/**
 * Flattens the given options argument.
 * 
 * @param options - options argument
 */
export function eventTarget_flatten(options: EventListenerOptions | boolean): boolean {
  if (isBoolean(options)) {
    return options
  } else {
    return options.capture || false
  }
}

/**
 * Flattens the given options argument.
 * 
 * @param options - options argument
 */
export function eventTarget_flattenMore(options: AddEventListenerOptions | boolean): [boolean, boolean, boolean] {
  const capture = eventTarget_flatten(options)
  let once = false
  let passive = false
  if (!isBoolean(options)) {
    once = options.once || false
    passive = options.passive || false
  }
  return [capture, passive, once]
}

/**
 * Adds a new event listener.
 * 
 * @param eventTarget - event target
 * @param listener - event listener
 */
export function eventTarget_addEventListener(eventTarget: EventTarget,
  listener: EventListenerEntry): void {

  if (listener.callback === null) return

  // return if the listener is already defined
  for (let i = 0; i < eventTarget._eventListenerList.length; i++) {
    const entry = eventTarget._eventListenerList[i]
    if (entry.type === listener.type && entry.callback === listener.callback
      && entry.capture === listener.capture) {
      return
    }
  }

  // add to listener list
  eventTarget._eventListenerList.push(listener)
}

/**
 * Removes an event listener.
 * 
 * @param eventTarget - event target
 * @param listener - event listener
 */
export function eventTarget_removeEventListener(eventTarget: EventTarget,
  listener: EventListenerEntry, index: number = -1): void {

  listener.removed = true

  // check if the listener is defined
  if (index === -1) {
    for (let i = 0; i < eventTarget._eventListenerList.length; i++) {
      const entry = eventTarget._eventListenerList[i]
      if (entry.type === listener.type && entry.callback === listener.callback
        && entry.capture === listener.capture) {
        index = i
        break
      }
    }
  }

  // remove from list
  if (index !== -1) {
    eventTarget._eventListenerList.splice(index, 1)
  }
}

/**
 * Removes all event listeners.
 * 
 * @param eventTarget - event target
 */
export function eventTarget_removeAllEventListeners(eventTarget: EventTarget): void {
  // check if the listener is defined
  for (const e of eventTarget._eventListenerList) {
    e.removed = true
  }

  // empty list
  eventTarget._eventListenerList = []
}
