import { WindowImpl as DOMWindowImpl } from '../dom/WindowImpl'
import { WindowInternal, DocumentInternal } from './interfacesInternal'
import { globalStore } from '../util'
import { Window, Document } from './interfaces'

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

    const algo = globalStore.algorithm
    this._associatedDocument = algo.create.document()
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
  static _create(): WindowInternal {   
    return new WindowImpl()
  }

}
