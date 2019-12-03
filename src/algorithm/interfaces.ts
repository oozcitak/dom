import {
  Node, Document, Element, HTMLCollection, Attr, DOMImplementation, 
  DocumentType, DocumentFragment, Text, CDATASection, Comment, 
  ProcessingInstruction, NodeList, NamedNodeMap, Range, NodeIterator,
  TreeWalker, NodeFilter, Event, EventTarget, AbortSignal, Slotable, Slot,
  MutationRecord, CharacterData, XMLDocument, DOMTokenList, ShadowRoot,
  AbstractRange, AbortController, Window, AddEventListenerOptions,
  EventListenerOptions, EventListenerEntry, PotentialEventTarget, EventPathItem,
  BoundaryPoint, BoundaryPosition, FilterResult, CustomElementDefinition,
  EventHandler
} from "../dom/interfaces"
import { EventImpl } from "../dom/EventImpl"
import { ObjectCache } from "@oozcitak/util"
import { Interfaces as URLInterfaces } from "@oozcitak/url"

/**
 * Contains DOM manipulation algorithms as described in the 
 * [DOM Living Standard](https://dom.spec.whatwg.org).
 */
export interface DOMAlgorithm {

  /**
   * Contains tree manipulation algorithms.
   */
  readonly tree: TreeAlgorithm

  /**
   * Contains ordered set manipulation algorithms.
   */
  readonly orderedSet: OrderedSetAlgorithm

  /**
   * Contains namespace algorithms.
   */
  readonly namespace: NamespaceAlgorithm

  /**
   * Contains selectors algorithms.
   */
  readonly selectors: SelectorsAlgorithm

  /**
   * Contains event algorithms.
   */
  readonly event: EventAlgorithm

  /**
   * Contains event target algorithms.
   */
  readonly eventTarget: EventTargetAlgorithm

  /**
   * Contains abort algorithms.
   */
  readonly abort: AbortAlgorithm

  /**
   * Contains shadow tree algorithms.
   */
  readonly shadowTree: ShadowTreeAlgorithm

  /**
   * Contains mutation algorithms.
   */
  readonly mutation: MutationAlgorithm

  /**
   * Contains parent node algorithms.
   */
  readonly parentNode: ParentNodeAlgorithm

  /**
   * Contains algorithms for creating DOM objects.
   */
  readonly create: CreateAlgorithm

  /**
   * Contains mutation observer algorithms.
   */
  readonly observer: MutationObserverAlgorithm

  /**
   * Contains algorithms for manipulating attribute nodes.
   */
  readonly attr: AttrAlgorithm

  /**
   * Contains algorithms for manipulating element nodes.
   */
  readonly element: ElementAlgorithm

  /**
   * Contains algorithms for manipulating character data nodes.
   */
  readonly characterData: CharacterDataAlgorithm

  /**
   * Contains algorithms for manipulating text nodes.
   */
  readonly text: TextAlgorithm

  /**
   * Contains algorithms for manipulating nodes.
   */
  readonly node: NodeAlgorithm

  /**
   * Contains algorithms for manipulating nodes.
   */
  readonly document: DocumentAlgorithm

  /**
   * Contains algorithms for boundary points.
   */
  readonly boundaryPoint: BoundaryPointAlgorithm

  /**
   * Contains algorithms for ranges.
   */
  readonly range: RangeAlgorithm

  /**
   * Contains algorithms for tree traversal.
   */
  readonly traversal: TraversalAlgorithm

  /**
   * Contains algorithms for node iterators.
   */
  readonly nodeIterator: NodeIteratorAlgorithm

  /**
   * Contains algorithms for tree walkers.
   */
  readonly treeWalker: TreeWalkerAlgorithm

  /**
   * Contains DOM token list algorithms.
   */
  readonly tokenList: DOMTokenListAlgorithm

  /**
   * Contains custom element algorithms.
   */
  readonly customElement: CustomElementAlgorithm

  /**
   * Contains XML algorithms.
   */
  readonly xml: XMLAlgorithm

  /**
   * Runs removing steps for node.
   * 
   * @param removedNode - removed node
   * @param oldParent - old parent node
   */
  runRemovingSteps(removedNode: Node,
    oldParent?: Node | null): void

  /**
   * Runs cloning steps for node.
   * 
   * @param copy - node clone
   * @param node - node
   * @param document - document to own the cloned node
   * @param cloneChildrenFlag - whether child nodes are cloned
   */
  runCloningSteps(copy: Node, node: Node,
    document: Document, cloneChildrenFlag?: boolean): void

  /**
   * Runs adopting steps for node.
   * 
   * @param node - node
   * @param oldDocument - old document
   */
  runAdoptingSteps(node: Node, oldDocument: Document): void

  /**
   * Runs child text content change steps for a parent node.
   * 
   * @param parent - parent node with text node child nodes
   */
  runChildTextContentChangeSteps(parent: Node): void

  /**
   * Runs attribute change steps for an element node.
   * 
   * @param element - element node owning the attribute
   * @param localName - attribute's local name
   * @param oldValue - attribute's old value
   * @param value - attribute's new value
   * @param namespace - attribute's namespace
   */
  runAttributeChangeSteps(element: Element,
    localName: string, oldValue: string | null, value: string | null,
    namespace: string | null): void

  /**
   * Runs insertion steps for a node.
   * 
   * @param insertedNode - inserted node
   */
  runInsertionSteps(insertedNode: Node): void

  /**
   * Runs event construction steps.
   * 
   * @param event - an event
   */
  runEventConstructingSteps(event: Event): void

  /**
   * Runs pre-removing steps for a node iterator and node.
   * 
   * @param nodeIterator - a node iterator
   * @param toBeRemoved - node to be removed
   */
  runNodeIteratorPreRemovingSteps(nodeIterator: NodeIterator,
    toBeRemoved: Node): void

  /**
   * Determines if there are any supported tokens defined for the given 
   * attribute name.
   * 
   * @param attributeName - an attribute name
   */
  hasSupportedTokens(attributeName: string): boolean

