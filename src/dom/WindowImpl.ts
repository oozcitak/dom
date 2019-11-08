import {
  Event, Slot, MutationObserver, Document, Window, Range, NodeIterator
} from './interfaces'
import { EventTargetImpl } from './EventTargetImpl'
import { ObjectCache } from '@oozcitak/util'

/**
 * Represents a window containing a DOM document.
 */
export class WindowImpl extends EventTargetImpl implements Window {

  _currentEvent?: Event
  _signalSlots = new Set<Slot>()
  _mutationObserverMicrotaskQueued: boolean = false
  _mutationObservers = new Set<MutationObserver>()

  _associatedDocument: Document

  _rangeList = new ObjectCache<Range>()
  _iteratorList = new ObjectCache<NodeIterator>()
  
  /**
   * Initializes a new instance of `Window`.
   */
  protected constructor () {
    super()

    this._associatedDocument = this._algo.create.document()
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
