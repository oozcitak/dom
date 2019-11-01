import { Event, Slot, MutationObserver, Document } from './interfaces'
import {
  WindowInternal, RangeInternal, NodeIteratorInternal, DocumentInternal
} from './interfacesInternal'
import { EventTargetImpl } from './EventTargetImpl'
import { DOMObjectCacheImpl } from '../util'

/**
 * Represents a window containing a DOM document.
 */
export class WindowImpl extends EventTargetImpl implements WindowInternal {

  _currentEvent?: Event
  _signalSlots = new Set<Slot>()
  _mutationObserverMicrotaskQueued: boolean = false
  _mutationObservers = new Set<MutationObserver>()

  _associatedDocument: DocumentInternal

  _rangeList = new DOMObjectCacheImpl<RangeInternal>()
  _iteratorList = new DOMObjectCacheImpl<NodeIteratorInternal>()
  
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
  static _create(): WindowInternal {   
    return new WindowImpl()
  }
}