  /**
   * Returns the set of supported tokens defined for the given attribute name.
   * 
   * @param attributeName - an attribute name
   */
  getSupportedTokens(attributeName: string): Set<string>
}

/**
 * Represents sub algorithms.
 */
export interface SubAlgorithm {
  /**
   * Contains DOM manipulation algorithms.
   */
  readonly dom: DOMAlgorithm
}

/**
 * Contains tree manipulation algorithms.
 */
export interface TreeAlgorithm extends SubAlgorithm {

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
  isAncestorOf(node: Node, other: Node, self?: boolean,
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
  isDescendantOf(node: Node, other: Node, self?: boolean,
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
  getDescendantNodes(node: Node, self?: boolean, shadow?: boolean,
    filter?: (childNode: Node) => boolean): Iterable<Node>

  /**
   * Traverses through all descendant element nodes of the tree rooted at
   * `node` in depth-first preorder.
   * 
   * @param node - root node of the tree
   * @param self - whether to include `node` in traversal
   * @param shadow - whether to visit shadow tree nodes
   * @param filter - a function to filter nodes
   */
  getDescendantElements(node: Node, self?: boolean, shadow?: boolean,
    filter?: (childNode: Element) => boolean): Iterable<Element>

  /**
   * Traverses through all sibling nodes of `node`.
   * 
   * @param node - root node of the tree
   * @param self - whether to include `node` in traversal
   * @param filter - a function to filter nodes
   */
  getSiblingNodes(node: Node, self?: boolean,
    filter?: (childNode: Node) => boolean): Iterable<Node>

  /**
   * Traverses through all ancestor nodes `node` in reverse tree order.
   * 
   * @param node - root node of the tree
   * @param self - whether to include `node` in traversal
   * @param filter - a function to filter nodes
   */
  getAncestorNodes(node: Node, self?: boolean,
    filter?: (ancestorNode: Node) => boolean): Iterable<Node>

  /**
   * Returns the common ancestor of the given nodes.
   * 
   * @param nodeA - a node
   * @param nodeB - a node
   */
  getCommonAncestor(nodeA: Node, nodeB: Node): Node | null

  /**
   * Returns the node following `node` in depth-first preorder.
   * 
   * @param root - root of the subtree
   * @param node - a node
   */
  getFollowingNode(root: Node, node: Node): Node | null

  /**
   * Returns the node preceding `node` in depth-first preorder.
   * 
   * @param root - root of the subtree
   * @param node - a node
   */
  getPrecedingNode(root: Node, node: Node): Node | null

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
  isConstrained(node: Node): boolean

  /**
   * Returns the length of a node.
   * 
   * @param node - a node to check
   */
  nodeLength(node: Node): number

  /**
   * Determines if a node is empty.
   * 
   * @param node - a node to check
   */
  isEmpty(node: Node): boolean

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
  rootNode(node: Node, shadow?: boolean): Node

  /**
   * Determines whether `other` is a sibling of `node`. An object A is
   * called a sibling of an object B, if and only if B and A share 
   * the same non-null parent.
   * 
   * @param node - a node
   * @param other - the node to check
   * @param self - if `true`, traversal includes `node` itself
   */
  isSiblingOf(node: Node, other: Node,
    self?: boolean): boolean

  /**
   * Determines whether `other` is preceding `node`. An object A is 
   * preceding an object B if A and B are in the same tree and A comes 
   * before B in tree order.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isPreceding(node: Node, other: Node): boolean

  /**
   * Determines whether `other` is following `node`. An object A is 
   * following an object B if A and B are in the same tree and A comes 
   * after B in tree order.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isFollowing(node: Node, other: Node): boolean

  /**
   * Determines whether `other` is the parent node of `node`.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isParentOf(node: Node, other: Node): boolean

  /**
   * Determines whether `other` is a child node of `node`.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isChildOf(node: Node, other: Node): boolean

  /**
   * Returns the first child node of `node` or null if it has no
   * children.
   * 
   * @param node 
   */
  firstChild(node: Node): Node | null

  /**
   * Returns the last child node of `node` or null if it has no
   * children.
   * 
   * @param node 
   */
  lastChild(node: Node): Node | null

  /**
   * Returns the previous sibling node of `node` or null if it has no
   * preceding sibling.
   * 
   * @param node 
   */
  previousSibling(node: Node): Node | null

  /**
   * Returns the next sibling node of `node` or null if it has no
   * following sibling.
   * 
   * @param node 
   */
  nextSibling(node: Node): Node | null

  /**
   * Returns the zero-based index of `node` when counted preorder in
   * the tree rooted at `root`. Returns `-1` if `node` is not in 
   * the tree.
   * 
   * @param node - the node to get the index of
   */
  treePosition(node: Node): number

  /**
   * Determines the index of `node`. The index of an object is its number of 
   * preceding siblings, or 0 if it has none.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  index(node: Node): number

  /**
   * Retargets an object against another object.
   * 
   * @param a - an object to retarget
   * @param b - an object to retarget against
   */
  retarget(a: any, b: any): any

}

/**
 * Contains ordered set manipulation algorithms.
 */
export interface OrderedSetAlgorithm extends SubAlgorithm {

  /**
   * Converts a whitespace separated string into an array of tokens.
   * 
   * @param value - a string of whitespace separated tokens
   */
  parse(value: string): Set<string>

  /**
   * Converts an array of tokens into a space separated string.
   * 
   * @param tokens - an array of token strings
   */
  serialize(tokens: Set<string>): string

  /**
   * Removes duplicate tokens and convert all whitespace characters
   * to space.
   * 
   * @param value - a string of whitespace separated tokens
   */
  sanitize(value: string): string
  /**
   * Determines whether a set contains the other.
   * 
   * @param set1 - a set
   * @param set1 - a set that is contained in set1
   * @param caseSensitive - whether matches are case-sensitive
   */
  contains(set1: Set<string>, set2: Set<string>,
    caseSensitive?: boolean): boolean

}

/**
 * Contains namespace algorithms.
 */
export interface NamespaceAlgorithm extends SubAlgorithm {

  /**
   * Validates the given qualified name.
   * 
   * @param qualifiedName - qualified name
   */
  validate(qualifiedName: string): void

  /**
   * Validates and extracts a namespace, prefix and localName from the
   * given namespace and qualified name.
   * See: https://dom.spec.whatwg.org/#validate-and-extract.
   * 
   * @param namespace - namespace
   * @param qualifiedName - qualified name
   * 
   * @returns a tuple with `namespace`, `prefix` and `localName`.
   */
  validateAndExtract(namespace: string | null, qualifiedName: string):
    [string | null, string | null, string]

  /**
   * Extracts a prefix and localName from the given qualified name.
   * 
   * @param qualifiedName - qualified name
   * 
   * @returns an tuple with `prefix` and `localName`.
   */
  extractQName(qualifiedName: string): [string | null, string]

}

/**
 * Contains selectors algorithms.
 */
export interface SelectorsAlgorithm extends SubAlgorithm {

  /**
   * Matches elements with the given selectors.
   * 
   * @param selectors - selectors
   * @param node - the node to match against
   */
  scopeMatchASelectorsString(selectors: string, node: Node):
    Element[]

}

/**
 * Contains event algorithms.
 */
export interface EventAlgorithm extends SubAlgorithm {

  /**
   * Sets the canceled flag of an event.
   * 
   * @param event - an event
   */
  setTheCanceledFlag(event: Event): void

  /**
   * Initializes the value of an event.
   * 
   * @param event - an event to initialize
   * @param type - the type of event
   * @param bubbles - whether the event propagates in reverse
   * @param cancelable - whether the event can be cancelled
   */
  initialize(event: Event, type: string, bubbles: boolean,
    cancelable: boolean): void

  /**
   * Creates a new event.
   * 
   * @param eventInterface - event interface
   * @param realm - realm
   */
  createAnEvent(eventInterface: typeof EventImpl, realm?: any): Event

  /**
   * Performs event creation steps.
   * 
   * @param eventInterface - event interface
   * @param realm - realm
   * @param time - time of occurrance
   * @param dictionary - event attributes
   * 
   */
  innerEventCreationSteps(eventInterface: typeof EventImpl, realm: any,
    time: Date, dictionary: { [key: string]: any }): Event

  /**
   * Dispatches an event to an event target.
   * 
   * @param event - the event to dispatch
   * @param target - event target
   * @param legacyTargetOverrideFlag - legacy target override flag
   * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
   * whether the event listener's callback threw an exception
   */
  dispatch(event: Event, target: EventTarget,
    legacyTargetOverrideFlag?: boolean,
    legacyOutputDidListenersThrowFlag?: OutputFlag): boolean

  /**
   * Appends a new struct to an event's path.
   * 
   * @param event - an event
   * @param invocationTarget - the target of the invocation 
   * @param shadowAdjustedTarget - shadow-root adjusted event target
   * @param relatedTarget - related event target
   * @param touchTargets - a list of touch targets
   * @param slotInClosedTree - if the target's parent is a closed shadow root
   */
  appendToAnEventPath(event: Event,
    invocationTarget: EventTarget, shadowAdjustedTarget: PotentialEventTarget,
    relatedTarget: PotentialEventTarget, touchTargets: PotentialEventTarget[],
    slotInClosedTree: boolean): void

  /**
   * Invokes an event.
   * 
   * @param struct - a struct defining event's path
   * @param event - the event to invoke
   * @param phase - event phase
   * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
   * whether the event listener's callback threw an exception
   */
  invoke(struct: EventPathItem, event: Event,
    phase: "capturing" | "bubbling",
    legacyOutputDidListenersThrowFlag?: OutputFlag): void

  /**
   * Invokes an event.
   * 
   * @param event - the event to invoke
   * @param listeners - event listeners
   * @param phase - event phase
   * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
   * whether the event listener's callback threw an exception
   */
  innerInvoke(event: Event,
    listeners: EventListenerEntry[], phase: "capturing" | "bubbling",
    struct: EventPathItem, legacyOutputDidListenersThrowFlag?: OutputFlag): boolean

  /**
   * Fires an event at target.
   * @param e - event name
   * @param target - event target
   * @param eventConstructor - an event constructor, with a description of how
   * IDL attributes are to be initialized
   * @param idlAttributes - a dictionary describing how IDL attributes are 
   * to be initialized
   * @param legacyTargetOverrideFlag - legacy target override flag
   */
  fireAnEvent(e: string, target: EventTarget, 
    eventConstructor?: typeof EventImpl, idlAttributes?: { [key:string]: any },
    legacyTargetOverrideFlag?: boolean): boolean

  /**
   * Creates an event.
   * 
   * @param eventInterface - the name of the event interface
   */
  createLegacyEvent(eventInterface: string): Event

  /**
   * Getter of an event handler IDL attribute.
   * 
   * @param eventTarget - event target
   * @param name - event name
   */
  getterEventHandlerIDLAttribute(thisObj: EventTarget,
    name: string): EventHandler

  /**
   * Setter of an event handler IDL attribute.
   * 
   * @param eventTarget - event target
   * @param name - event name
   * @param value - event handler
   */
  setterEventHandlerIDLAttribute(thisObj: EventTarget,
    name: string, value: EventHandler): void

  /**
   * Determines the target of an event handler.
   * 
   * @param eventTarget - event target
   * @param name - event name
   */
  determineTheTargetOfAnEventHandler(eventTarget: EventTarget,
    name: string): EventTarget | null

  /**
   * Gets the current value of an event handler.
   * 
   * @param eventTarget - event target
   * @param name - event name
   */
  getTheCurrentValueOfAnEventHandler(eventTarget: EventTarget,
    name: string): EventHandler

  /**
   * Activates an event handler.
   * 
   * @param eventTarget - event target
   * @param name - event name
   */
  activateAnEventHandler(eventTarget: EventTarget,
    name: string): void

  /**
   * Deactivates an event handler.
   * 
   * @param eventTarget - event target
   * @param name - event name
   */
  deactivateAnEventHandler(eventTarget: EventTarget,
    name: string): void
}

/**
 * Contains event target algorithms.
 */
export interface EventTargetAlgorithm extends SubAlgorithm {

  /**
   * Flattens the given options argument.
   * 
   * @param options - options argument
   */
  flatten(options: EventListenerOptions | boolean): boolean

  /**
   * Flattens the given options argument.
   * 
   * @param options - options argument
   */
  flattenMore(options: AddEventListenerOptions | boolean):
    [boolean, boolean, boolean]

  /**
   * Adds a new event listener.
   * 
   * @param eventTarget - event target
   * @param listener - event listener
   */
  addEventListener(eventTarget: EventTarget,
    listener: EventListenerEntry): void

  /**
   * Removes an event listener.
   * 
   * @param eventTarget - event target
   * @param listener - event listener
   */
  removeEventListener(eventTarget: EventTarget,
    listener: EventListenerEntry, index?: number): void

  /**
   * Removes all event listeners.
   * 
   * @param eventTarget - event target
   */
  removeAllEventListeners(eventTarget: EventTarget): void

}

/**
 * Contains abort algorithms.
 */
export interface AbortAlgorithm extends SubAlgorithm {

  /**
   * Adds an algorithm to the given abort signal.
   * 
   * @param algorithm - an algorithm
   * @param signal - abort signal
   */
  add(algorithm: ((...args: any[]) => any), signal: AbortSignal): void

  /**
   * Removes an algorithm from the given abort signal.
   * 
   * @param algorithm - an algorithm
   * @param signal - abort signal
   */
  remove(algorithm: ((...args: any[]) => any), signal: AbortSignal): void

  /**
   * Signals abort on the given abort signal.
   * 
   * @param signal - abort signal
   */
  signalAbort(signal: AbortSignal): void

}

/**
 * Contains shadow tree algorithms.
 */
export interface ShadowTreeAlgorithm extends SubAlgorithm {

  /**
   * Determines whether a the shadow tree of the given element node is
   * connected to a document node.
   * 
   * @param element - an element node of the shadow tree
   */
  isConnected(element: Element): boolean

  /**
   * Determines whether a slotable is assigned.
   * 
   * @param slotable - a slotable
   */
  isAssigned(slotable: Slotable): boolean

  /**
   * Finds a slot for the given slotable.
   * 
   * @param slotable - a slotable
   * @param openFlag - `true` to search open shadow tree's only
   */
  findASlot(slotable: Slotable, openFlag?: boolean): Slot | null

  /**
   * Finds slotables for the given slot.
   * 
   * @param slot - a slot
   */
  findSlotables(slot: Slot): Slotable[]

  /**
   * Finds slotables for the given slot.
   * 
   * @param slot - a slot
   */
  findFlattenedSlotables(slot: Slot): Slotable[]

  /**
   * Assigns slotables to the given slot.
   * 
   * @param slot - a slot
   */
  assignSlotables(slot: Slot): void

  /**
   * Assigns slotables to all nodes of a tree.
   * 
   * @param root - root node
   */
  assignSlotablesForATree(root: Node): void

  /**
   * Assigns a slot to a slotables.
   * 
   * @param slotable - a slotable
   */
  assignASlot(slotable: Slotable): void

  /**
   * Signals a slot change to the given slot.
   * 
   * @param slot - a slot
   */
  signalASlotChange(slot: Slot): void
}

/**
 * Contains tree mutation algorithms.
 */
export interface MutationAlgorithm extends SubAlgorithm {

  /**
   * Ensures pre-insertion validity of a node into a parent before a
   * child.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   * @param child - child node to insert node before
   */
  ensurePreInsertionValidity(node: Node, parent: Node,
    child: Node | null): void

  /**
   * Ensures pre-insertion validity of a node into a parent before a
   * child, then adopts the node to the tree and inserts it.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   * @param child - child node to insert node before
   */
  preInsert(node: Node, parent: Node,
    child: Node | null): Node

  /**
   * Inserts a node into a parent node before the given child node.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   * @param child - child node to insert node before
   * @param suppressObservers - whether to notify observers
   */
  insert(node: Node, parent: Node,
    child: Node | null, suppressObservers?: boolean): void

  /**
   * Appends a node to the children of a parent node.
   * 
   * @param node - a node
   * @param parent - the parent to receive node
   */
  append(node: Node, parent: Node): Node

  /**
   * Replaces a node with another node.
   * 
   * @param child - child node to remove
   * @param node - node to insert
   * @param parent - parent node to receive node
   */
  replace(child: Node, node: Node,
    parent: Node): Node

  /**
   * Replaces all nodes of a parent with the given node.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   */
  replaceAll(node: Node | null, parent: Node): void

  /**
   * Ensures pre-removal validity of a child node from a parent, then
   * removes it.
   * 
   * @param child - child node to remove
   * @param parent - parent node
   */
  preRemove(child: Node, parent: Node): Node

  /**
   * Removes a child node from its parent.
   * 
   * @param node - node to remove
   * @param parent - parent node
   * @param suppressObservers - whether to notify observers
   */
  remove(node: Node, parent: Node, suppressObservers?: boolean): void

}

/**
 * Contains parent node algorithms.
 */
export interface ParentNodeAlgorithm extends SubAlgorithm {

  /**
   * Converts the given nodes or strings into a node (if `nodes` has
   * only one element) or a document fragment.
   * 
   * @param nodes - the array of nodes or strings,
   * @param document - owner document
   */
  convertNodesIntoANode(nodes: (Node | string)[],
    document: Document): Node

}

/**
 * Contains mutation observer algorithms.
 */
export interface MutationObserverAlgorithm extends SubAlgorithm {

  /**
   * Queues a mutation observer microtask to the surrounding agent’s mutation
   * observers.
   */
  queueAMutationObserverMicrotask(): void

  /**
   * Notifies the surrounding agent’s mutation observers.
   */
  notifyMutationObservers(): void

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
  queueMutationRecord(type: string, target: Node, name: string | null,
    namespace: string | null, oldValue: string | null,
    addedNodes: Node[], removedNodes: Node[],
    previousSibling: Node | null, nextSibling: Node | null): void

  /**
   * Queues a tree mutation record for target.
   * 
   * @param target - target node
   * @param addedNodes - a list od added nodes
   * @param removedNodes - a list of removed nodes
   * @param previousSibling - previous sibling of target before mutation
   * @param nextSibling - next sibling of target before mutation
   */
  queueTreeMutationRecord(target: Node,
    addedNodes: Node[], removedNodes: Node[],
    previousSibling: Node | null, nextSibling: Node | null): void

  /**
   * Queues an attribute mutation record for target.
   * 
   * @param target - target node
   * @param name - name before mutation
   * @param namespace - namespace before mutation
   * @param oldValue - attribute value before mutation
   */
  queueAttributeMutationRecord(target: Node, name: string | null,
    namespace: string | null, oldValue: string | null): void

}


/**
 * Contains algorithms for manipulating attribute nodes.
 */
export interface AttrAlgorithm extends SubAlgorithm {

  /**
   * Changes the value of an existing attribute.
   * 
   * @param attribute - an attribute node
   * @param value - attribute value
   */
  setAnExistingAttributeValue(attribute: Attr, value: string): void

}

/**
 * Contains algorithms for manipulating element nodes.
 */
export interface ElementAlgorithm extends SubAlgorithm {

  /**
   * Determines whether the element's attribute list contains the given 
   * attribute.
   * 
   * @param attribute - an attribute node
   * @param element - an element node
   */
  has(attribute: Attr, element: Element): boolean

  /**
   * Changes the value of an attribute node.
   * 
   * @param attribute - an attribute node
   * @param element - an element node
   * @param value - attribute value
   */
  change(attribute: Attr, element: Element, value: string): void

  /**
   * Appends an attribute to an element node.
   * 
   * @param attribute - an attribute
   * @param element - an element to receive the attribute
   */
  append(attribute: Attr, element: Element): void

  /**
   * Removes an attribute from an element node.
   * 
   * @param attribute - an attribute
   * @param element - an element to receive the attribute
   */
  remove(attribute: Attr, element: Element): void

  /**
   * Replaces an attribute with another of an element node.
   * 
   * @param oldAttr - old attribute
   * @param newAttr - new attribute
   * @param element - an element to receive the attribute
   */
  replace(oldAttr: Attr, newAttr: Attr,
    element: Element): void

  /**
   * Retrieves an attribute with the given name from an element node.
   * 
   * @param qualifiedName - an attribute name
   * @param element - an element to receive the attribute
   */
  getAnAttributeByName(qualifiedName: string, element: Element):
    Attr | null

  /**
   * Retrieves an attribute with the given namespace and local name from an
   * element node.
   * 
   * @param namespace - an attribute namespace
   * @param localName - an attribute local name
   * @param element - an element to receive the attribute
   */
  getAnAttributeByNamespaceAndLocalName(namespace: string, localName: string,
    element: Element): Attr | null

  /**
   * Retrieves an attribute's value with the given name namespace and local
   * name from an element node.
   * 
   * @param element - an element to receive the attribute
   * @param localName - an attribute local name
   * @param namespace - an attribute namespace
   */
  getAnAttributeValue(element: Element, localName: string,
    namespace?: string): string

  /**
   * Sets an attribute of an element node.
   * 
   * @param attr - an attribute
   * @param element - an element to receive the attribute
   */
  setAnAttribute(attr: Attr, element: Element): Attr | null

  /**
   * Sets an attribute's value of an element node.
   * 
   * @param element - an element to receive the attribute
   * @param localName - an attribute local name
   * @param value - an attribute value
   * @param prefix - an attribute prefix
   * @param namespace - an attribute namespace
   */
  setAnAttributeValue(element: Element, localName: string,
    value: string, prefix?: string | null, namespace?: string | null): void

  /**
   * Removes an attribute with the given name from an element node.
   * 
   * @param qualifiedName - an attribute name
   * @param element - an element to receive the attribute
   */
  removeAnAttributeByName(qualifiedName: string, element: Element):
    Attr | null

  /**
   * Removes an attribute with the given namespace and local name from an
   * element node.
   * 
   * @param namespace - an attribute namespace
   * @param localName - an attribute local name
   * @param element - an element to receive the attribute
   */
  removeAnAttributeByNamespaceAndLocalName(namespace: string, localName: string,
    element: Element): Attr | null

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
  createAnElement(document: Document, localName: string,
    namespace: string | null, prefix?: string | null, is?: string | null,
    synchronousCustomElementsFlag?: boolean): Element

  /**
   * Inserts a new node adjacent to this element.
   * 
   * @param element - a reference element
   * @param where - a string defining where to insert the element node.
   *   - `beforebegin` before this element itself.
   *   - `afterbegin` before the first child.
   *   - `beforeend` after the last child.
   *   - `afterend` after this element itself.
   * @param node - node to insert
   */
  insertAdjacent(element: Element,
    where: "beforebegin" | "afterbegin" | "beforeend" | "afterend",
    node: Node): Node | null
}

/**
 * Contains algorithms for manipulating character data nodes.
 */
export interface CharacterDataAlgorithm extends SubAlgorithm {

  /**
   * Replaces character data.
   * 
   * @param node - a character data node
   * @param offset - start offset
   * @param count - count of characters to replace
   * @param data - new data
   */
  replaceData(node: CharacterData, offset: number, count: number,
    data: string): void

  /**
   * Returns `count` number of characters from `node`'s data starting at
   * the given `offset`.
   * 
   * @param node - a character data node
   * @param offset - start offset
   * @param count - count of characters to return
   */
  substringData(node: CharacterData, offset: number, count: number): string

}

/**
 * Contains algorithms for manipulating text nodes.
 */
export interface TextAlgorithm extends SubAlgorithm {

  /**
   * Returns node with its adjacent text and cdata node siblings.
   * 
   * @param node - a node
   * @param self - whether to include node itself
   */
  contiguousTextNodes(node: Text, self?: boolean):
    IterableIterator<Text>

  /**
   * Returns node with its adjacent text node siblings.
   * 
   * @param node - a node
   * @param self - whether to include node itself
   */
  contiguousExclusiveTextNodes(node: Text, self?: boolean):
    IterableIterator<Text>

  /**
   * Returns the concatenation of the data of all the Text node descendants of
   * node, in tree order.
   * 
   * @param node - a node
   */
  descendantTextContent(node: Node): string

  /**
   * Splits data at the given offset and returns the remainder as a text
   * node.
   * 
   * @param node - a text node
   * @param offset - the offset at which to split the nodes.
   */
  split(node: Text, offset: number): Text
}

/**
 * Contains algorithms for manipulating nodes.
 */
export interface NodeAlgorithm extends SubAlgorithm {

  /**
   * Replaces the contents of the given node with a single text node.
   * 
   * @param string - node contents
   * @param parent - a node
   */
  stringReplaceAll(str: string, parent: Node): void

  /**
   * Clones a node.
   * 
   * @param node - a node to clone
   * @param document - the document to own the cloned node
   * @param cloneChildrenFlag - whether to clone node's children
   */
  clone(node: Node, document?: Document | null,
    cloneChildrenFlag?: boolean): Node

  /**
   * Determines if two nodes can be considered equal.
   * 
   * @param a - node to compare
   * @param b - node to compare
   */
  equals(a: Node, b: Node): boolean

  /**
   * Searches for a namespace prefix associated with the given namespace 
   * starting from the given element through its ancestors.
   * 
   * @param element - an element node to start searching at
   * @param namespace - namespace to search for
   */
  locateANamespacePrefix(element: Element,
    namespace: string | null): string | null

  /**
   * Searches for a namespace associated with the given namespace prefix
   * starting from the given node through its ancestors.
   * 
   * @param node - a node to start searching at
   * @param prefix - namespace prefix to search for
   */
  locateANamespace(node: Node, prefix: string | null): string | null

  /**
   * Returns a collection of elements with the given qualified name which are
   * descendants of the given root node.
   * See: https://dom.spec.whatwg.org/#concept-getelementsbytagname
   * 
   * @param qualifiedName - qualified name
   * @param root - root node
   */
  listOfElementsWithQualifiedName(qualifiedName: string, root: Node):
    HTMLCollection

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
    root: Node): HTMLCollection

  /**
   * Returns a collection of elements with the given class names which are
   * descendants of the given root node.
   * See: https://dom.spec.whatwg.org/#concept-getelementsbyclassname
   * 
   * @param namespace - element namespace
   * @param localName - local name
   * @param root - root node
   */
  listOfElementsWithClassNames(classNames: string, root: Node):
    HTMLCollection

}

/**
 * Contains algorithms for manipulating document nodes.
 */
export interface DocumentAlgorithm extends SubAlgorithm {

