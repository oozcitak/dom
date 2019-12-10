import { URLAlgorithm, Interfaces as URLInterfaces } from '@oozcitak/url'
import { 
  Document, DOMImplementation, Window, XMLDocument, AbortController, 
  AbortSignal, DocumentType, Element, DocumentFragment, ShadowRoot, Attr, Text, 
  CDATASection, Comment, ProcessingInstruction, Node, HTMLCollection, NodeList, 
  NamedNodeMap, BoundaryPoint, Range, NodeIterator, TreeWalker, NodeFilter, 
  MutationRecord, DOMTokenList
} from '../dom/interfaces'
import { DOMImplementationImpl } from '../dom/DOMImplementationImpl'
import { WindowImpl } from '../dom/WindowImpl'
import { XMLDocumentImpl } from '../dom/XMLDocumentImpl'
import { DocumentImpl } from '../dom/DocumentImpl'
import { AbortControllerImpl } from '../dom/AbortControllerImpl'
import { AbortSignalImpl } from '../dom/AbortSignalImpl'
import { DocumentTypeImpl } from '../dom/DocumentTypeImpl'
import { ElementImpl } from '../dom/ElementImpl'
import { DocumentFragmentImpl } from '../dom/DocumentFragmentImpl'
import { ShadowRootImpl } from '../dom/ShadowRootImpl'
import { AttrImpl } from '../dom/AttrImpl'
import { TextImpl } from '../dom/TextImpl'
import { CDATASectionImpl } from '../dom/CDATASectionImpl'
import { CommentImpl } from '../dom/CommentImpl'
import { ProcessingInstructionImpl } from '../dom/ProcessingInstructionImpl'
import { HTMLCollectionImpl } from '../dom/HTMLCollectionImpl'
import { NodeListImpl } from '../dom/NodeListImpl'
import { NodeListStaticImpl } from '../dom/NodeListStaticImpl'
import { NamedNodeMapImpl } from '../dom/NamedNodeMapImpl'
import { RangeImpl } from '../dom/RangeImpl'
import { NodeIteratorImpl } from '../dom/NodeIteratorImpl'
import { TreeWalkerImpl } from '../dom/TreeWalkerImpl'
import { NodeFilterImpl } from '../dom/NodeFilterImpl'
import { MutationRecordImpl } from '../dom/MutationRecordImpl'
import { DOMTokenListImpl } from '../dom/DOMTokenListImpl'

/** 
 * Creates a `DOMImplementation`.
 * 
 * @param document - associated document
 */
export function create_domImplementation(document: Document): DOMImplementation {
  return DOMImplementationImpl._create(document)
}

/** 
 * Creates a `Window` node.
 */
export function create_window(): Window {
  return WindowImpl._create()
}

/** 
 * Creates an `XMLDocument` node.
 */
export function create_xmlDocument(): XMLDocument {
  return new XMLDocumentImpl()
}

/** 
 * Creates a `Document` node.
 */
export function create_document(): Document {
  return new DocumentImpl()
}

/** 
 * Creates an `AbortController`.
 */
export function create_abortController(): AbortController {
  return new AbortControllerImpl()
}

/** 
 * Creates an `AbortSignal`.
 */
export function create_abortSignal(): AbortSignal {
  return AbortSignalImpl._create()
}

/** 
 * Creates a `DocumentType` node.
 * 
 * @param document - owner document
 * @param name - name of the node
 * @param publicId - `PUBLIC` identifier
 * @param systemId - `SYSTEM` identifier
 */
export function create_documentType(document: Document, name: string, publicId: string = '',
  systemId: string = ''): DocumentType {
  return DocumentTypeImpl._create(document, name, publicId, systemId)
}

/**
 * Creates a new `Element` node.
 * 
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export function create_element(document: Document, localName: string, namespace: string | null = null,
  prefix: string | null = null): Element {
  return ElementImpl._create(document, localName, namespace, prefix)
}

/**
 * Creates a new `HTMLElement` node.
 * 
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export function create_htmlElement(document: Document, localName: string, namespace: string | null = null,
  prefix: string | null = null): Element {
  // TODO: Implement in HTML DOM
  return ElementImpl._create(document, localName, namespace, prefix)
}  

/**
 * Creates a new `HTMLUnknownElement` node.
 * 
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
export function create_htmlUnknownElement(document: Document, localName: string, namespace: string | null = null,
  prefix: string | null = null): Element {
  // TODO: Implement in HTML DOM
  return ElementImpl._create(document, localName, namespace, prefix)
}

/**
 * Creates a new `DocumentFragment` node.
 * 
 * @param document - owner document
 */
