import {
  Event, PotentialEventTarget, EventPathItem, EventTarget, EventListenerEntry,
  AbortController, AbortSignal, MutationObserver, MutationCallback, Node,
  MutationRecord, Document, RegisteredObserver, TransientRegisteredObserver,
  DocumentType, DocumentFragment, Element, ShadowRoot, ShadowRootMode,
  NamedNodeMap, Attr, CharacterData, ProcessingInstruction, BoundaryPoint,
  Range, AbstractRange, NodeIterator, Traverser, WhatToShow, NodeFilter,
  Collection, NodeList, HTMLCollection, TreeWalker, DOMTokenList, CustomEvent,
  DOMImplementation, Text, CDATASection, Comment, StaticRange, Slotable,
  ChildNode, NonDocumentTypeChildNode, ParentNode, DocumentOrShadowRoot,
  NonElementParentNode, EventPhase, XMLDocument, Window
} from "./interfaces"
import { HTMLSlotElement } from '../htmldom/interfaces'

/**
 * Defines a cloning step.
 */
export type CloningStep = ((copy: NodeInternal, node: NodeInternal, document:
  DocumentInternal, cloneChildrenFlag?: boolean) => any)

/**
 * Defines an adopting step.
 */
export type AdoptingStep = ((node: NodeInternal, oldDocument: DocumentInternal) => any)

/**
 * Defines a cloning step.
 */
export type ChildTextContentChangeStep = ((parent: NodeInternal) => any)

/**
 * Contains DOM manipulation algorithms as described in the 
 * [DOM Living Standard](https://dom.spec.whatwg.org).
 */
export interface DOMAlgorithmInternal {

  /**
   * Defines cloning steps.
   */
  cloningSteps: CloningStep[]

  /**
   * Defines cloning steps.
   */
  adoptingSteps: AdoptingStep[]

  /**
   * Defines child text content change steps.
   */
  childTextContentChangeSteps: ChildTextContentChangeStep[]

  /**
   * Runs cloning steps for node.
   * 
   * @param copy - node clone
   * @param node - node
   * @param document - document to own the cloned node
   * @param cloneChildrenFlag - whether child nodes are cloned
   */
  runCloningSteps(copy: NodeInternal, node: NodeInternal, document:
    DocumentInternal, cloneChildrenFlag?: boolean): void

  /**
   * Runs adopting steps for node.
   * 
   * @param node - node
   * @param oldDocument - old document
   */
  runAdoptingSteps(node: NodeInternal, oldDocument: DocumentInternal): void

  /**
   * Runs child text content change steps for a parent node.
   * 
   * @param parent - parent node with text node child nodes
   */
  runChildTextContentChangeSteps(parent: NodeInternal): void

  /**
   * Creates an element node.
   * See: https://dom.spec.whatwg.org/#concept-create-element.
   * 
   * @param document - the document owning the element
   * @param localName - local name
   * @param namespace - element namespace
   * @param prefix - namespace prefix
   * @param is - the "is" value
   * @param synchronousCustomElementsFlag - synchronous custom elements flag
   */
  createAnElement(document: DocumentInternal, localName: string,
    namespace: string | null, prefix: string | null, is: string | null,
    synchronousCustomElementsFlag: boolean): ElementInternal

  /**
   * Validates and extracts a namespace, prefix and localName from the
   * given namespace and qualified name.
   * See: https://dom.spec.whatwg.org/#validate-and-extract.
   * 
   * @param namespace - namespace
   * @param qualifiedName - qualified name
   * 
   * @returns a tuple with `namespace`, `prefix`, and `localName`.
   */
  validateAndExtract(namespace: string | null, qualifiedName: string):
    [string | null, string | null, string]

  /**
   * Creates a new element node.
   * See: https://dom.spec.whatwg.org/#internal-createelementns-steps
   * 
   * @param document - owner document
   * @param namespace - element namespace
   * @param qualifiedName - qualified name
   * @param options - element options
   */
  internalCreateElementNS(document: DocumentInternal, namespace: string | null,
    qualifiedName: string, options?: string | { is: string }): ElementInternal

