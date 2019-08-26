import { CustomEventInit } from './interfaces'
import { EventImpl } from './EventImpl'
import { CustomEventInternal } from './interfacesInternal'

/**
 * Represents and event that carries custom data.
 */
export class CustomEventImpl extends EventImpl implements CustomEventInternal {

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
  initCustomEvent(type: string, bubbles = false, cancelable = false, detail = null): void {
    /**
     * 1. If the context object’s dispatch flag is set, then return.
     */
    if (this._dispatchFlag) return

    /**
     * 2. Initialize the context object with type, bubbles, and cancelable.
     */
    this._algo.event.initialize(this, type, bubbles, cancelable)

    /**
     * 3. Set the context object’s detail attribute to detail.
     */
    this._detail = detail
  }

}
