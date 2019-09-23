import { Event, Slot, MutationObserver } from './interfaces'
import { WindowInternal } from './interfacesInternal'
import { EventTargetImpl } from './EventTargetImpl'

/**
 * Represents a window containing a DOM document.
 */
export class WindowImpl extends EventTargetImpl implements WindowInternal {

  _currentEvent?: Event
  _signalSlots = new Set<Slot>()
  _mutationObserverMicrotaskQueued: boolean = false
  _mutationObservers = new Set<MutationObserver>()
  
  /**
   * Initializes a new instance of `Window`.
   */
  protected constructor () {
    super()
  }

  /** @inheritdoc */
  get event(): Event | undefined {
    return this._currentEvent
  }

}
