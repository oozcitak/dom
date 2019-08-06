import {
  DOMImplementation, DocumentType, Element, Text,
  NodeFilter, NodeType, Node, HTMLCollection, DocumentFragment,
  NodeList, WhatToShow, Attr, ProcessingInstruction, Comment,
  CDATASection, NodeIterator, TreeWalker, FilterResult, Range, Event,
  EventTarget, Type
} from './interfaces'
import {
  DocumentInternal, NodeInternal, AttrInternal, NodeIteratorInternal,
  NodeListInternal, DOMAlgorithmInternal
} from './interfacesInternal'
import { DOMException } from './DOMException'
import { NodeImpl } from './NodeImpl'
import { Namespace, XMLSpec } from './spec'
import { Guard } from './util'
import { globalStore, isFunction, isString } from '../util'

/**
 * Represents a document node.
 */
export class DocumentImpl extends NodeImpl implements DocumentInternal {

  _encoding: { name: string, labels: string[] } = {
    name: "UTF-8",
    labels: ["unicode-1-1-utf-8", "utf-8", "utf8"]
  }
  _contentType: string = 'application/xml'
  // TODO: https://url.spec.whatwg.org/#concept-url
  _URL: string = 'about:blank'
  // TODO: https://html.spec.whatwg.org/multipage/origin.html#concept-origin
  _origin: string = ''
  _type: "xml" | "html" = "xml"
  _mode: "no-quirks" | "quirks" | "limited-quirks" = "no-quirks"

  _rangeList: Range[] = []

  protected _implementation: DOMImplementation

  /**
   * Initializes a new instance of `Document`.
   */
  public constructor() {
    super()

    const algo = globalStore.algorithm as DOMAlgorithmInternal
    this._implementation = algo.createDOMImplementation()

    this._nodeDocument = this

    // TODO: return a new document whose origin is the origin of current global object’s associated Document.
  }

  /**
   * Returns the document's URL.
   */
  get URL(): string {
    // TODO: Return serialized URL. See: https://url.spec.whatwg.org/#concept-url-serializer
    return this._URL
  }

  /**
   * Gets or sets the document's URL.
   */
  get documentURI(): string {
    // TODO: Return serialized URL. See: https://url.spec.whatwg.org/#concept-url-serializer
    return this._URL
  }

  /**
   * Returns sets the document's origin.
   */
  get origin(): string { return this._origin }

  /**
   * Returns whether the document is rendered in Quirks mode or
   * Standards mode.
   */
  get compatMode(): string {
    return this._mode === "quirks" ? "BackCompat" : "CSS1Compat"
  }

  /**
   * Returns the character set.
   */
  get characterSet(): string { return this._encoding.name }

  /**
   * Gets or sets the character set.
   */
  get charset(): string { return this._encoding.name }

  /**
   * Returns the character set.
   */
  get inputEncoding(): string { return this._encoding.name }

  /**
   * Returns the MIME type of the document.
   */
  get contentType(): string { return this._contentType }

  /** 
   * Returns the type of node. 
   */
  get nodeType(): NodeType { return NodeType.Document }

  /** 
   * Returns a string appropriate for the type of node. 
   */
  get nodeName(): string { return '#document' }

  /** 
   * Returns the {@link DOMImplementation} object that is associated 
   * with the document.
   */
  get implementation(): DOMImplementation { return this._implementation }

  /** 
   * Returns the {@link DocType} or `null` if there is none.
   */
  get doctype(): DocumentType | null {
    for (const child of this.childNodes) {
      if (child.nodeType === NodeType.DocumentType)
        return <DocumentType>child
    }
    return null
  }

  /** 
   * Returns the document element or `null` if there is none.
   */
  get documentElement(): Element | null {
    for (const child of this.childNodes) {
      if (child.nodeType === NodeType.Element)
        return <Element>child
    }
    return null
  }

  /**
   * Returns a {@link HTMLCollection} of all descendant elements 
   * whose qualified name is `qualifiedName`.
   * 
   * @param qualifiedName - the qualified name to match or `*` to match all
   * descendant elements.
   * 
   * @returns an {@link HTMLCollection} of matching descendant
   * elements
   */
  getElementsByTagName(qualifiedName: string): HTMLCollection {
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.listOfElementsWithQualifiedName(qualifiedName, this)
  }

