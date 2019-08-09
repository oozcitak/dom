import { EventTargetAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { EventTargetInternal } from '../interfacesInternal'
import {
  EventListenerOptions, AddEventListenerOptions, EventListenerEntry
} from '../interfaces'
import { isBoolean } from '../../util'

/**
 * Contains event target algorithms.
 */
export class EventTargetAlgorithmImpl extends SubAlgorithmImpl implements EventTargetAlgorithm {

  /**
   * Initializes a new `EventTargetAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  flatten(options: EventListenerOptions | boolean): boolean {
    if (isBoolean(options)) {
      return options
    } else {
      return options.capture || false
    }
  }

  /** @inheritdoc */
  flattenMore(options: AddEventListenerOptions | boolean): [boolean, boolean, boolean] {
    const capture = this.flatten(options)
    let once = false
    let passive = false
    if (!isBoolean(options)) {
      once = options.once || false
      passive = options.passive || false
    }
    return [capture, passive, once]
  }

  /** @inheritdoc */
  addEventListener(eventTarget: EventTargetInternal,
    listener: EventListenerEntry): void {

    if (listener.callback === null) return

    // return if the listener is already defined
    for (const entry of eventTarget._eventListenerList) {
      if (entry.type === listener.type && entry.callback === listener.callback
        && entry.capture === listener.capture) {
        return
      }
    }

    // add to listener list
    eventTarget._eventListenerList.push(listener)
  }

  /** @inheritdoc */
  removeEventListener(eventTarget: EventTargetInternal,
    listener: EventListenerEntry, index: number = -1): void {

    listener.removed = true

    // check if the listener is defined
    if (index === -1) {
      let i = 0
      for (const entry of eventTarget._eventListenerList) {
        if (entry.type === listener.type && entry.callback === listener.callback
          && entry.capture === listener.capture) {
          index = i
          break
        }
        i++
      }
    }

    // remove from list
    if (index !== -1) {
      eventTarget._eventListenerList.slice(index, 1)
    }
  }

  /** @inheritdoc */
  removeAllEventListeners(eventTarget: EventTargetInternal): void {
    // check if the listener is defined
    for (const entry of eventTarget._eventListenerList) {
      entry.removed = true
    }

    // empty list
    eventTarget._eventListenerList = []
  }

}
