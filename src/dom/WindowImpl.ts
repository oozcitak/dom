import {
  Event, Slot, MutationObserver, Document, Window, NodeIterator
} from "./interfaces"
import { EventTargetImpl } from "./EventTargetImpl"
import { ObjectCache } from "@oozcitak/util"
import { create_document } from "../algorithm"

/**
 * Represents a window containing a DOM document.
 */
export class WindowImpl extends EventTargetImpl implements Window {

  _currentEvent?: Event
  _signalSlots = new Set<Slot>()
  _mutationObserverMicrotaskQueued: boolean = false
  _mutationObservers = new Set<MutationObserver>()

  _associatedDocument: Document

  _iteratorList = new ObjectCache<NodeIterator>()

  /**
   * Initializes a new instance of `Window`.
   */
  protected constructor() {
    super()

    this._associatedDocument = create_document()
  }

  /** @inheritdoc */
  get document(): Document { return this._associatedDocument }

  /** @inheritdoc */
  get event(): Event | undefined { return this._currentEvent }

  /**
   * Creates a new window with a blank document.
   */
  static _create(): WindowImpl {
    return new WindowImpl()
  }
}