  /**
   * Returns a {@link HTMLCollection} of all descendant elements 
   * whose namespace is `namespace` and local name is `localName`.
   * 
   * @param namespace - the namespace to match or `*` to match any
   * namespace.
   * @param localName - the local name to match or `*` to match any
   * local name.
   * 
   * @returns an {@link HTMLCollection} of matching descendant
   * elements
   */
  getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollection {
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.listOfElementsWithNamespace(namespace, localName, this)
  }

  /**
   * Returns a {@link HTMLCollection} of all descendant elements 
   * whose classes are contained in the list of classes given in 
   * `classNames`.
   * 
   * @param classNames - a space-separated list of classes
   * 
   * @returns an {@link HTMLCollection} of matching descendant
   * elements
   */
  getElementsByClassName(classNames: string): HTMLCollection {
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.listOfElementsWithClassNames(classNames, this)
  }

  /**
   * Returns a new {@link Element} with the given `localName`.
   * 
   * @param localName - local name
   * @param options - element options
   * 
   * @returns the new {@link Element}
   */
  createElement(localName: string, options?: string | { is: string }): Element {

    const algo = globalStore.algorithm as DOMAlgorithmInternal

    /**
     * 1. If localName does not match the Name production, then throw an
     * "InvalidCharacterError" DOMException.
     * 2. If the context object is an HTML document, then set localName to
     * localName in ASCII lowercase.
     * 3. Let is be null.
     * 4. If options is a dictionary and options’s is is present, then set is
     * to it.
     * 5. Let namespace be the HTML namespace, if the context object is an
     * HTML document or context object’s content type is 
     * "application/xhtml+xml", and null otherwise.
     * 6. Return the result of creating an element given the context object, 
     * localName, namespace, null, is, and with the synchronous custom elements 
     * flag set.
     */

    if (!localName.match(XMLSpec.Name))
      throw DOMException.InvalidCharacterError

    // TODO: https://infra.spec.whatwg.org/#ascii-lowercase
    localName = localName.toLowerCase()

    let is: string | null = null
    if (options !== undefined) {
      if (isString(options)) {
        is = options
      } else {
        is = options.is
      }
    }

    let namespace: string | null = null
    if (this._type === "html" || this._contentType === "application/xhtml+xml") {
      namespace = Namespace.HTML
    }

    return algo.createAnElement(this, localName, namespace, null, is, true)
  }

  /**
   * Returns a new {@link Element} with the given `namespace` and
   * `qualifiedName`.
   * 
   * @param namespace - namespace URL
   * @param qualifiedName - qualified name
   * @param options - element options
   * 
   * @returns the new {@link Element}
   */
  createElementNS(namespace: string | null, qualifiedName: string,
    options?: string | { is: string }): Element {

    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.internalCreateElementNS(this, namespace, qualifiedName, options)
  }

  /**
   * Returns a new {@link DocumentFragment}.
   * 
   * @returns the new {@link DocumentFragment}
   */
  createDocumentFragment(): DocumentFragment {
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.createDocumentFragment()
  }

  /**
   * Returns a new {@link Text} with the given `data`.
   * 
   * @param data - text content
   * 
   * @returns the new {@link Text}
   */
  createTextNode(data: string): Text {
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.createTextNode(data)
  }

  /**
   * Returns a new {@link CDATASection} with the given `data`.
   * 
   * @param data - text content
   * 
   * @returns the new {@link CDATASection}
   */
  createCDATASection(data: string): CDATASection {
    /**
     * 1. If context object is an HTML document, then throw a 
     * "NotSupportedError" DOMException.
     * 2. If data contains the string "]]>", then throw an 
     * "InvalidCharacterError" DOMException.
     * 3. Return a new CDATASection node with its data set to data and node
     * document set to the context object.
     */
    if (this._type === "html")
      throw DOMException.NotSupportedError

    if (data.includes(']]>'))
      throw DOMException.InvalidCharacterError

    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.createCDATASection(data)
  }

  /**
   * Returns a new {@link Comment} with the given `data`.
   * 
   * @param data - text content
   * 
   * @returns the new {@link Comment}
   */
  createComment(data: string): Comment {
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.createComment(data)
  }

