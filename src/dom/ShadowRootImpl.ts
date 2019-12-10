import {
  Element, ShadowRootMode, Event, EventTarget, ShadowRoot, Document, Node
} from "./interfaces"
import { DocumentFragmentImpl } from "./DocumentFragmentImpl"
import { isEmpty } from "@oozcitak/util"
import { tree_rootNode } from "../algorithm/TreeAlgorithm"

/**
 * Represents a shadow root.
 */
export class ShadowRootImpl extends DocumentFragmentImpl implements ShadowRoot {

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
    if (!event._composedFlag && !isEmpty(event._path) &&
      tree_rootNode(event._path[0].invocationTarget as Node) === this) {
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
  static _create(document: Document, host: Element): ShadowRootImpl {
    return new ShadowRootImpl(host, "closed")
  }
}