  /**
   * Returns a collection of elements with the given qualified name which are
   * descendants of the given root node.
   * See: https://dom.spec.whatwg.org/#concept-getelementsbytagname
   * 
   * @param qualifiedName - qualified name
   * @param root - root node
   */
  listOfElementsWithQualifiedName(qualifiedName: string, root: NodeInternal):
    HTMLCollectionInternal

  /**
   * Returns a collection of elements with the given namespace which are
   * descendants of the given root node.
   * See: https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
   * 
   * @param namespace - element namespace
   * @param localName - local name
   * @param root - root node
   */
  listOfElementsWithNamespace(namespace: string | null, localName: string,
    root: NodeInternal): HTMLCollectionInternal

  /**
   * Returns a collection of elements with the given class names which are
   * descendants of the given root node.
   * See: https://dom.spec.whatwg.org/#concept-getelementsbyclassname
   * 
   * @param namespace - element namespace
   * @param localName - local name
   * @param root - root node
   */
  listOfElementsWithClassNames(classNames: string, root: NodeInternal):
    HTMLCollectionInternal

  /**
   * Clones a node.
   * 
   * @param node - a node to clone
   * @param document - the document to own the cloned node
   * @param cloneChildrenFlag - whether to clone node's children
   */
  cloneNode(node: NodeInternal, document?: DocumentInternal | null,
    cloneChildrenFlag?: boolean): NodeInternal

  /**
   * Ensures pre-insertion validity of a node into a parent before a
   * child, then adopts the node to the tree and inserts it.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   * @param child - child node to insert node before
   */
  preInsert(node: NodeInternal, parent: NodeInternal,
    child: NodeInternal | null): NodeInternal

  /**
   * Ensures pre-insertion validity of a node into a parent before a
   * child.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   * @param child - child node to insert node before
   */
  ensurePreInsertionValidity(node: NodeInternal, parent: NodeInternal,
    child: NodeInternal | null): void

  /**
   * Removes `node` and its subtree from its document and changes
   * its owner document to `document` so that it can be inserted
   * into `document`.
   * 
   * @param node - the node to move
   * @param document - document to receive the node and its subtree
   */
  adoptNode(node: NodeInternal, document: DocumentInternal): void

  /**
   * Appends a node to the children of a parent node.
   * 
   * @param node - a node
   * @param parent - the parent to receive node
   */
  appendNode(node: NodeInternal, parent: NodeInternal): void

  /**
   * Inserts a node into a parent node before the given child node.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   * @param child - child node to insert node before
   * @param suppressObservers - whether to notify observers
   */
  insertNode(node: NodeInternal, parent: NodeInternal,
    child: NodeInternal | null, suppressObservers?: boolean): void

  /**
   * Replaces a node with another node.
   * 
   * @param child - child node to remove
   * @param node - node to insert
   * @param parent - parent node to receive node
   */
  replaceNode(child: NodeInternal, node: NodeInternal,
    parent: NodeInternal): NodeInternal

  /**
   * Replaces all nodes of a parent with the given node.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   */
  replaceAllNode(node: NodeInternal | null, parent: NodeInternal): void

  /**
   * Ensures pre-removal validity of a node from a parent, then
   * removes it.
   * 
   * @param node - node to remove
   * @param parent - parent node
   */
  preRemoveNode(node: NodeInternal, parent: NodeInternal): NodeInternal

  /**
   * Removes a child node from its parent.
   * 
   * @param node - node to remove
   * @param parent - parent node
   * @param suppressObservers - whether to notify observers
   */
  removeNode(node: NodeInternal, parent: NodeInternal, suppressObservers?: boolean): void

  /**
   * Queues a mutation record of the given type for target.
   * 
   * @param type - mutation record type
   * @param target - target node
   * @param name - name before mutation
   * @param namespace - namespace before mutation
   * @param oldValue - attribute value before mutation
   * @param addedNodes - a list od added nodes
   * @param removedNodes - a list of removed nodes
   * @param previousSibling - previous sibling of target before mutation
   * @param nextSibling - next sibling of target before mutation
   */
  queueMutationRecord(type: string, target: NodeInternal, name: string | null,
    namespace: string | null, oldValue: string | null,
    addedNodes: NodeInternal[], removedNodes: NodeInternal[],
    previousSibling: NodeInternal | null, nextSibling: NodeInternal | null): void

