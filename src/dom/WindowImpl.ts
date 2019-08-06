import { Event } from './interfaces'
import { WindowInternal } from './interfacesInternal'
import { EventTargetImpl } from './EventTargetImpl'

/**
 * Represents a window containing a DOM document.
 */
export class WindowImpl extends EventTargetImpl implements WindowInternal {

  _currentEvent?: Event

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
