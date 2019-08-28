import {
  NodeInternal, DocumentInternal, ElementInternal, HTMLCollectionInternal,
  AttrInternal, DOMImplementationInternal, DocumentTypeInternal,
  DocumentFragmentInternal, TextInternal, CDATASectionInternal,
  CommentInternal, ProcessingInstructionInternal, NodeListInternal,
  NamedNodeMapInternal, RangeInternal, NodeIteratorInternal,
  TreeWalkerInternal, NodeFilterInternal, EventInternal, EventTargetInternal,
  AbortSignalInternal, SlotableInternal, SlotInternal, MutationRecordInternal,
  CharacterDataInternal, XMLDocumentInternal, DOMTokenListInternal, ShadowRootInternal, AbstractRangeInternal
} from "../interfacesInternal"
import {
  AddEventListenerOptions, EventListenerOptions, EventListenerEntry,
  PotentialEventTarget, EventPathItem, BoundaryPoint, BoundaryPosition, FilterResult
} from "../interfaces"

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
   * Runs removing steps for node.
   * 
   * @param thisObj - the value of this in the function
   * @param removedNode - removed node
   * @param oldParent - old parent node
   */
  runRemovingSteps(thisObj: any, removedNode: NodeInternal,
    oldParent?: NodeInternal | null): void

  /**
   * Runs cloning steps for node.
   * 
   * @param thisObj - the value of this in the function
   * @param copy - node clone
   * @param node - node
   * @param document - document to own the cloned node
   * @param cloneChildrenFlag - whether child nodes are cloned
   */
  runCloningSteps(thisObj: any, copy: NodeInternal, node: NodeInternal, document:
    DocumentInternal, cloneChildrenFlag?: boolean): void

  /**
   * Runs adopting steps for node.
   * 
   * @param thisObj - the value of this in the function
   * @param node - node
   * @param oldDocument - old document
   */
  runAdoptingSteps(thisObj: any, node: NodeInternal,
    oldDocument: DocumentInternal): void

  /**
   * Runs child text content change steps for a parent node.
   * 
   * @param thisObj - the value of this in the function
   * @param parent - parent node with text node child nodes
   */
  runChildTextContentChangeSteps(thisObj: any, parent: NodeInternal): void

  /**
   * Runs attribute change steps for an element node.
   * 
   * @param thisObj - the value of this in the function
   * @param element - element node owning the attribute
   * @param localName - attribute's local name
   * @param oldValue - attribute's old value
   * @param value - attribute's new value
   * @param namespace - attribute's namespace
   */
  runAttributeChangeSteps(thisObj: any, element: ElementInternal,
    localName: string, oldValue: string | null, value: string | null,
    namespace: string | null): void

  /**
   * Runs insertion steps for a node.
   * 
   * @param thisObj - the value of this in the function
   * @param insertedNode - inserted node
   */
  runInsertionSteps(thisObj: any, insertedNode: NodeInternal): void

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
   * Determines whether `other` is the parent node of `node`.
   * 
   * @param node - a node
   * @param other - the node to check
   */
  isParentOf(node: NodeInternal, other: NodeInternal): boolean

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
   * Returns the previous sibling node of `node` or null if it has no
   * preceding sibling.
   * 
   * @param node 
   */
  previousSibling(node: NodeInternal): NodeInternal | null

  /**
   * Returns the next sibling node of `node` or null if it has no
   * following sibling.
   * 
   * @param node 
   */
  nextSibling(node: NodeInternal): NodeInternal | null

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
  scopeMatchASelectorsString(selectors: string, node: NodeInternal):
    ElementInternal[]

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
  setTheCanceledFlag(event: EventInternal): void

  /**
   * Initializes the value of an event.
   * 
   * @param event - an event to initialize
   * @param type - the type of event
   * @param bubbles - whether the event propagates in reverse
   * @param cancelable - whether the event can be cancelled
   */
  initialize(event: EventInternal, type: string, bubbles: boolean,
    cancelable: boolean): void

  /**
   * Creates a new event.
   * 
   * @param eventInterface - event interface
   * @param realm - realm
   */
  createAnEvent(eventInterface: EventInternal, realm: any): EventInternal

  /**
   * Performs event creation steps.
   * 
   * @param eventInterface - event interface
   * @param realm - realm
   * @param time - time of occurrance
   * @param dictionary - event attributes
   * 
   */
  innerEventCreationSteps(eventInterface: EventInternal, realm: any,
    time: Date, dictionary: { [key: string]: any }): EventInternal

  /**
   * Dispatches an event to an event target.
   * 
   * @param event - the event to dispatch
   * @param target - event target
   * @param legacyTargetOverrideFlag - legacy target override flag
   * @param legacyOutputDidListenersThrowFlag - legacy output flag that returns
   * whether the event listener's callback threw an exception
   */
  dispatch(event: EventInternal, target: EventTargetInternal,
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
  appendToAnEventPath(event: EventInternal,
    invocationTarget: EventTargetInternal, shadowAdjustedTarget: PotentialEventTarget,
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
  invoke(struct: EventPathItem, event: EventInternal,
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
  innerInvoke(event: EventInternal,
    listeners: EventListenerEntry[], phase: "capturing" | "bubbling",
    legacyOutputDidListenersThrowFlag?: OutputFlag): boolean

  /**
   * Fires an event at target.
   * @param e - event name
   * @param target - event target
   * @param eventConstructor - an event constructor, with a description of how
   * IDL attributes are to be initialized
   * @param legacyTargetOverrideFlag - legacy target override flag
   */
  fireAnEvent(e: string, target: EventTargetInternal, eventConstructor?: any,
    legacyTargetOverrideFlag?: boolean): boolean
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
  addEventListener(eventTarget: EventTargetInternal,
    listener: EventListenerEntry): void

  /**
   * Removes an event listener.
   * 
   * @param eventTarget - event target
   * @param listener - event listener
   */
  removeEventListener(eventTarget: EventTargetInternal,
    listener: EventListenerEntry, index?: number): void

  /**
   * Removes all event listeners.
   * 
   * @param eventTarget - event target
   */
  removeAllEventListeners(eventTarget: EventTargetInternal): void

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
  add(algorithm: ((...args: any[]) => any), signal: AbortSignalInternal): void

  /**
   * Removes an algorithm from the given abort signal.
   * 
   * @param algorithm - an algorithm
   * @param signal - abort signal
   */
  remove(algorithm: ((...args: any[]) => any), signal: AbortSignalInternal): void

  /**
   * Signals abort on the given abort signal.
   * 
   * @param signal - abort signal
   */
  signalAbort(signal: AbortSignalInternal): void

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
  isConnected(element: ElementInternal): boolean

  /**
   * Determines whether a slotable is assigned.
   * 
   * @param slotable - a slotable
   */
  isAssigned(slotable: SlotableInternal): boolean

  /**
   * Finds a slot for the given slotable.
   * 
   * @param slotable - a slotable
   * @param openFlag - `true` to search open shadow tree's only
   */
  findASlot(slotable: SlotableInternal, openFlag?: boolean): SlotInternal | null

  /**
   * Finds slotables for the given slot.
   * 
   * @param slot - a slot
   */
  findSlotables(slot: SlotInternal): SlotableInternal[]

  /**
   * Finds slotables for the given slot.
   * 
   * @param slot - a slot
   */
  findFlattenedSlotables(slot: SlotInternal): SlotableInternal[]

  /**
   * Assigns slotables to the given slot.
   * 
   * @param slot - a slot
   */
  assignSlotables(slot: SlotInternal): void

  /**
   * Assigns slotables to all nodes of a tree.
   * 
   * @param root - root node
   */
  assignSlotablesForATree(root: NodeInternal): void

  /**
   * Assigns a slot to a slotables.
   * 
   * @param slotable - a slotable
   */
  assignASlot(slotable: SlotableInternal): void

  /**
   * Signals a slot change to the given slot.
   * 
   * @param slot - a slot
   */
  signalASlotChange(slot: SlotInternal): void
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
  ensurePreInsertionValidity(node: NodeInternal, parent: NodeInternal,
    child: NodeInternal | null): void

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
   * Inserts a node into a parent node before the given child node.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   * @param child - child node to insert node before
   * @param suppressObservers - whether to notify observers
   */
  insert(node: NodeInternal, parent: NodeInternal,
    child: NodeInternal | null, suppressObservers?: boolean): void

  /**
   * Appends a node to the children of a parent node.
   * 
   * @param node - a node
   * @param parent - the parent to receive node
   */
  append(node: NodeInternal, parent: NodeInternal): NodeInternal

  /**
   * Replaces a node with another node.
   * 
   * @param child - child node to remove
   * @param node - node to insert
   * @param parent - parent node to receive node
   */
  replace(child: NodeInternal, node: NodeInternal,
    parent: NodeInternal): NodeInternal

  /**
   * Replaces all nodes of a parent with the given node.
   * 
   * @param node - node to insert
   * @param parent - parent node to receive node
   */
  replaceAll(node: NodeInternal | null, parent: NodeInternal): void

  /**
   * Ensures pre-removal validity of a child node from a parent, then
   * removes it.
   * 
   * @param child - child node to remove
   * @param parent - parent node
   */
  preRemove(child: NodeInternal, parent: NodeInternal): NodeInternal

  /**
   * Removes a child node from its parent.
   * 
   * @param node - node to remove
   * @param parent - parent node
   * @param suppressObservers - whether to notify observers
   */
  remove(node: NodeInternal, parent: NodeInternal, suppressObservers?: boolean): void

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
  convertNodesIntoANode(nodes: (NodeInternal | string)[],
    document: DocumentInternal): NodeInternal

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
  setAnExistingAttributeValue(attribute: AttrInternal, value: string): void

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
  has(attribute: AttrInternal, element: ElementInternal): boolean

  /**
   * Changes the value of an attribute node.
   * 
   * @param attribute - an attribute node
   * @param element - an element node
   * @param value - attribute value
   */
  change(attribute: AttrInternal, element: ElementInternal, value: string): void

  /**
   * Appends an attribute to an element node.
   * 
   * @param attribute - an attribute
   * @param element - an element to receive the attribute
   */
  append(attribute: AttrInternal, element: ElementInternal): void

  /**
   * Removes an attribute from an element node.
   * 
   * @param attribute - an attribute
   * @param element - an element to receive the attribute
   */
  remove(attribute: AttrInternal, element: ElementInternal): void

  /**
   * Replaces an attribute with another of an element node.
   * 
   * @param oldAttr - old attribute
   * @param newAttr - new attribute
   * @param element - an element to receive the attribute
   */
  replace(oldAttr: AttrInternal, newAttr: AttrInternal,
    element: ElementInternal): void

  /**
   * Retrieves an attribute with the given name from an element node.
   * 
   * @param qualifiedName - an attribute name
   * @param element - an element to receive the attribute
   */
  getAnAttributeByName(qualifiedName: string, element: ElementInternal):
    AttrInternal | null

  /**
   * Retrieves an attribute with the given namespace and local name from an
   * element node.
   * 
   * @param namespace - an attribute namespace
   * @param localName - an attribute local name
   * @param element - an element to receive the attribute
   */
  getAnAttributeByNamespaceAndLocalName(namespace: string, localName: string,
    element: ElementInternal): AttrInternal | null

  /**
   * Retrieves an attribute's value with the given name namespace and local
   * name from an element node.
   * 
   * @param element - an element to receive the attribute
   * @param localName - an attribute local name
   * @param namespace - an attribute namespace
   */
  getAnAttributeValue(element: ElementInternal, localName: string,
    namespace?: string): string

  /**
   * Sets an attribute of an element node.
   * 
   * @param attr - an attribute
   * @param element - an element to receive the attribute
   */
  setAnAttribute(attr: AttrInternal, element: ElementInternal): AttrInternal | null

  /**
   * Sets an attribute's value of an element node.
   * 
   * @param element - an element to receive the attribute
   * @param localName - an attribute local name
   * @param value - an attribute value
   * @param prefix - an attribute prefix
   * @param namespace - an attribute namespace
   */
  setAnAttributeValue(element: ElementInternal, localName: string,
    value: string, prefix?: string | null, namespace?: string | null): void

  /**
   * Removes an attribute with the given name from an element node.
   * 
   * @param qualifiedName - an attribute name
   * @param element - an element to receive the attribute
   */
  removeAnAttributeByName(qualifiedName: string, element: ElementInternal):
    AttrInternal | null

  /**
   * Removes an attribute with the given namespace and local name from an
   * element node.
   * 
   * @param namespace - an attribute namespace
   * @param localName - an attribute local name
   * @param element - an element to receive the attribute
   */
  removeAnAttributeByNamespaceAndLocalName(namespace: string, localName: string,
    element: ElementInternal): AttrInternal | null

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
    namespace: string | null, prefix?: string | null, is?: string | null,
    synchronousCustomElementsFlag?: boolean): ElementInternal

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
  insertAdjacent(element: ElementInternal,
    where: "beforebegin" | "afterbegin" | "beforeend" | "afterend",
    node: NodeInternal): NodeInternal | null
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
  replaceData(node: CharacterDataInternal, offset: number, count: number,
    data: string): void

  /**
   * Returns `count` number of characters from `node`'s data starting at
   * the given `offset`.
   * 
   * @param node - a character data node
   * @param offset - start offset
   * @param count - count of characters to return
   */
  substringData(node: CharacterDataInternal, offset: number, count: number): string

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
  contiguousTextNodes(node: TextInternal, self?: boolean):
    IterableIterator<TextInternal>

  /**
   * Returns node with its adjacent text node siblings.
   * 
   * @param node - a node
   * @param self - whether to include node itself
   */
  contiguousExclusiveTextNodes(node: TextInternal, self?: boolean):
    IterableIterator<TextInternal>

  /**
   * Returns the concatenation of the data of all the Text node descendants of
   * node, in tree order.
   * 
   * @param node - a node
   */
  descendantTextContent(node: NodeInternal): string

  /**
   * Splits data at the given offset and returns the remainder as a text
   * node.
   * 
   * @param node - a text node
   * @param offset - the offset at which to split the nodes.
   */
  split(node: TextInternal, offset: number): TextInternal
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
  stringReplaceAll(str: string, parent: NodeInternal): void

  /**
   * Clones a node.
   * 
   * @param node - a node to clone
   * @param document - the document to own the cloned node
   * @param cloneChildrenFlag - whether to clone node's children
   */
  clone(node: NodeInternal, document?: DocumentInternal | null,
    cloneChildrenFlag?: boolean): NodeInternal

  /**
   * Determines if two nodes can be considered equal.
   * 
   * @param a - node to compare
   * @param b - node to compare
   */
  equals(a: NodeInternal, b: NodeInternal): boolean

  /**
   * Searches for a namespace prefix associated with the given namespace 
   * starting from the given element through its ancestors.
   * 
   * @param element - an element node to start searching at
   * @param namespace - namespace to search for
   */
  locateANamespacePrefix(element: ElementInternal,
    namespace: string | null): string | null

  /**
   * Searches for a namespace associated with the given namespace prefix
   * starting from the given node through its ancestors.
   * 
   * @param node - a node to start searching at
   * @param prefix - namespace prefix to search for
   */
  locateANamespace(node: NodeInternal, prefix: string | null): string | null

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

}

/**
 * Contains algorithms for manipulating document nodes.
 */
export interface DocumentAlgorithm extends SubAlgorithm {

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
   * Removes `node` and its subtree from its document and changes
   * its owner document to `document` so that it can be inserted
   * into `document`.
   * 
   * @param node - the node to move
   * @param document - document to receive the node and its subtree
   */
  adopt(node: NodeInternal, document: DocumentInternal): void

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
  domImplementation(document: DocumentInternal): DOMImplementationInternal

  /** 
   * Creates a `Document` node.
   */
  document(): DocumentInternal

  /** 
   * Creates an `XMLDocument` node.
   */
  xmlDocument(): XMLDocumentInternal

  /** 
   * Creates a `DocumentType` node.
   * 
   * @param document - owner document
   * @param name - name of the node
   * @param publicId - `PUBLIC` identifier
   * @param systemId - `SYSTEM` identifier
   */
  documentType(document: DocumentInternal, name: string, publicId?: string,
    systemId?: string): DocumentTypeInternal

  /**
   * Creates a new `Element` node.
   * 
   * @param document - owner document
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  element(document: DocumentInternal, localName: string, namespace: string | null,
    prefix: string | null): ElementInternal

  /**
   * Creates a new `DocumentFragment` node.
   * 
   * @param document - owner document
   */
  documentFragment(document: DocumentInternal): DocumentFragmentInternal

  /**
   * Creates a new `ShadowRoot` node.
   * 
   * @param document - owner document
   * @param host - shadow root's host element node
   */
  shadowRoot(document: DocumentInternal, host: ElementInternal): ShadowRootInternal

  /**
   * Creates a new `Attr` node.
   * 
   * @param document - owner document
   * @param localName - local name
   */
  attr(document: DocumentInternal, localName: string): AttrInternal

  /**
   * Creates a new `Text` node.
   * 
   * @param document - owner document
   * @param data - node contents
   */
  text(document: DocumentInternal, data?: string): TextInternal

  /**
   * Creates a new `CDATASection` node.
   * 
   * @param document - owner document
   * @param data - node contents
   */
  cdataSection(document: DocumentInternal, data?: string): CDATASectionInternal

  /**
   * Creates a new `Comment` node.
   * 
   * @param document - owner document
   * @param data - node contents
   */
  comment(document: DocumentInternal, data?: string): CommentInternal

  /**
   * Creates a new `ProcessingInstruction` node.
   * 
   * @param document - owner document
   * @param target - instruction target
   * @param data - node contents
   */
  processingInstruction(document: DocumentInternal, target: string, data?: string):
    ProcessingInstructionInternal

  /**
   * Creates a new `HTMLCollection`.
   * 
   * @param root - root node
   * @param filter - node filter
   */
  htmlCollection(root: NodeInternal,
    filter?: ((element: ElementInternal) => any)): HTMLCollectionInternal

  /**
   * Creates a new live `NodeList`.
   * 
   * @param root - root node
   */
  nodeList(root: NodeInternal): NodeListInternal

  /**
   * Creates a new `NamedNodeMap`.
   * 
   * @param element - parent element
   */
  namedNodeMap(element: ElementInternal): NamedNodeMapInternal

  /**
   * Creates a new static `NodeList`.
   * 
   * @param root - root node
   * @param items - a list of items to initialize the list
   */
  nodeListStatic(root: NodeInternal, items: NodeInternal[]): NodeListInternal

  /**
   * Creates a new `Range`.
   * 
   * @param start - start point
   * @param end - end point
   */
  range(start?: BoundaryPoint, end?: BoundaryPoint): RangeInternal

  /**
   * Creates a new `NodeIterator`.
   * 
   * @param root - iterator's root node
   * @param reference - reference node
   * @param pointerBeforeReference - whether the iterator is before or after the
   * reference node 
   */
  nodeIterator(root: NodeInternal, reference: NodeInternal,
    pointerBeforeReference: boolean): NodeIteratorInternal


  /**
   * Creates a new `TreeWalker`.
   * 
   * @param root - iterator's root node
   * @param current - current node
   */
  treeWalker(root: NodeInternal, current: NodeInternal): TreeWalkerInternal

  /**
   * Creates a new `NodeFilter`.
   */
  nodeFilter(): NodeFilterInternal

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
    target: NodeInternal, addedNodes: NodeListInternal,
    removedNodes: NodeListInternal, previousSibling: NodeInternal | null,
    nextSibling: NodeInternal | null, attributeName: string | null,
    attributeNamespace: string | null, oldValue: string | null): MutationRecordInternal

  /**
   * Creates a new `DOMTokenList`.
   * 
   * @param element - associated element
   * @param attribute - associated attribute
   */
  domTokenList(element: ElementInternal, attribute: AttrInternal): DOMTokenListInternal

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
  nodeStart(node: NodeInternal): BoundaryPoint

  /**
   * Returns the boundary point for the end of a node.
   * 
   * @param node - a node
   */
  nodeEnd(node: NodeInternal): BoundaryPoint

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
  collapsed(range: AbstractRangeInternal): boolean

  /**
   * Gets the root node of a range.
   * 
   * @param range - a range
   */
  root(range: AbstractRangeInternal): NodeInternal

  /**
   * Determines if a node is fully contained in a range.
   * 
   * @param node - a node
   * @param range - a range
   */
  isContained(node: NodeInternal, range: AbstractRangeInternal): boolean

  /**
   * Determines if a node is partially contained in a range.
   * 
   * @param node - a node
   * @param range - a range
   */
  isPartiallyContained(node: NodeInternal, range: AbstractRangeInternal): boolean

  /**
   * Sets the start boundary point of a range.
   * 
   * @param range - a range
   * @param node - a node
   * @param offset - an offset into node
   */
  setTheStart(range: AbstractRangeInternal, node: NodeInternal, offset: number): void

  /**
   * Sets the end boundary point of a range.
   * 
   * @param range - a range
   * @param node - a node
   * @param offset - an offset into node
   */
  setTheEnd(range: AbstractRangeInternal, node: NodeInternal, offset: number): void

  /** 
   * Selects a node.
   * 
   * @param range - a range
   * @param node - a node
   */
  select(node: NodeInternal, range: AbstractRangeInternal): void

  /**
 * EXtracts the contents of range as a document fragment.
 * 
 * @param range - a range
 */
  extract(range: AbstractRangeInternal): DocumentFragmentInternal

  /**
   * Clones the contents of range as a document fragment.
   * 
   * @param range - a range
   */
  cloneTheContents(range: AbstractRangeInternal): DocumentFragmentInternal

  /**
   * Inserts a node into a range at the start boundary point.
   * 
   * @param node - node to insert
   * @param range - a range
   */
  insert(node: NodeInternal, range: AbstractRangeInternal): void

  /**
   * Traverses through all contained nodes of a range.
   * 
   * @param range - a range
   */
  getContainedNodes(range: AbstractRangeInternal): IterableIterator<NodeInternal>

  /**
   * Traverses through all partially contained nodes of a range.
   * 
   * @param range - a range
   */
  getPartiallyContainedNodes(range: AbstractRangeInternal): IterableIterator<NodeInternal>

  /**
   * Removes a range object from the given document.
   * 
   * @param doc - owner document
   * @param range - the range to remove
   */
  removeRange(range: AbstractRangeInternal, doc: DocumentInternal): void

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
  filter(traverser: NodeIteratorInternal | TreeWalkerInternal,
    node: NodeInternal): FilterResult

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
  traverse(iterator: NodeIteratorInternal, forward: boolean): NodeInternal | null

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
  traverseChildren(walker: TreeWalkerInternal, first: boolean): NodeInternal | null

  /**
   * Returns the next or previous sibling node, or `null` if there are none.
   * 
   * @param walker - the `TreeWalker` instance
   * @param next - `true` to return the next sibling node, or `false` to 
   * return the previous sibling node.
   */
  traverseSiblings(walker: TreeWalkerInternal, next: boolean): NodeInternal | null

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
  validationSteps(tokenList: DOMTokenListInternal, token: string): boolean

  /**
   * Updates the value of the token lists' associated attribute.
   * 
   * @param tokenList - a token list
   */
  updateSteps(tokenList: DOMTokenListInternal): void

  /**
   * Gets the value of the token lists' associated attribute.
   * 
   * @param tokenList - a token list
   */
  serializeSteps(tokenList: DOMTokenListInternal): string

}

/**
 * Defines a removing step.
 */
export type RemovingStep = ((removedNode: NodeInternal,
  oldParent: NodeInternal | null) => any)

/**
 * Defines a cloning step.
 */
export type CloningStep = ((copy: NodeInternal,
  node: NodeInternal, document: DocumentInternal,
  cloneChildrenFlag?: boolean) => any)

/**
 * Defines an adopting step.
 */
export type AdoptingStep = ((node: NodeInternal,
  oldDocument: DocumentInternal) => any)

/**
 * Defines a child text content change step.
 */
export type ChildTextContentChangeStep = ((parent: NodeInternal) => any)

/**
 * Defines an attribute change step.
 */
export type AttributeChangeStep = ((element: ElementInternal,
  localName: string, oldValue: string | null, value: string | null,
  namespace: string | null) => any)

/**
 * Defines an insertion step.
 */
export type InsertionStep = ((insertedNode: NodeInternal) => any)

/**
 * Defines a pre-removal step for a node iterator.
 */
export type NodeIteratorPreRemovingSteps = ((nodeIterator: NodeIteratorInternal,
  toBeRemovedNode: NodeInternal) => any)

/**
 * Defines a boolean out variable of a function.
 */
export type OutputFlag = {
  value: boolean
}