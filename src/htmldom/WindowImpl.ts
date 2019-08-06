import { WindowImpl as DOMWindowImpl } from '../dom/WindowImpl'
import { WindowInternal, DocumentInternal } from './interfacesInternal'
import { globalStore } from '../util'
import { Event } from '../dom/interfaces'
import { Window, Document } from './interfaces'
import { DOMAlgorithmImpl } from '../dom/DOMAlgorithmImpl'

/**
 * Represents a window containing a DOM document.
 */
export class WindowImpl extends DOMWindowImpl implements WindowInternal {

  _associatedDocument: DocumentInternal

  /**
   * Initializes a new instance of `Window`.
   * 
   * @param document - associated document
   */
  protected constructor() {
    super()

    this._associatedDocument = undefined as unknown as DocumentInternal
  }

  /** @inheritdoc */
  get event(): Event | undefined {
    return this._currentEvent
  }

  /** @inheritdoc */
  get window(): Window { return this }

  /** @inheritdoc */
  get self(): Window { return this }

  /** @inheritdoc */
  get frames(): Window { return this }

  /** @inheritdoc */
  get document(): Document { return this._associatedDocument }

  /**
   * Creates a new window with a blank document.
   */
  static _create(): Window {
    const algorithm = new DOMAlgorithmImpl()
    globalStore.algorithm = algorithm
    
    const window = new WindowImpl()
    globalStore.window = window

    // require here to prevent circular reference
    const DocImpl = require('./DocumentImpl').DocumentImpl
    const doc = new DocImpl()
    window._associatedDocument = doc

    return window
  }

}
