import { Element, ShadowRootMode, Event, EventTarget } from "./interfaces"
import { DocumentFragmentImpl } from "./DocumentFragmentImpl"
import {
  ShadowRootInternal, ElementInternal, DocumentInternal, EventInternal, 
  NodeInternal
} from "./interfacesInternal"
import { isEmpty } from "../util"

/**
 * Represents a shadow root.
 */
export class ShadowRootImpl extends DocumentFragmentImpl implements ShadowRootInternal {

  _host: Element
  _mode: ShadowRootMode

  /**
   * Initializes a new instance of `ShadowRoot`.
   * 
   * @param host - shadow root's host element
   * @param mode - shadow root's mode
   */
  private constructor(host: Element, mode: ShadowRootMode = "closed") {
    super()

    this._host = host
    this._mode = mode
  }

  /** @inheritdoc */
  get mode(): ShadowRootMode { return this._mode }

  /** @inheritdoc */
  get host(): Element { return this._host }

  /**
   * Gets the parent event target for the given event.
   * 
   * @param event - an event
   */
  _getTheParent(event: Event): EventTarget | null {
    /**
     * A shadow root’s get the parent algorithm, given an event, returns null
     * if event’s composed flag is unset and shadow root is the root of 
     * event’s path’s first struct’s invocation target, and shadow root’s host
     * otherwise.
     */
    const eventInt = event as EventInternal
    if (!eventInt._composedFlag && !isEmpty(eventInt._path) &&
      this._algo.tree.rootNode(eventInt._path[0].invocationTarget as NodeInternal) === this) {
      return null
    } else {
      return this._host
    }
  }

  // MIXIN: DocumentOrShadowRoot
  // No elements

  /**
   * Creates a new `ShadowRoot`.
   * 
   * @param document - owner document
   * @param host - shadow root's host element
   */
  static _create(document: DocumentInternal, host: ElementInternal): ShadowRootInternal {
    return new ShadowRootImpl(host, "closed")
  }
}
