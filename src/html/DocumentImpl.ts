import { DocumentImpl as DOMDocumentImpl } from '../dom/DocumentImpl'
import { DocumentInternal } from './interfacesInternal'
import { globalStore } from '../util'

/**
 * Represents a window containing a DOM document.
 */
export class DocumentImpl extends DOMDocumentImpl implements DocumentInternal {

  /**
   * Initializes a new instance of `Document`.
   */
  public constructor() {
    super()

    /**
     * The Document() constructor, when invoked, must return a new document 
     * whose origin is the origin of current global object’s associated
     * Document. [HTML]
     */
    try {
      this._origin = globalStore.window._associatedDocument._origin
    } catch {
      this._origin = null
    }
  }

  /** @inheritdoc */
  get origin(): string {
    /**
     * The origin attribute’s getter must return the serialization of context 
     * object’s origin.
     */
    const algo = globalStore.algorithm
    return algo.origin.serializationOfAnOrigin(this._origin)
  }

}
