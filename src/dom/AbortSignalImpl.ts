import { EventHandler, AbortSignal } from "./interfaces"
import { EventTargetImpl } from "./EventTargetImpl"
import {
  event_getterEventHandlerIDLAttribute, event_setterEventHandlerIDLAttribute
} from "../algorithm"

/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */
export class AbortSignalImpl extends EventTargetImpl implements AbortSignal {

  _abortedFlag: boolean = false
  _abortAlgorithms: Set<(...args: any[]) => any> = new Set()

  /**
   * Initializes a new instance of `AbortSignal`.
   */
  private constructor() {
    super()
  }

  /** @inheritdoc */
  get aborted(): boolean { return this._abortedFlag }

  /** @inheritdoc */
  get onabort(): EventHandler {
    return event_getterEventHandlerIDLAttribute(this, "onabort")
  }
  set onabort(val: EventHandler) {
    event_setterEventHandlerIDLAttribute(this, "onabort", val)
  }

  /**
   * Creates a new `AbortSignal`.
   */
  static _create(): AbortSignalImpl {
    return new AbortSignalImpl()
  }

}