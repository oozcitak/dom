import { DocumentType, Document, XMLDocument } from "./interfaces"
import {
  DOMImplementationInternal, ElementInternal, DocumentInternal
} from "./interfacesInternal"
import { globalStore } from "../util"
import { DOMAlgorithm } from "./algorithm/interfaces"
import { infra } from "../infra"

/**
 * Represents an object providing methods which are not dependent on 
 * any particular document.
 */
export class DOMImplementationImpl implements DOMImplementationInternal {

  _associatedDocument: DocumentInternal

  private _algo: DOMAlgorithm

  /**
   * Initializes a new instance of `DOMImplementation`.
   */
  private constructor(document: DocumentInternal) {
    this._associatedDocument = document

    this._algo = globalStore.algorithm as DOMAlgorithm
  }

  /** @inheritdoc */
  createDocumentType(qualifiedName: string,
    publicId: string, systemId: string): DocumentType {
    /**
     * 1. Validate qualifiedName.
     * 2. Return a new doctype, with qualifiedName as its name, publicId as its 
     * public ID, and systemId as its system ID, and with its node document set
     * to the associated document of the context object.
     */
    this._algo.namespace.validate(qualifiedName)

    return this._algo.create.documentType(this._associatedDocument,
      qualifiedName, publicId, systemId)
  }

  /** @inheritdoc */
  createDocument(namespace: string | null, qualifiedName: string,
    doctype: DocumentType | null = null): XMLDocument {
    /**
     * 1. Let document be a new XMLDocument.
     */
    const document = this._algo.create.xmlDocument()

    /**
     * 2. Let element be null.
     * 3. If qualifiedName is not the empty string, then set element to 
     * the result of running the internal createElementNS steps, given document, 
     * namespace, qualifiedName, and an empty dictionary.
     */
    let element: ElementInternal | null = null
    if (qualifiedName) {
      element = this._algo.document.internalCreateElementNS(document,
        namespace, qualifiedName)
    }

    /**
     * 4. If doctype is non-null, append doctype to document.
     * 5. If element is non-null, append element to document.
     */
    if (doctype) document.appendChild(doctype)
    if (element) document.appendChild(element)

    /**
     * 6. document’s origin is context object’s associated document’s origin.
     */
    document._origin = this._associatedDocument._origin

    /**
     * 7. document’s content type is determined by namespace:
     * - HTML namespace
     * application/xhtml+xml
     * - SVG namespace
     * image/svg+xml
     * - Any other namespace
     * application/xml
     */
    if (namespace === infra.namespace.HTML)
      document._contentType = 'application/xhtml+xml'
    else if (namespace === infra.namespace.SVG)
      document._contentType = 'image/svg+xml'
    else
      document._contentType = 'application/xml'

    /**
     * 8. Return document.
     */
    return document
  }

  /** @inheritdoc */
  createHTMLDocument(title?: string): Document {
    /**
     * 1. Let doc be a new document that is an HTML document.
     * 2. Set doc’s content type to "text/html".
     */
    const doc = this._algo.create.document()
    doc._type = "html"
    doc._contentType = 'text/html'

    /**
     * 3. Append a new doctype, with "html" as its name and with its node 
     * document set to doc, to doc.
     */
    doc.appendChild(this._algo.create.documentType(doc, 'html', '', ''))

    /**
     * 4. Append the result of creating an element given doc, html, and the 
     * HTML namespace, to doc.
     */
    const htmlElement = this._algo.element.createAnElement(doc, 'html', infra.namespace.HTML)
    doc.appendChild(htmlElement)

    /**
     * 5. Append the result of creating an element given doc, head, and the 
     * HTML namespace, to the html element created earlier.
     */
    const headElement = this._algo.element.createAnElement(doc, 'head', infra.namespace.HTML)
    htmlElement.appendChild(headElement)

    /**
     * 6. If title is given:
     * 6.1. Append the result of creating an element given doc, title, and 
     * the HTML namespace, to the head element created earlier.
     * 6.2. Append a new Text node, with its data set to title (which could
     * be the empty string) and its node document set to doc, to the title 
     * element created earlier.
     */
    if (title !== undefined) {
      const titleElement = this._algo.element.createAnElement(doc, 'title', infra.namespace.HTML)
      headElement.appendChild(titleElement)
      const textElement = this._algo.create.text(doc, title)
      titleElement.appendChild(textElement)
    }

    /**
     * 7. Append the result of creating an element given doc, body, and the 
     * HTML namespace, to the html element created earlier.
     */
    const bodyElement = this._algo.element.createAnElement(doc, 'body', infra.namespace.HTML)
    htmlElement.appendChild(bodyElement)

    /**
     * 8. doc’s origin is context object’s associated document’s origin.
     */
    doc._origin = this._associatedDocument._origin

    /**
     * 9. Return doc.
     */
    return doc
  }

  /** @inheritdoc */
  hasFeature(): boolean { return true }

  /**
   * Creates a new `DOMImplementation`.
   * 
   * @param document - owner document
   */
  static _create(document: DocumentInternal): DOMImplementationInternal {
    return new DOMImplementationImpl(document)
  }
}