  /**
   * Returns an element interface for the given name and namespace.
   * 
   * @param name - element name
   * @param namespace - namespace
   */
  elementInterface(name: string, namespace: string | null):
    (new (...args: any[]) => Element)

  /**
   * Creates a new element node.
   * See: https://dom.spec.whatwg.org/#internal-createelementns-steps
   * 
   * @param document - owner document
   * @param namespace - element namespace
   * @param qualifiedName - qualified name
   * @param options - element options
   */
  internalCreateElementNS(document: Document, namespace: string | null,
    qualifiedName: string, options?: string | { is: string }): Element

  /**
   * Removes `node` and its subtree from its document and changes
   * its owner document to `document` so that it can be inserted
   * into `document`.
   * 
   * @param node - the node to move
   * @param document - document to receive the node and its subtree
   */
  adopt(node: Node, document: Document): void

}

/**
 * Contains algorithms for creating DOM objects.
 */
export interface CreateAlgorithm extends SubAlgorithm {

  /** 
   * Creates a `DOMImplementation`.
   * 
   * @param document - associated document
   */
  domImplementation(document: Document): DOMImplementation

  /** 
   * Creates a `Window` node.
   */
  window(): Window
  
  /** 
   * Creates a `Document` node.
   */
  document(): Document

  /** 
   * Creates an `XMLDocument` node.
   */
  xmlDocument(): XMLDocument