  /**
   * Queues a tree mutation record for target.
   * 
   * @param target - target node
   * @param addedNodes - a list od added nodes
   * @param removedNodes - a list of removed nodes
   * @param previousSibling - previous sibling of target before mutation
   * @param nextSibling - next sibling of target before mutation
   */
  queueTreeMutationRecord(target: NodeInternal,
    addedNodes: NodeInternal[], removedNodes: NodeInternal[],
    previousSibling: NodeInternal | null, nextSibling: NodeInternal | null): void

  /**
   * Queues an attribute mutation record for target.
   * 
   * @param target - target node
   * @param name - name before mutation
   * @param namespace - namespace before mutation
   * @param oldValue - attribute value before mutation
   */
  queueAttributeMutationRecord(target: NodeInternal, name: string | null,
    namespace: string | null, oldValue: string | null): void

  /**
   * Appends an attribute to an element node.
   * 
   * @param attr - an attribute
   * @param element - an element to receive the attribute
   */
  appendAnAttribute(attr: AttrInternal, element: ElementInternal): void

  /** 
   * Creates a `DOMImplementation`.
   */
  createDOMImplementation(): DOMImplementationInternal

  /** 
   * Creates a `Document` node.
   */
  createDocument(): DocumentInternal

  /** 
   * Creates a `DocumentType` node.
   */
  createDocumentType(): DocumentTypeInternal

  /**
   * Creates a new `Element` node.
   * 
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  createElement(localName: string, namespace: string | null,
    prefix: string | null): ElementInternal

  /**
   * Creates a new `DocumentFragment` node.
   */
  createDocumentFragment(): DocumentFragmentInternal

  /**
   * Creates a new `Attr` node.
   */
  createAttrNode(): AttrInternal

  /**
   * Creates a new `Text` node.
   * 
   * @param data - node contents
   */
  createTextNode(data?: string): TextInternal

  /**
   * Creates a new `Text` node.
   * 
   * @param data - node contents
   */
  createCommentNode(data?: string): CommentInternal

  /**
   * Creates a new `CDATASection` node.
   * 
   * @param data - node contents
   */
  createCDATASection(data?: string): CDATASectionInternal

  /**
   * Creates a new `Comment` node.
   * 
   * @param data - node contents
   */
  createComment(data?: string): CommentInternal

  /**
   * Creates a new `ProcessingInstruction` node.
   * 
   * @param target - instruction target
   * @param data - node contents
   */
  createProcessingInstruction(target: string, data?: string):
    ProcessingInstructionInternal

  /**
   * Creates a new `HTMLCollection`.
   * 
   * @param root - root node
   * @param filter - node filter
   */
  createHTMLCollection(root: NodeInternal,
    filter: ((element: ElementInternal) => any)): HTMLCollectionInternal

  /**
   * Creates a new live `NodeList`.
   * 
   * @param root - root node
   */
  createNodeList(root: NodeInternal): NodeListInternal

  /**
   * Creates a new `NamedNodeMap`.
   * 
   * @param element - parent element
   */
  createNamedNodeMap(element: ElementInternal): NamedNodeMapInternal

  /**
   * Creates a new static `NodeList`.
   * 
   * @param root - root node
   * @param items - a list of items to initialize the list
   */
  createNodeListStatic(root: NodeInternal, items: NodeInternal[]): NodeListInternal

  /**
   * Creates a new `Range`.
   */
  createRange(): RangeInternal

  /**
   * Creates a new `NodeIterator`.
   * 
   * @param root - iterator's root node
   * @param reference - reference node
   * @param pointerBeforeReference - whether the iterator is before or after the
   * reference node 
   */
  createNodeIterator(root: NodeInternal, reference: NodeInternal, 
    pointerBeforeReference: boolean): NodeIteratorInternal


