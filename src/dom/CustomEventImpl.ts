import { CustomEventInit, CustomEvent } from "./interfaces"
import { EventImpl } from "./EventImpl"
import { event_initialize } from "../algorithm"

/**
 * Represents and event that carries custom data.
 */
export class CustomEventImpl extends EventImpl implements CustomEvent {

  protected _detail: any = null

  /**
   * Initializes a new instance of `CustomEvent`.
   */
  public constructor(type: string, eventInit?: CustomEventInit) {
    super(type, eventInit)

    this._detail = (eventInit && eventInit.detail) || null
  }

  /** @inheritdoc */
  get detail(): any { return this._detail }

  /** @inheritdoc */
  initCustomEvent(type: string, bubbles = false, cancelable = false, detail: any = null): void {
    /**
     * 1. If the context object’s dispatch flag is set, then return.
     */
    if (this._dispatchFlag) return

    /**
     * 2. Initialize the context object with type, bubbles, and cancelable.
     */
    event_initialize(this, type, bubbles, cancelable)

    /**
     * 3. Set the context object’s detail attribute to detail.
     */
    this._detail = detail
  }

}