  /** 
   * Creates an `AbortController`.
   */
  abortController(): AbortController

  /** 
   * Creates an `AbortSignal`.
   */
  abortSignal(): AbortSignal

  /** 
   * Creates a `DocumentType` node.
   * 
   * @param document - owner document
   * @param name - name of the node
   * @param publicId - `PUBLIC` identifier
   * @param systemId - `SYSTEM` identifier
   */
  documentType(document: Document, name: string, publicId?: string,
    systemId?: string): DocumentType

  /**
   * Creates a new `Element` node.
   * 
   * @param document - owner document
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  element(document: Document, localName: string, namespace: string | null,
    prefix: string | null): Element

  /**
   * Creates a new `HTMLElement` node.
   * 
   * @param document - owner document
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  htmlElement(document: Document, localName: string, namespace: string | null,
    prefix: string | null): Element

  /**
   * Creates a new `HTMLUnknownElement` node.
   * 
   * @param document - owner document
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  htmlUnknownElement(document: Document, localName: string, namespace: string | null,
    prefix: string | null): Element

  /**
   * Creates a new `DocumentFragment` node.
   * 
   * @param document - owner document
   */
  documentFragment(document: Document): DocumentFragment

  /**
   * Creates a new `ShadowRoot` node.
   * 
   * @param document - owner document
   * @param host - shadow root's host element node
   */
  shadowRoot(document: Document, host: Element): ShadowRoot