  /**
   * Returns a new {@link ProcessingInstruction} with the given `target`
   * and `data`.
   * 
   * @param target - instruction target
   * @param data - text content
   * 
   * @returns the new {@link ProcessingInstruction}
   */
  createProcessingInstruction(target: string, data: string): ProcessingInstruction {
    /**
     * 1. If target does not match the Name production, then throw an 
     * "InvalidCharacterError" DOMException.
     * 2. If data contains the string "?>", then throw an 
     * "InvalidCharacterError" DOMException.
     * 3. Return a new ProcessingInstruction node, with target set to target,
     * data set to data, and node document set to the context object.
     */

    if (!target.match(XMLSpec.Name))
      throw DOMException.InvalidCharacterError

    if (data.includes("?>"))
      throw DOMException.InvalidCharacterError

    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.createProcessingInstruction(target, data)
  }

  /**
   * Returns a copy of `node`.
   * 
   * @param deep - true to include descendant nodes.
   * 
   * @returns clone of node
   */
  importNode(node: Node, deep: boolean = false): Node {
    /**
     * 1. If node is a document or shadow root, then throw a "NotSupportedError" DOMException.
     */
    if (Guard.isDocumentNode(node) || Guard.isShadowRoot(node))
      throw DOMException.NotSupportedError

    /**
     * 2. Return a clone of node, with context object and the clone children flag set if deep is true.
     */
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    return algo.cloneNode(node as NodeInternal, this, deep)
  }

  /**
   * Moves `node` from another document into this document and returns
   * it.
   * 
   * @param node - node to move.
   * 
   * @returns the adopted node
   */
  adoptNode(node: Node): Node {
    /**
     * 1. If node is a document, then throw a "NotSupportedError" DOMException.
     */
    if (Guard.isDocumentNode(node))
      throw DOMException.NotSupportedError

    /**
     * 2. If node is a shadow root, then throw a "HierarchyRequestError" DOMException.
     */
    if (Guard.isShadowRoot(node))
      throw DOMException.HierarchyRequestError

    /**
     * 3. Adopt node into the context object.
     * 4. Return node.
     */
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    algo.adoptNode(node as NodeInternal, this)
    return node
  }

  /**
   * Returns a new {@link Attr} with the given `localName`.
   * 
   * @param localName - local name
   * 
   * @returns the new {@link Attr}
   */
  createAttribute(localName: string): Attr {
    /**
     * 1. If localName does not match the Name production in XML, then throw
     * an "InvalidCharacterError" DOMException.
     * 2. If the context object is an HTML document, then set localName to
     * localName in ASCII lowercase.
     * 3. Return a new attribute whose local name is localName and node document
     * is context object.
     */
    if (!localName.match(XMLSpec.Name))
      throw DOMException.InvalidCharacterError

    if(this._type === "html") {
      localName = localName.toLowerCase()
    }

    const algo = globalStore.algorithm as DOMAlgorithmInternal
    const attr = algo.createAttrNode()
    attr._localName = localName
    attr._nodeDocument = this
    return attr
  }

  /**
   * Returns a new {@link Attr} with the given `namespace` and
   * `qualifiedName`.
   * 
   * @param namespace - namespace URL
   * @param qualifiedName - qualified name
   * 
   * @returns the new {@link Attr}
   */
  createAttributeNS(namespace: string, qualifiedName: string): Attr {

    const algo = globalStore.algorithm as DOMAlgorithmInternal

    /**
     * 1. Let namespace, prefix, and localName be the result of passing 
     * namespace and qualifiedName to validate and extract.
     * 2. Return a new attribute whose namespace is namespace, namespace prefix
     * is prefix, local name is localName, and node document is context object.
     */
    const [ns, prefix, localName] = algo.validateAndExtract(namespace, qualifiedName)

    const attr = algo.createAttrNode()
    attr._namespace = ns
    attr._namespacePrefix = prefix
    attr._localName = localName
    attr._nodeDocument = this
    return attr
  }

  /**
   * Creates an event of the type specified.
   * 
   * @param eventInterface - a string representing the type of event 
   * to be created
   */
  createEvent(eventInterface: string): never {
    // TODO: Implementation
    throw DOMException.NotSupportedError
  }

  /**
   * Creates a new Range object.
   */
  createRange(): Range {
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    const range = algo.createRange()
    range._start = [this, 0]
    range._end = [this, 0]
    return range
  }