export function create_documentFragment(document: Document): DocumentFragment {
  return DocumentFragmentImpl._create(document)
}

/**
 * Creates a new `ShadowRoot` node.
 * 
 * @param document - owner document
 * @param host - shadow root's host element node
 */
export function create_shadowRoot(document: Document, host: Element): ShadowRoot {
  return ShadowRootImpl._create(document, host)
}

/**
 * Creates a new `Attr` node.
 * 
 * @param document - owner document
 * @param localName - local name
 */
export function create_attr(document: Document, localName: string): Attr {
  return AttrImpl._create(document, localName)
}

/**
 * Creates a new `Text` node.
 * 
 * @param document - owner document
 * @param data - node contents
 */
export function create_text(document: Document, data: string = ''): Text {
  return TextImpl._create(document, data)
}

/**
 * Creates a new `CDATASection` node.
 * 
 * @param document - owner document
 * @param data - node contents
 */
export function create_cdataSection(document: Document, data: string = ''): CDATASection {
  return CDATASectionImpl._create(document, data)
}

/**
 * Creates a new `Comment` node.
 * 
 * @param document - owner document
 * @param data - node contents
 */
export function create_comment(document: Document, data: string = ''): Comment {
  return CommentImpl._create(document, data)
}

/**
 * Creates a new `ProcessingInstruction` node.
 * 
 * @param document - owner document
 * @param target - instruction target
 * @param data - node contents
 */
export function create_processingInstruction(document: Document, target: string,
  data: string = ''): ProcessingInstruction {
  return ProcessingInstructionImpl._create(document, target, data)
}

/**
 * Creates a new `HTMLCollection`.
 * 
 * @param root - root node
 * @param filter - node filter
 */
export function create_htmlCollection(root: Node,
  filter: ((element: Element) => any) = (() => true)): HTMLCollection {
  return HTMLCollectionImpl._create(root, filter)
}

/**
 * Creates a new live `NodeList`.
 * 
 * @param root - root node
 */
export function create_nodeList(root: Node): NodeList {
  return NodeListImpl._create(root)
}

/**
 * Creates a new static `NodeList`.
 * 
 * @param root - root node
 * @param items - a list of items to initialize the list
 */
export function create_nodeListStatic(root: Node, items: Node[]): NodeList {
  return NodeListStaticImpl._create(root, items)
}

/**
 * Creates a new `NamedNodeMap`.
 * 
 * @param element - parent element
 */
export function create_namedNodeMap(element: Element): NamedNodeMap {
  return NamedNodeMapImpl._create(element)
}

/**
 * Creates a new `Range`.
 * 
 * @param start - start point
 * @param end - end point
 */
export function create_range(start?: BoundaryPoint, end?: BoundaryPoint): Range {
  return RangeImpl._create(start, end)
}

/**
 * Creates a new `NodeIterator`.
 * 
 * @param root - iterator's root node
 * @param reference - reference node
 * @param pointerBeforeReference - whether the iterator is before or after the
 * reference node 
 */
export function create_nodeIterator(root: Node, reference: Node,
  pointerBeforeReference: boolean): NodeIterator {
  return NodeIteratorImpl._create(root, reference, pointerBeforeReference)
}

/**
 * Creates a new `TreeWalker`.
 * 
 * @param root - iterator's root node
 * @param current - current node
 */
export function create_treeWalker(root: Node, current: Node): TreeWalker {
  return TreeWalkerImpl._create(root, current)
}

/**
 * Creates a new `NodeFilter`.
 */
export function create_nodeFilter(): NodeFilter {
  return NodeFilterImpl._create()
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
  target: Node, addedNodes: NodeList,
  removedNodes: NodeList, previousSibling: Node | null,
  nextSibling: Node | null, attributeName: string | null,
  attributeNamespace: string | null, oldValue: string | null): MutationRecord {

  return MutationRecordImpl._create(type, target, addedNodes, removedNodes,
    previousSibling, nextSibling, attributeName, attributeNamespace, oldValue)
}

/**
 * Creates a new `DOMTokenList`.
 * 
 * @param element - associated element
 * @param attribute - associated attribute
 */
export function create_domTokenList(element: Element, 
  attribute: Attr): DOMTokenList {
  return DOMTokenListImpl._create(element, attribute)
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
