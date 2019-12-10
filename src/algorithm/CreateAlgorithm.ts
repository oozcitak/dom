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
 * Creates a `DOMImplementation`.
 * 
 * @param document - associated document
 */
export function create_domImplementation(document: Interfaces.Document): DOMImplementation {
  return DOMImplementation._create(document)
}

/** 
 * Creates a `Window` node.
 */
export function create_window(): Window {
  return Window._create()
}

/** 
 * Creates an `XMLDocument` node.
 */
export function create_xmlDocument(): XMLDocument {
  return new XMLDocument()
}

/** 
 * Creates a `Document` node.
 */
export function create_document(): Document {
  return new Document()
}

/** 
 * Creates an `AbortController`.
 */
export function create_abortController(): AbortController {
  return new AbortController()
}

/** 
 * Creates an `AbortSignal`.
 */
export function create_abortSignal(): AbortSignal {
  return AbortSignal._create()
}

/** 
 * Creates a `DocumentType` node.
 * 
 * @param document - owner document
 * @param name - name of the node
 * @param publicId - `PUBLIC` identifier
 * @param systemId - `SYSTEM` identifier
 */
export function create_documentType(document: Interfaces.Document, name: string, publicId: string = '',
  systemId: string = ''): DocumentType {
  return DocumentType._create(document, name, publicId, systemId)
}

/**
 * Creates a new `Element` node.
 * 
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export function create_element(document: Interfaces.Document, localName: string, namespace: string | null = null,
  prefix: string | null = null): Interfaces.Element {
  return Element._create(document, localName, namespace, prefix)
}

/**
 * Creates a new `HTMLElement` node.
 * 
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export function create_htmlElement(document: Interfaces.Document, localName: string, namespace: string | null = null,
  prefix: string | null = null): Element {
  // TODO: Implement in HTML DOM
  return Element._create(document, localName, namespace, prefix)
}  

/**
 * Creates a new `HTMLUnknownElement` node.
 * 
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export function create_htmlUnknownElement(document: Interfaces.Document, localName: string, namespace: string | null = null,
  prefix: string | null = null): Element {
  // TODO: Implement in HTML DOM
  return Element._create(document, localName, namespace, prefix)
}

/**
 * Creates a new `DocumentFragment` node.
 * 
 * @param document - owner document
 */
export function create_documentFragment(document: Interfaces.Document): DocumentFragment {
  return DocumentFragment._create(document)
}

/**
 * Creates a new `ShadowRoot` node.
 * 
 * @param document - owner document
 * @param host - shadow root's host element node
 */
export function create_shadowRoot(document: Interfaces.Document, host: Element): ShadowRoot {
  return ShadowRoot._create(document, host)
}

/**
 * Creates a new `Attr` node.
 * 
 * @param document - owner document
 * @param localName - local name
 */
export function create_attr(document: Interfaces.Document, localName: string): Attr {
  return Attr._create(document, localName)
}

/**
 * Creates a new `Text` node.
 * 
 * @param document - owner document
 * @param data - node contents
 */
export function create_text(document: Interfaces.Document, data: string = ''): Text {
  return Text._create(document, data)
}

/**
 * Creates a new `CDATASection` node.
 * 
 * @param document - owner document
 * @param data - node contents
 */
export function create_cdataSection(document: Interfaces.Document, data: string = ''): CDATASection {
  return CDATASection._create(document, data)
}

/**
 * Creates a new `Comment` node.
 * 
 * @param document - owner document
 * @param data - node contents
 */
export function create_comment(document: Interfaces.Document, data: string = ''): Comment {
  return Comment._create(document, data)
}

/**
 * Creates a new `ProcessingInstruction` node.
 * 
 * @param document - owner document
 * @param target - instruction target
 * @param data - node contents
 */
export function create_processingInstruction(document: Interfaces.Document, target: string,
  data: string = ''): ProcessingInstruction {
  return ProcessingInstruction._create(document, target, data)
}

/**
 * Creates a new `HTMLCollection`.
 * 
 * @param root - root node
 * @param filter - node filter
 */