  /**
   * Creates and returns a new `NodeIterator` object.
   * 
   * @param root - the node to which the iterator is attached.
   * @param whatToShow - a filter on node type.
   * @param filter - a user defined filter.
   */
  createNodeIterator(root: Node, whatToShow: WhatToShow = WhatToShow.All,
    filter: NodeFilter | ((node: Node) => FilterResult) | null = null): NodeIterator {

    /**
     * 1. Let iterator be a new NodeIterator object.
     * 2. Set iterator’s root and iterator’s reference to root.
     * 3. Set iterator’s pointer before reference to true.
     * 4. Set iterator’s whatToShow to whatToShow.
     * 5. Set iterator’s filter to filter.
     * 6. Return iterator.
     */
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    const iterator = algo.createNodeIterator(root as NodeInternal, root as NodeInternal, true)
    iterator._whatToShow = whatToShow
    iterator._iteratorCollection = algo.createNodeList(root as NodeInternal)
    if (isFunction(filter)) {
      iterator._filter = algo.createNodeFilter()
      iterator._filter.acceptNode = filter
    } else {
      iterator._filter = filter
    }
    return iterator
  }

  /**
   * Creates and returns a new `TreeWalker` object.
   * 
   * @param root - the node to which the iterator is attached.
   * @param whatToShow - a filter on node type.
   * @param filter - a user defined filter.
   */
  createTreeWalker(root: Node, whatToShow: WhatToShow = WhatToShow.All,
    filter: NodeFilter | ((node: Node) => FilterResult) | null = null): TreeWalker {
    /**
     * 1. Let walker be a new TreeWalker object.
     * 2. Set walker’s root and walker’s current to root.
     * 3. Set walker’s whatToShow to whatToShow.
     * 4. Set walker’s filter to filter.
     * 5. Return walker.
     */
    const algo = globalStore.algorithm as DOMAlgorithmInternal
    const walker = algo.createTreeWalker(root as NodeInternal, root as NodeInternal)
    walker._whatToShow = whatToShow
    if (isFunction(filter)) {
      walker._filter = algo.createNodeFilter()
      walker._filter.acceptNode = filter
    } else {
      walker._filter = filter
    }
    return walker
  }

  /**
   * Returns a duplicate of this node, i.e., serves as a generic copy 
   * constructor for nodes. The duplicate node has no parent 
   * ({@link parentNode} returns `null`).
   *
   * @param deep - if `true`, recursively clone the subtree under the 
   * specified node. If `false`, clone only the node itself (and its 
   * attributes, if it is an {@link Element}).
   */
  cloneNode(deep: boolean = false): Node {
    const clonedSelf = new DocumentImpl()

    // clone child nodes
    if (deep) {
      for (const child of this.childNodes) {
        const clonedChild = child.cloneNode(deep)
        clonedSelf.appendChild(clonedChild)
      }
    }

    return clonedSelf
  }

  /**
   * Returns the prefix for a given namespace URI, if present, and 
   * `null` if not.
   * 
   * @param namespace - the namespace to search
   */
  lookupPrefix(namespace: string | null): string | null {
    if (!namespace) return null

    if (this.documentElement)
      return this.documentElement.lookupPrefix(namespace)

    return null
  }

  /**
   * Returns the namespace URI for a given prefix if present, and `null`
   * if not.
   * 
   * @param prefix - the prefix to search
   */
  lookupNamespaceURI(prefix: string | null): string | null {
    if (!prefix) prefix = null

    if (this.documentElement)
      return this.documentElement.lookupNamespaceURI(prefix)

    return null
  }

  /**
   * Gets the parent event target for the given event.
   * 
   * @param event - an event
   */
  _getTheParent(event: Event): EventTarget | null {
    if (event.type === "load") {
      return null
    } else {
      return globalStore["window"]
    }
  }

  // MIXIN: NonElementParentNode
  /* istanbul ignore next */
  getElementById(elementId: string): Element | null { throw new Error("Mixin: NonElementParentNode not implemented.") }

  // MIXIN: DocumentOrShadowRoot
  // No elements

  // MIXIN: ParentNode
  /* istanbul ignore next */
  get children(): HTMLCollection { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  get firstElementChild(): Element | null { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  get lastElementChild(): Element | null { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  get childElementCount(): number { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  prepend(...nodes: (Node | string)[]): void { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  append(...nodes: (Node | string)[]): void { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  querySelector(selectors: string): Element | null { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  querySelectorAll(selectors: string): NodeList { throw new Error("Mixin: ParentNode not implemented.") }

}