  /**
   * Creates a new `TreeWalker`.
   * 
   * @param root - iterator's root node
   * @param current - current node
   */
  createTreeWalker(root: NodeInternal, current: NodeInternal): TreeWalkerInternal

  /**
   * Creates a new `NodeFilter`.
   */
  createNodeFilter(): NodeFilterInternal

  /**
   * Determines whether `other` is an ancestor of `node`. An object A 
   * is called an ancestor of an object B if and only if B is a 
   * descendant of A.
   * 
   * @param node - a node
   * @param other - the node to check
   * @param self - if `true`, traversal includes `node` itself
   * @param shadow - if `true`, traversal includes the 
   * node's and its descendant's shadow trees as well.
   */
  isAncestorOf(node: NodeInternal, other: NodeInternal, self?: boolean,
    shadow?: boolean): boolean

  /**
   * Determines whether `other` is a descendant of `node`. An object 
   * A is called a descendant of an object B, if either A is a child 
   * of B or A is a child of an object C that is a descendant of B.
   * 
   * @param node - a node
   * @param other - the node to check
   * @param self - if `true`, traversal includes `node` itself
   * @param shadow - if `true`, traversal includes the 
   * node's and its descendant's shadow trees as well.
   */
  isDescendantOf(node: NodeInternal, other: NodeInternal, self?: boolean,
    shadow?: boolean): boolean

  /**
   * Traverses through all descendant nodes of the tree rooted at
   * `node` in depth-first pre-order.
   * 
   * @param node - root node of the tree
   * @param self - whether to include `node` in traversal
   * @param shadow - whether to visit shadow tree nodes
   * @param filter - a function to filter nodes
   */
  getDescendantNodes(node: NodeInternal, self?: boolean, shadow?: boolean,
    filter?: (childNode: NodeInternal) => any): IterableIterator<NodeInternal>

  /**
   * Traverses through all descendant element nodes of the tree rooted at
   * `node` in depth-first preorder.
   * 
   * @param node - root node of the tree
   * @param self - whether to include `node` in traversal
   * @param shadow - whether to visit shadow tree nodes
   * @param filter - a function to filter nodes
   */
  getDescendantElements(node: NodeInternal, self?: boolean, shadow?: boolean,
    filter?: (childNode: ElementInternal) => any): IterableIterator<ElementInternal>

  /**
   * Traverses through all sibling nodes of `node`.
   * 
   * @param node - root node of the tree
   * @param self - whether to include `node` in traversal
   * @param filter - a function to filter nodes
   */
  getSiblingNodes(node: NodeInternal, self?: boolean,
    filter?: (childNode: NodeInternal) => any): IterableIterator<NodeInternal>

  /**
   * Traverses through all ancestor nodes `node` in reverse tree order.
   * 
   * @param node - root node of the tree
   * @param self - whether to include `node` in traversal
   * @param filter - a function to filter nodes
   */
  getAncestorNodes(node: NodeInternal, self?: boolean,
    filter?: (ancestorNode: NodeInternal) => any): IterableIterator<NodeInternal>

  /**
   * Returns the node following `node` in depth-first preorder.
   * 
   * @param root - root of the subtree
   * @param node - a node
   */
  getFollowingNode(root: NodeInternal, node: NodeInternal): NodeInternal | null

  /**
   * Returns the node preceding `node` in depth-first preorder.
   * 
   * @param root - root of the subtree
   * @param node - a node
   */
  getPrecedingNode(root: NodeInternal, node: NodeInternal): NodeInternal | null

  /**
   * Determines if the node tree is constrained. A node tree is 
   * constrained as follows, expressed as a relationship between the 
   * type of node and its allowed children:
   *  - Document (In tree order)
   *    * Zero or more nodes each of which is ProcessingInstruction 
   *      or Comment.
   *    * Optionally one DocumentType node.
   *    * Zero or more nodes each of which is ProcessingInstruction
   *      or Comment.
   *    * Optionally one Element node.
   *    * Zero or more nodes each of which is ProcessingInstruction
   *      or Comment.
   *  - DocumentFragment, Element
   *    * Zero or more nodes each of which is Element, Text, 
   *      ProcessingInstruction, or Comment.
   *  - DocumentType, Text, ProcessingInstruction, Comment
   *    * None.
   * 
   * @param node - the root of the tree
   */
  isConstrained(node: NodeInternal): boolean

