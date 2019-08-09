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
    if (this._dispatchFlag) return

    EventImpl._initialize(this, type, bubbles, cancelable)

    this._detail = detail
  }

}
