import { DocumentType, Document, XMLDocument } from "./interfaces"
import { DocumentTypeImpl } from "./DocumentTypeImpl"
import { DocumentImpl } from "./DocumentImpl"
import { XMLDocumentImpl } from "./XMLDocumentImpl"
import { Namespace } from './spec'
import { DOMImplementationInternal } from "./interfacesInternal"

/**
 * Represents an object providing methods which are not dependent on 
 * any particular document.
 */
export class DOMImplementationImpl implements DOMImplementationInternal {

  /**
   * Creates and returns a {@link DocType}.
   * 
   * @param qualifiedName - the qualified name
   * @param publicId - the `PUBLIC` identifier
   * @param publicId - the `SYSTEM` identifier
   */
  createDocumentType(qualifiedName: string,
    publicId: string, systemId: string): DocumentType {
    Namespace.validateQName(qualifiedName)

    const node = DocumentTypeImpl._create()
    node._name = qualifiedName
    node._publicId = publicId
    node._systemId = systemId
    return node
  }

  /**
   * Creates and returns an {@link XMLDocument}.
   * 
   * @param namespace - the namespace of the document element
   * @param qualifiedName - the qualified name of the document element
   * @param doctype - a {@link DocType} to assign to this document
   */
  createDocument(namespace: string | null, qualifiedName: string,
    doctype: DocumentType | null = null): XMLDocument {
    const document = new XMLDocumentImpl()

    if (doctype)
      document.appendChild(doctype)

    if (qualifiedName) {
      const element = document.createElementNS(namespace, qualifiedName)
      document.appendChild(element)
    }

    // document's content type is determined by namespace
    if (namespace === Namespace.HTML)
      document._contentType = 'application/xhtml+xml'
    else if (namespace === Namespace.SVG)
      document._contentType = 'image/svg+xml'
    else
      document._contentType = 'application/xml'

    return document
  }

  /**
   * Creates and returns a HTML document.
   * 
   * @param title - document title
   */
  createHTMLDocument(title?: string): Document {
    const doc = new DocumentImpl()
    doc._contentType = 'text/html'

    const doctype = this.createDocumentType('html', '', '')
    doc.appendChild(doctype)

    const htmlElement = doc.createElementNS(Namespace.HTML, 'html')
    doc.appendChild(htmlElement)

    const headElement = doc.createElementNS(Namespace.HTML, 'head')
    htmlElement.appendChild(headElement)

    if (title !== undefined) {
      const titleElement = doc.createElementNS(Namespace.HTML, 'title')
      headElement.appendChild(titleElement)
      const textElement = doc.createTextNode(title)
      titleElement.appendChild(textElement)
    }

    const bodyElement = doc.createElementNS(Namespace.HTML, 'body')
    htmlElement.appendChild(bodyElement)

    // document's content type is determined by namespace
    doc._contentType = 'application/xhtml+xml'

    return doc
  }

  /**
   * Obsolete, always returns true.
   */
  hasFeature(): boolean { return true }
}