  /**
   * Returns the length of a node.
   * 
   * @param node - a node to check
   */
  nodeLength(node: NodeInternal): number

  /**
   * Determines if a node is empty.
   * 
   * @param node - a node to check
   */
  isEmpty(node: NodeInternal): boolean

  /**
   * Returns the root node of a tree. The root of an object is itself,
   * if its parent is `null`, or else it is the root of its parent. 
   * The root of a tree is any object participating in that tree 
   * whose parent is `null`.
   * 
   * @param node - a node of the tree
   * @param shadow - `true` to return shadow-including root, otherwise 
   * `false`
   */
  rootNode(node: NodeInternal, shadow?: boolean): NodeInternal

  /**
   * Determines whether `other` is a sibling of `node`. An object A is
   * called a sibling of an object B, if and only if B and A share 
   * the same non-null parent.
   * 
   * @param node - a node
   * @param other - the node to check
   * @param self - if `true`, traversal includes `node` itself
   */
  isSiblingOf(node: NodeInternal, other: NodeInternal,
    self?: boolean): boolean

  /**
   * Determines whether `other` is preceding `node`. An object A is 
   * preceding an object B if A and B are in the same tree and A comes 
   * before B in tree order.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isPreceding(node: NodeInternal, other: NodeInternal): boolean

  /**
   * Determines whether `other` is following `node`. An object A is 
   * following an object B if A and B are in the same tree and A comes 
   * after B in tree order.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isFollowing(node: NodeInternal, other: NodeInternal): boolean

  /**
   * Determines whether `other` is a child node of `node`.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isChildOf(node: NodeInternal, other: NodeInternal): boolean

  /**
   * Returns the first child node of `node` or null if it has no
   * children.
   * 
   * @param node 
   */
  firstChild(node: NodeInternal): NodeInternal | null

  /**
   * Returns the last child node of `node` or null if it has no
   * children.
   * 
   * @param node 
   */
  lastChild(node: NodeInternal): NodeInternal | null

  /**
   * Returns the zero-based index of `node` when counted preorder in
   * the tree rooted at `root`. Returns `-1` if `node` is not in 
   * the tree.
   * 
   * @param node - the node to get the index of
   */
  treePosition(node: NodeInternal): number

  /**
   * Determines the index of `node`. The index of an object is its number of 
   * preceding siblings, or 0 if it has none.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  index(node: NodeInternal): number

  /**
   * Retargets an object against another object.
   * 
   * @param a - an object to retarget
   * @param b - an object to retarget against
   */
  retarget(a: any, b: any): any

}

/**
 * Represents a window containing a DOM document.
 */
export interface WindowInternal extends Window, EventTargetInternal {
  _currentEvent?: Event
}

/**
 * Represents a DOM event.
 */
export interface EventInternal extends Event {
  _target: PotentialEventTarget
  _relatedTarget: PotentialEventTarget
  _touchTargetList: PotentialEventTarget[]
  _path: EventPathItem[]

  _stopPropagationFlag: boolean
  _stopImmediatePropagationFlag: boolean
  _canceledFlag: boolean
  _inPassiveListenerFlag: boolean
  _composedFlag: boolean
  _initializedFlag: boolean
  _dispatchFlag: boolean

  _isTrustedFlag: boolean

  _currentTarget: PotentialEventTarget
  _eventPhase: EventPhase

  _type: string
}

/**
 * Represents and event that carries custom data.
 */
export interface CustomEventInternal extends CustomEvent {
}

/**
 * Represents a target to which an event can be dispatched.
 */
export interface EventTargetInternal extends EventTarget {
  _eventListenerList: EventListenerEntry[]

