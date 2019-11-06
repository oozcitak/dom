import { CreateAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import {
  Text, CDATASection, ProcessingInstruction, DOMImplementation,
  Comment, Document, DocumentFragment, HTMLCollection,
  NamedNodeMap, Element, DocumentType, Attr, Node, NodeList,
  NodeListStatic, Range, NodeIterator, TreeWalker,
  NodeFilter, MutationRecord, XMLDocument, DOMTokenList, 
  ShadowRoot, AbortController, AbortSignal, Window, Interfaces
} from '../dom'
import { URLAlgorithm, Interfaces as URLInterfaces } from '@oozcitak/url'
import { BoundaryPoint } from '../dom/interfaces'

/**
 * Contains algorithms for creating DOM objects.
 */
export class CreateAlgorithmImpl extends SubAlgorithmImpl implements CreateAlgorithm {

  /**
   * Initializes a new `CreateAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  domImplementation(document: Document): DOMImplementation {
    return DOMImplementation._create(document)
  }

  /** @inheritdoc */
  window(): Window {
    return Window._create()
  }
  
  /** @inheritdoc */
  xmlDocument(): XMLDocument {
    return new XMLDocument()
  }

  /** @inheritdoc */
  document(): Document {
    return new Document()
  }

  /** @inheritdoc */
  abortController(): AbortController {
    return new AbortController()
  }

  /** @inheritdoc */
  abortSignal(): AbortSignal {
    return AbortSignal._create()
  }

  /** @inheritdoc */
  documentType(document: Document, name: string, publicId: string = '',
    systemId: string = ''): DocumentType {
    return DocumentType._create(document, name, publicId, systemId)
  }

  /** @inheritdoc */
  element(document: Document, localName: string, namespace: string | null = null,
    prefix: string | null = null): Element {
    return Element._create(document, localName, namespace, prefix)
  }

  /** @inheritdoc */
  htmlElement(document: Document, localName: string, namespace: string | null = null,
    prefix: string | null = null): Element {
    // TODO: Implement in HTML DOM
    return Element._create(document, localName, namespace, prefix)
  }  

  /** @inheritdoc */
  htmlUnknownElement(document: Document, localName: string, namespace: string | null = null,
    prefix: string | null = null): Element {
    // TODO: Implement in HTML DOM
    return Element._create(document, localName, namespace, prefix)
  }

  /** @inheritdoc */
  documentFragment(document: Document): DocumentFragment {
    return DocumentFragment._create(document)
  }

  /** @inheritdoc */
  shadowRoot(document: Document, host: Element): ShadowRoot {
    return ShadowRoot._create(document, host)
  }

  /** @inheritdoc */
  attr(document: Document, localName: string): Attr {
    return Attr._create(document, localName)
  }

  /** @inheritdoc */
  text(document: Document, data: string = ''): Text {
    return Text._create(document, data)
  }

  /** @inheritdoc */
  cdataSection(document: Document, data: string = ''): CDATASection {
    return CDATASection._create(document, data)
  }

  /** @inheritdoc */
  comment(document: Document, data: string = ''): Comment {
    return Comment._create(document, data)
  }

  /** @inheritdoc */
  processingInstruction(document: Document, target: string,
    data: string = ''): ProcessingInstruction {
    return ProcessingInstruction._create(document, target, data)
  }

  /** @inheritdoc */
  htmlCollection(root: Node,
    filter: ((element: Interfaces.Element) => any) = (() => true)): HTMLCollection {
    return HTMLCollection._create(root, filter)
  }

  /** @inheritdoc */
  nodeList(root: Node): NodeList {
    return NodeList._create(root)
  }

  /** @inheritdoc */
  nodeListStatic(root: Node, items: Node[]): NodeList {
    return NodeListStatic._create(root, items)
  }

  /** @inheritdoc */
  namedNodeMap(element: Element): NamedNodeMap {
    return NamedNodeMap._create(element)
  }

  /** @inheritdoc */
  range(start?: BoundaryPoint, end?: BoundaryPoint): Range {
    return Range._create(start, end)
  }

  /** @inheritdoc */
  nodeIterator(root: Node, reference: Node,
    pointerBeforeReference: boolean): NodeIterator {
    return NodeIterator._create(root, reference, pointerBeforeReference)
  }

  /** @inheritdoc */
  treeWalker(root: Node, current: Node): TreeWalker {
    return TreeWalker._create(root, current)
  }

  /** @inheritdoc */
  nodeFilter(): NodeFilter {
    return NodeFilter._create()
  }

  /** @inheritdoc */
  mutationRecord(type: "attributes" | "characterData" | "childList",
    target: Node, addedNodes: NodeList,
    removedNodes: NodeList, previousSibling: Node | null,
    nextSibling: Node | null, attributeName: string | null,
    attributeNamespace: string | null, oldValue: string | null): MutationRecord {

    return MutationRecord._create(type, target, addedNodes, removedNodes,
      previousSibling, nextSibling, attributeName, attributeNamespace, oldValue)
  }

  /** @inheritdoc */
  domTokenList(element: Element, attribute: Attr): DOMTokenList {
    return DOMTokenList._create(element, attribute)
  }

  /** @inheritdoc */
  urlRecord(url: string): URLInterfaces.URLRecord {
    const urlRecord = new URLAlgorithm().basicURLParser(url)
    if (urlRecord === null) {
      throw new Error("Invalid URL.")
    }
    return urlRecord
  }

}