  /**
   * Creates a new `Attr` node.
   * 
   * @param document - owner document
   * @param localName - local name
   */
  attr(document: Document, localName: string): Attr

  /**
   * Creates a new `Text` node.
   * 
   * @param document - owner document
   * @param data - node contents
   */
  text(document: Document, data?: string): Text

  /**
   * Creates a new `CDATASection` node.
   * 
   * @param document - owner document
   * @param data - node contents
   */
  cdataSection(document: Document, data?: string): CDATASection

  /**
   * Creates a new `Comment` node.
   * 
   * @param document - owner document
   * @param data - node contents
   */
  comment(document: Document, data?: string): Comment

  /**
   * Creates a new `ProcessingInstruction` node.
   * 
   * @param document - owner document
   * @param target - instruction target
   * @param data - node contents
   */
  processingInstruction(document: Document, target: string, data?: string):
    ProcessingInstruction

  /**
   * Creates a new `HTMLCollection`.
   * 
   * @param root - root node
   * @param filter - node filter
   */
  htmlCollection(root: Node,
    filter?: ((element: Element) => boolean)): HTMLCollection

  /**
   * Creates a new live `NodeList`.
   * 
   * @param root - root node
   */
  nodeList(root: Node): NodeList

  /**
   * Creates a new `NamedNodeMap`.
   * 
   * @param element - parent element
   */
  namedNodeMap(element: Element): NamedNodeMap

