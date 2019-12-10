import {
  DocumentType, Document, XMLDocument, DOMImplementation, Element
} from "./interfaces"
import { namespace as infraNamespace } from "@oozcitak/infra"
import { create_documentType, create_xmlDocument, create_document, create_text } from "../algorithm/CreateAlgorithm"
import { namespace_validate } from "../algorithm/NamespaceAlgorithm"
import { document_internalCreateElementNS } from "../algorithm/DocumentAlgorithm"
import { element_createAnElement } from "../algorithm/ElementAlgorithm"
import { DOMImpl } from "./DOMImpl"

/**
 * Represents an object providing methods which are not dependent on 
 * any particular document.
 */
export class DOMImplementationImpl implements DOMImplementation {

  _associatedDocument: Document

  /**
   * Initializes a new instance of `DOMImplementation`.
   * 
   * @param document - the associated document
   */
  constructor(document?: Document) {
    this._associatedDocument = document || DOMImpl.instance.window.document
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
    namespace_validate(qualifiedName)

    return create_documentType(this._associatedDocument,
      qualifiedName, publicId, systemId)
  }

  /** @inheritdoc */
  createDocument(namespace: string | null, qualifiedName: string,
    doctype: DocumentType | null = null): XMLDocument {
    /**
     * 1. Let document be a new XMLDocument.
     */
    const document = create_xmlDocument()

    /**
     * 2. Let element be null.
     * 3. If qualifiedName is not the empty string, then set element to 
     * the result of running the internal createElementNS steps, given document, 
     * namespace, qualifiedName, and an empty dictionary.
     */
    let element: Element | null = null
    if (qualifiedName) {
      element = document_internalCreateElementNS(document,
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
    if (namespace === infraNamespace.HTML)
      document._contentType = "application/xhtml+xml"
    else if (namespace === infraNamespace.SVG)
      document._contentType = "image/svg+xml"
    else
      document._contentType = "application/xml"

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
    const doc = create_document()
    doc._type = "html"
    doc._contentType = "text/html"

    /**
     * 3. Append a new doctype, with "html" as its name and with its node 
     * document set to doc, to doc.
     */
    doc.appendChild(create_documentType(doc, "html", "", ""))

    /**
     * 4. Append the result of creating an element given doc, html, and the 
     * HTML namespace, to doc.
     */
    const htmlElement = element_createAnElement(doc, "html", infraNamespace.HTML)
    doc.appendChild(htmlElement)

    /**
     * 5. Append the result of creating an element given doc, head, and the 
     * HTML namespace, to the html element created earlier.
     */
    const headElement = element_createAnElement(doc, "head", infraNamespace.HTML)
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
      const titleElement = element_createAnElement(doc, "title", infraNamespace.HTML)
      headElement.appendChild(titleElement)
      const textElement = create_text(doc, title)
      titleElement.appendChild(textElement)
    }

    /**
     * 7. Append the result of creating an element given doc, body, and the 
     * HTML namespace, to the html element created earlier.
     */
    const bodyElement = element_createAnElement(doc, "body", infraNamespace.HTML)
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
  static _create(document: Document): DOMImplementationImpl {
    return new DOMImplementationImpl(document)
  }
}