  /**
   * Gets the parent event target for the given event.
   * 
   * @param event - an event
   */
  _getTheParent(event: Event): EventTarget | null

  /**
   * Defines optional activation behavior for the given event.
   * 
   * _Note:_ This exists because user agents perform certain actions for certain
   * EventTarget objects, e.g., the area element, in response to synthetic
   * MouseEvent events whose type attribute is click. Web compatibility
   * prevented it from being removed and it is now the enshrined way of
   * defining an activation of something.
   * 
   * @param event - an event
   */
  _activationBehavior?(event: Event): void

  /**
   * Defines optional legacy pre-activation behavior for the given event.
   *
   * _Note:_ These algorithms only exist for checkbox and radio input elements
   * and are not to be used for anything else.
   * 
   * @param event - an event
   */
  _legacyPreActivationBehavior?(event: Event): void
}

/**
 * Represents a controller that allows to abort DOM requests.
 */
export interface AbortControllerInternal extends AbortController {
  _signal: AbortSignal
}

/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */
export interface AbortSignalInternal extends AbortSignal {
  _abortedFlag: boolean
  _abortAlgorithms: Set<CallableFunction>
}

/**
 * Represents a collection of nodes.
 */
export interface CollectionInternal extends Collection {
  _live: boolean
  _root: Node
  _filter: ((element: ElementInternal) => any) | null
}

/**
 * Represents an ordered list of nodes.
 */
export interface NodeListInternal extends CollectionInternal, NodeList {
  /**
   * Used to keep track of child node count. This is a non-standard property.
   */
  _length: number
}

/**
 * Represents a collection of elements.
 */
export interface HTMLCollectionInternal extends CollectionInternal, HTMLCollection {

}

/**
 * Represents an object that is used to observe mutations to the node tree.
 */
export interface MutationObserverInternal extends MutationObserver {
  _callback: MutationCallback
  _nodeList: Node[]
  _recordQueue: MutationRecord[]
}

/**
 * Represents a mutation record.
 */
export interface MutationRecordInternal extends MutationRecord {

}

/**
 * Represents a generic XML node.
 */
export interface NodeInternal extends EventTargetInternal, Node {
  _nodeDocument: DocumentInternal
  _registeredObserverList: Array<RegisteredObserver | TransientRegisteredObserver>

  /**
   * Used to keep track of parent-child relations in the tree. This is a 
   * non-standard property.
   */
  _parentNode: Node | null
  _firstChild: Node | null
  _lastChild: Node | null
  _previousSibling: Node | null
  _nextSibling: Node | null
}

/**
 * Represents a document node.
 */
export interface DocumentInternal extends NodeInternal, Document {
  _encoding: { name: string, labels: string[] }
  _contentType: string
  _URL: string
  _origin: string
  _type: "xml" | "html"
  _mode: "no-quirks" | "quirks" | "limited-quirks"

  /**
   * Used to keep track of live ranges and clean up memory. This is a 
   * non-standard property.
   */
  _rangeList: Range[]
}

/**
 * Represents a XML document node.
 */
export interface XMLDocumentInternal extends NodeInternal, XMLDocument {

}

/**
 * Represents an object providing methods which are not dependent on 
 * any particular document.
 */
export interface DOMImplementationInternal extends DOMImplementation {

}

/**
 * Represents an object providing methods which are not dependent on 
 * any particular document
 */
export interface DocumentTypeInternal extends NodeInternal, DocumentType {
  _name: string
  _publicId: string
  _systemId: string
}

/**
 * Represents a document fragment in the XML tree.
 */
export interface DocumentFragmentInternal extends NodeInternal, DocumentFragment {
  _host: Element | null
}

/**
 * Represents a shadow root.
 */
export interface ShadowRootInternal extends DocumentFragmentInternal, ShadowRoot {
  _host: Element
  _mode: ShadowRootMode
}

/**
 * Represents an element node.
 */
export interface ElementInternal extends NodeInternal, Element {
  _namespace: string | null
  _namespacePrefix: string | null
  _localName: string
  _customElementState: "undefined" | "failed" | "uncustomized" | "custom"
  _customElementDefinition: any
  _is: string | null
  _shadowRoot: ShadowRoot | null