  /**
   * Creates a new static `NodeList`.
   * 
   * @param root - root node
   * @param items - a list of items to initialize the list
   */
  nodeListStatic(root: Node, items: Node[]): NodeList

  /**
   * Creates a new `Range`.
   * 
   * @param start - start point
   * @param end - end point
   */
  range(start?: BoundaryPoint, end?: BoundaryPoint): Range

  /**
   * Creates a new `NodeIterator`.
   * 
   * @param root - iterator's root node
   * @param reference - reference node
   * @param pointerBeforeReference - whether the iterator is before or after the
   * reference node 
   */
  nodeIterator(root: Node, reference: Node,
    pointerBeforeReference: boolean): NodeIterator


  /**
   * Creates a new `TreeWalker`.
   * 
   * @param root - iterator's root node
   * @param current - current node
   */
  treeWalker(root: Node, current: Node): TreeWalker

  /**
   * Creates a new `NodeFilter`.
   */
  nodeFilter(): NodeFilter

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
  mutationRecord(type: "attributes" | "characterData" | "childList",
    target: Node, addedNodes: NodeList,
    removedNodes: NodeList, previousSibling: Node | null,
    nextSibling: Node | null, attributeName: string | null,
    attributeNamespace: string | null, oldValue: string | null): MutationRecord

