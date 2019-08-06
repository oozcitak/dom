import { Element, ShadowRootMode } from "./interfaces"
import { DocumentFragmentImpl } from "./DocumentFragmentImpl"
import { ShadowRootInternal } from "./interfacesInternal"

/**
 * Represents a shadow root.
 */
export class ShadowRootImpl extends DocumentFragmentImpl implements ShadowRootInternal {

  _host: Element
  _mode: ShadowRootMode

  /**
   * Initializes a new instance of `ShadowRoot`.
   */
  private constructor(host: Element) {
    super()

    this._host = host
    this._mode = "closed"
  }

  /** 
   * Gets the shadow root's mode.
   */
  get mode(): ShadowRootMode { return this._mode }

  /** 
   * Gets the shadow root's host.
   */
  get host(): Element { return this._host }

  // MIXIN: DocumentOrShadowRoot
  // No elements

  /**
   * Creates a new `ShadowRoot`.
   */
  static _create(host: Element): ShadowRootInternal {
    const node = new ShadowRootImpl(host)
    node._mode = "closed"
    return node
  }
}
