import {
  WindowInternal as DOMWindowInternal, DocumentInternal as DOMDocumentInternal
} from "../dom/interfacesInternal"
import { Window, Document } from "./interfaces"

/**
 * Represents a window containing a DOM document.
 */
export interface WindowInternal extends Window, DOMWindowInternal {
  _associatedDocument: DocumentInternal
}

/**
 * Represents a DOM document.
 */
export interface DocumentInternal extends Document, DOMDocumentInternal {
  
}