  /**
   * Creates a new `DOMTokenList`.
   * 
   * @param element - associated element
   * @param attribute - associated attribute
   */
  domTokenList(element: Element, attribute: Attr): DOMTokenList

  /** 
   * Creates an `URLRecord`.
   * 
   * @param url - an URL string
   */
  urlRecord(url: string): URLInterfaces.URLRecord

}

/**
 * Contains algorithms for boundary points.
 */
export interface BoundaryPointAlgorithm extends SubAlgorithm {

  /**
   * Defines the position of a boundary point relative to another.
   * 
   * @param bp - a boundary point
   * @param relativeTo - a boundary point to compare to
   */
  position(bp: BoundaryPoint, relativeTo: BoundaryPoint): BoundaryPosition

  /**
   * Returns the boundary point for the start of a node.
   * 
   * @param node - a node
   */
  nodeStart(node: Node): BoundaryPoint

  /**
   * Returns the boundary point for the end of a node.
   * 
   * @param node - a node
   */
  nodeEnd(node: Node): BoundaryPoint

}

/**
 * Contains algorithms for ranges.
 */
export interface RangeAlgorithm extends SubAlgorithm {

  /**
   * Determines if the node's start boundary point is at its end boundary
   * point.
   * 
   * @param range - a range
   */
  collapsed(range: AbstractRange): boolean

  /**
   * Gets the root node of a range.
   * 
   * @param range - a range
   */
  root(range: AbstractRange): Node

  /**
   * Determines if a node is fully contained in a range.
   * 
   * @param node - a node
   * @param range - a range
   */
  isContained(node: Node, range: AbstractRange): boolean

  /**
   * Determines if a node is partially contained in a range.
   * 
   * @param node - a node
   * @param range - a range
   */
  isPartiallyContained(node: Node, range: AbstractRange): boolean

  /**
   * Sets the start boundary point of a range.
   * 
   * @param range - a range
   * @param node - a node
   * @param offset - an offset into node
   */
  setTheStart(range: AbstractRange, node: Node, offset: number): void

  /**
   * Sets the end boundary point of a range.
   * 
   * @param range - a range
   * @param node - a node
   * @param offset - an offset into node
   */
  setTheEnd(range: AbstractRange, node: Node, offset: number): void

  /** 
   * Selects a node.
   * 
   * @param range - a range
   * @param node - a node
   */
  select(node: Node, range: AbstractRange): void

  /**
 * EXtracts the contents of range as a document fragment.
 * 
 * @param range - a range
 */
  extract(range: AbstractRange): DocumentFragment

  /**
   * Clones the contents of range as a document fragment.
   * 
   * @param range - a range
   */
  cloneTheContents(range: AbstractRange): DocumentFragment

  /**
   * Inserts a node into a range at the start boundary point.
   * 
   * @param node - node to insert
   * @param range - a range
   */
  insert(node: Node, range: AbstractRange): void

  /**
   * Traverses through all contained nodes of a range.
   * 
   * @param range - a range
   */
  getContainedNodes(range: AbstractRange): IterableIterator<Node>

  /**
   * Traverses through all partially contained nodes of a range.
   * 
   * @param range - a range
   */
  getPartiallyContainedNodes(range: AbstractRange): IterableIterator<Node>

  /**
   * Gets the global range list.
   */
  readonly rangeList: ObjectCache<Range>
}

/**
 * Contains algorithms for traversing the DOM tree.
 */
export interface TraversalAlgorithm extends SubAlgorithm {

  /**
   * Applies the filter to the given node and returns the result.
   * 
   * @param traverser - the `NodeIterator` or `TreeWalker` instance
   * @param node - the node to filter
   */
  filter(traverser: NodeIterator | TreeWalker,
    node: Node): FilterResult

}

/**
 * Contains algorithms for node iterators.
 */
export interface NodeIteratorAlgorithm extends SubAlgorithm {