  readonly _qualifiedName: string
  readonly _htmlUppercasedQualifiedName: string

  _attributeList: NamedNodeMap

  _uniqueIdentifier?: string
}

/**
 * Represents a collection of nodes.
 */
export interface NamedNodeMapInternal extends NamedNodeMap {
  _element: Element
  _attributeList: Attr[]
}

/**
 * Represents an attribute of an element node.
 */
export interface AttrInternal extends NodeInternal, Attr {
  _namespace: string | null
  _namespacePrefix: string | null
  _localName: string
  _value: string
  _element: Element | null

  readonly _qualifiedName: string
}

/**
 * Represents a generic text node.
 */
export interface CharacterDataInternal extends NodeInternal, CharacterData {
  _data: string
}

/**
 * Represents a text node.
 */
export interface TextInternal extends CharacterDataInternal, Text {

}

/**
 * Represents a CDATA node.
 */
export interface CDATASectionInternal extends TextInternal, CDATASection {

}

/**
 * Represents a processing instruction node.
 */
export interface ProcessingInstructionInternal extends
  CharacterDataInternal, ProcessingInstruction {
  _target: string
}


/**
 * Represents a comment node.
 */
export interface CommentInternal extends CharacterDataInternal, Comment {

}

/**
 * Represents an abstract range with a start and end boundary point.
 */
export interface AbstractRangeInternal extends AbstractRange {
  _start: BoundaryPoint
  _end: BoundaryPoint

  readonly _startNode: Node
  readonly _startOffset: number
  readonly _endNode: Node
  readonly _endOffset: number

  readonly _collapsed: boolean
}

/**
 * Represents a static range.
 */
export interface StaticRangeInternal extends AbstractRangeInternal, StaticRange {

}

/**
 * Represents a live range.
 */
export interface RangeInternal extends AbstractRangeInternal, Range {
  readonly _root: Node
}

/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export interface TraverserInternal extends Traverser {
  _activeFlag: boolean
  _root: Node
  _whatToShow: WhatToShow
  _filter: NodeFilter | null
}

/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export interface NodeIteratorInternal extends TraverserInternal, NodeIterator {
  _iteratorCollection: Collection
  _reference: Node
  _pointerBeforeReference: boolean
}

/**
 * Represents the nodes of a subtree and a position within them.
 */
export interface TreeWalkerInternal extends TraverserInternal, TreeWalker {
  _current: Node
}

/**
 * Represents a node filter.
 */
export interface NodeFilterInternal extends NodeFilter {

}

/**
 * Represents a token set.
 */
export interface DOMTokenListInternal extends DOMTokenList {
  _tokenSet: Set<string>
  _element: Element
  _localName: string
}

/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */
export interface NonElementParentNodeInternal extends NonElementParentNode {

}

/**
 * Represents a mixin for an interface to be used to share APIs between
 * documents and shadow roots. This mixin is implemented by
 * {@link Document} and {@link ShadowRoot}.
 */
export interface DocumentOrShadowRootInternal extends DocumentOrShadowRoot {

}

/**
 * Represents a mixin that extends parent nodes that can have children.
 * This mixin is implemented by {@link Element}, {@link Document} and
 * {@link DocumentFragment}.
 */
export interface ParentNodeInternal extends ParentNode {

}

/**
 * Represents a mixin that extends child nodes that can have siblings
 * other than doctypes. This mixin is implemented by {@link Element} and
 * {@link CharacterData}.
 */
export interface NonDocumentTypeChildNodeInternal extends NonDocumentTypeChildNode {

}

/**
 * Represents a mixin that extends child nodes that can have siblings
 * including doctypes. This mixin is implemented by {@link Element},
 * {@link CharacterData} and {@link DocumentType}.
 */
export interface ChildNodeInternal extends ChildNode {

}

/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */
export interface SlotableInternal extends Slotable {
  _name: string
  _assignedSlot: HTMLSlotElement | null
}