export function create_htmlCollection(root: Interfaces.Node,
  filter: ((element: Interfaces.Element) => any) = (() => true)): HTMLCollection {
  return HTMLCollection._create(root, filter)
}

/**
 * Creates a new live `NodeList`.
 * 
 * @param root - root node
 */
export function create_nodeList(root: Interfaces.Node): NodeList {
  return NodeList._create(root)
}

/**
 * Creates a new static `NodeList`.
 * 
 * @param root - root node
 * @param items - a list of items to initialize the list
 */
export function create_nodeListStatic(root: Interfaces.Node, items: Interfaces.Node[]): NodeList {
  return NodeListStatic._create(root, items)
}

/**
 * Creates a new `NamedNodeMap`.
 * 
 * @param element - parent element
 */
export function create_namedNodeMap(element: Interfaces.Element): NamedNodeMap {
  return NamedNodeMap._create(element)
}

/**
 * Creates a new `Range`.
 * 
 * @param start - start point
 * @param end - end point
 */
export function create_range(start?: Interfaces.BoundaryPoint, end?: Interfaces.BoundaryPoint): Range {
  return Range._create(start, end)
}

/**
 * Creates a new `NodeIterator`.
 * 
 * @param root - iterator's root node
 * @param reference - reference node
 * @param pointerBeforeReference - whether the iterator is before or after the
 * reference node 
 */
export function create_nodeIterator(root: Interfaces.Node, reference: Interfaces.Node,
  pointerBeforeReference: boolean): NodeIterator {
  return NodeIterator._create(root, reference, pointerBeforeReference)
}

/**
 * Creates a new `TreeWalker`.
 * 
 * @param root - iterator's root node
 * @param current - current node
 */
export function create_treeWalker(root: Interfaces.Node, current: Interfaces.Node): TreeWalker {
  return TreeWalker._create(root, current)
}

/**
 * Creates a new `NodeFilter`.
 */
export function create_nodeFilter(): NodeFilter {
  return NodeFilter._create()
}

/**
 * Creates a new `MutationRecord`.
 * 
 * @param type - type of mutation: `"attributes"` for an attribute
 * mutation, `"characterData"` for a mutation to a CharacterData node
 * and `"childList"` for a mutation to the tree of nodes.
 * @param target - node affected by the mutation.
 * @param addedNodes - list of added nodes.
 * @param removedNodes - list of removed nodes.
 * @param previousSibling - previous sibling of added or removed nodes.
 * @param nextSibling - next sibling of added or removed nodes.
 * @param attributeName - local name of the changed attribute, 
 * and `null` otherwise.
 * @param attributeNamespace - namespace of the changed attribute,
 * and `null` otherwise.
 * @param oldValue - value before mutation: attribute value for an attribute
 * mutation, node `data` for a mutation to a CharacterData node and `null`
 * for a mutation to the tree of nodes.
 */
export function create_mutationRecord(type: "attributes" | "characterData" | "childList",
  target: Interfaces.Node, addedNodes: Interfaces.NodeList,
  removedNodes: Interfaces.NodeList, previousSibling: Interfaces.Node | null,
  nextSibling: Interfaces.Node | null, attributeName: string | null,
  attributeNamespace: string | null, oldValue: string | null): MutationRecord {

  return MutationRecord._create(type, target, addedNodes, removedNodes,
    previousSibling, nextSibling, attributeName, attributeNamespace, oldValue)
}

/**
 * Creates a new `DOMTokenList`.
 * 
 * @param element - associated element
 * @param attribute - associated attribute
 */
export function create_domTokenList(element: Interfaces.Element, 
  attribute: Interfaces.Attr): DOMTokenList {
  return DOMTokenList._create(element, attribute)
}

/** 
 * Creates an `URLRecord`.
 * 
 * @param url - an URL string
 */
export function create_urlRecord(url: string): URLInterfaces.URLRecord {
  const urlRecord = new URLAlgorithm().basicURLParser(url)
  if (urlRecord === null) {
    throw new Error("Invalid URL.")
  }
  return urlRecord
}