  /**
   * Returns the next or previous node in the subtree, or `null` if 
   * there are none.
   * 
   * @param iterator - the `NodeIterator` instance
   * @param forward- `true` to return the next node, or `false` to 
   * return the previous node.
   */
  traverse(iterator: NodeIterator, forward: boolean): Node | null

  /**
   * Gets the global iterator list.
   */
  readonly iteratorList: ObjectCache<NodeIterator>
}

/**
 * Contains algorithms for tree walkers.
 */
export interface TreeWalkerAlgorithm extends SubAlgorithm {

  /**
   * Returns the first or last child node, or `null` if there are none.
   * 
   * @param walker - the `TreeWalker` instance
   * @param first - `true` to return the first child node, or `false` to 
   * return the last child node.
   */
  traverseChildren(walker: TreeWalker, first: boolean): Node | null

  /**
   * Returns the next or previous sibling node, or `null` if there are none.
   * 
   * @param walker - the `TreeWalker` instance
   * @param next - `true` to return the next sibling node, or `false` to 
   * return the previous sibling node.
   */
  traverseSiblings(walker: TreeWalker, next: boolean): Node | null

}

/**
 * Contains DOM token list algorithms.
 */
export interface DOMTokenListAlgorithm extends SubAlgorithm {

  /**
   * Validates a given token against the supported tokens defined for the given
   * token lists' associated attribute.
   * 
   * @param tokenList - a token list
   * @param token - a token
   */
  validationSteps(tokenList: DOMTokenList, token: string): boolean

  /**
   * Updates the value of the token lists' associated attribute.
   * 
   * @param tokenList - a token list
   */
  updateSteps(tokenList: DOMTokenList): void

  /**
   * Gets the value of the token lists' associated attribute.
   * 
   * @param tokenList - a token list
   */
  serializeSteps(tokenList: DOMTokenList): string

}

/**
 * Contains regex strings to match against productions defined in the 
 * [XML 1.0](http://www.w3.org/TR/xml/) and [XML 1.1](http://www.w3.org/TR/xml11).
 */
export interface XMLAlgorithm extends SubAlgorithm {

  /**
   * Determines if the given string is valid for a `"Name"` construct.
   * 
   * @param name - name string to test
   */
  isName(name: string): boolean

  /**
   * Determines if the given string is valid for a `"QName"` construct.
   * 
   * @param name - name string to test
   */
  isQName(name: string): boolean

  /**
   * Determines if the given string contains legal characters.
   * 
   * @param chars - sequence of characters to test
   * @param xmlVersion - XML specification version
   */
  isLegalChar(chars: string, xmlVersion?: "1.0" | "1.1"): boolean

  /**
   * Determines if the given string contains legal characters for a public 
   * identifier.
   * 
   * @param chars - sequence of characters to test
   */
  isPubidChar(chars: string): boolean

}

/**
 * Contains custom element algorithms.
 */
export interface CustomElementAlgorithm extends SubAlgorithm {

  /**
   * Determines if the given string is a valid custom element name.
   * 
   * @param name - a name string
   */
  isValidCustomElementName(name: string): boolean

  /**
   * Determines if the given string is a valid element name.
   * 
   * @param name - a name string
   */
  isValidElementName(name: string): boolean

  /**
   * Determines if the given string is a void element name.
   * 
   * @param name - a name string
   */
  isVoidElementName(name: string): boolean

  /**
   * Determines if the given string is a valid shadow host element name.
   * 
   * @param name - a name string
   */
  isValidShadowHostName(name: string): boolean

  /**
   * Enqueues an upgrade reaction for a custom element.
   * 
   * @param element - a custom element
   * @param definition - a custom element definition
   */
  enqueueACustomElementUpgradeReaction(element: Element,
    definition: CustomElementDefinition): void

  /**
   * Enqueues a callback reaction for a custom element.
   * 
   * @param element - a custom element
   * @param callbackName - name of the callback
   * @param args - callback arguments
   */
  enqueueACustomElementCallbackReaction(element: Element,
    callbackName: string, args: any[]): void

  /**
   * Upgrade a custom element.
   * 
   * @param element - a custom element
   */
  upgrade(definition: CustomElementDefinition, element: Element): void

  /**
   * Tries to upgrade a custom element.
   * 
   * @param element - a custom element
   */
  tryToUpgrade(element: Element): void

  /**
   * Looks up a custom element definition.
   * 
   * @param document - a document
   * @param namespace - element namespace
   * @param localName - element local name
   * @param is - an `is` value
   */
  lookUpACustomElementDefinition(document: Document, 
    namespace: string | null, localName: string, is: string | null): 
    CustomElementDefinition | null
}

/**
 * Defines a removing step.
 */
export type RemovingStep = ((removedNode: Node,
  oldParent: Node | null) => any)

/**
 * Defines a cloning step.
 */
export type CloningStep = ((copy: Node,
  node: Node, document: Document,
  cloneChildrenFlag?: boolean) => any)

/**
 * Defines an adopting step.
 */
export type AdoptingStep = ((node: Node,
  oldDocument: Document) => any)

/**
 * Defines a child text content change step.
 */
export type ChildTextContentChangeStep = ((parent: Node) => any)

/**
 * Defines an attribute change step.
 */
export type AttributeChangeStep = ((element: Element,
  localName: string, oldValue: string | null, value: string | null,
  namespace: string | null) => any)

/**
 * Defines an insertion step.
 */
export type InsertionStep = ((insertedNode: Node) => any)

/**
 * Defines a pre-removal step for a node iterator.
 */
export type NodeIteratorPreRemovingStep = ((nodeIterator: NodeIterator,
  toBeRemovedNode: Node) => any)

/**
 * Defines an event construction step.
 */
export type EventConstructingStep = ((event: Event) => any)

/**
 * Defines a boolean out variable of a function.
 */
export type OutputFlag = {
  value: boolean
}