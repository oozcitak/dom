import { dom } from "./DOMImpl"
import {
  DOMImplementation, DocumentType, Element, Text, NodeFilter, NodeType, Node,
  HTMLCollection, DocumentFragment, NodeList, WhatToShow, Attr,
  ProcessingInstruction, Comment, CDATASection, NodeIterator, TreeWalker,
  FilterResult, Range, Event, EventTarget, Document
} from "./interfaces"
import {
  NotSupportedError, InvalidCharacterError, HierarchyRequestError
} from "./DOMException"
import { NodeImpl } from "./NodeImpl"
import { Guard } from "../util"
import { isFunction, isString } from "@oozcitak/util"
import { namespace as infraNamespace } from "@oozcitak/infra"
import { urlSerializer } from "@oozcitak/url/lib/URLAlgorithm"
import {
  create_domImplementation, create_documentFragment, create_text,
  create_cdataSection, create_comment, create_processingInstruction,
  create_attr, create_range, create_nodeIterator, create_nodeList,
  create_nodeFilter, create_treeWalker, xml_isName,
  namespace_validateAndExtract, event_createLegacyEvent,
  element_createAnElement, document_internalCreateElementNS, document_adopt,
  node_listOfElementsWithQualifiedName, node_listOfElementsWithNamespace,
  node_listOfElementsWithClassNames, node_clone
} from "../algorithm"
import { idl_defineConst } from "../algorithm/WebIDLAlgorithm"

/**
 * Represents a document node.
 */
export class DocumentImpl extends NodeImpl implements Document {

  _nodeType = NodeType.Document
  _children: any = new Set<Node>()

  _encoding = {
    name: "UTF-8",
    labels: ["unicode-1-1-utf-8", "utf-8", "utf8"]
  }
  _contentType = 'application/xml'
  _URL = {
    scheme: "about",
    username: "",
    password: "",
    host: null,
    port: null,
    path: ["blank"],
    query: null,
    fragment: null,
    _cannotBeABaseURLFlag: true,
    _blobURLEntry: null
  }
  _origin = null
  _type: "xml" | "html" = "xml"
  _mode: "no-quirks" | "quirks" | "limited-quirks" = "no-quirks"

  protected _implementation?: DOMImplementation
  _documentElement = null
  _hasNamespaces = false

  _nodeDocumentOverwrite: Document | null = null
  get _nodeDocument(): Document { return this._nodeDocumentOverwrite || this }
  set _nodeDocument(val: Document) { this._nodeDocumentOverwrite = val }

  /**
   * Initializes a new instance of `Document`.
   */
  public constructor() {
    super()
  }

  /** @inheritdoc */
  get implementation(): DOMImplementation {
    /**
     * The implementation attribute’s getter must return the DOMImplementation
     * object that is associated with the document.
     */
    return this._implementation || (this._implementation = create_domImplementation(this))
  }

  /** @inheritdoc */
  get URL(): string {
    /**
     * The URL attribute’s getter and documentURI attribute’s getter must return
     * the URL, serialized.
     * See: https://url.spec.whatwg.org/#concept-url-serializer
     */
    return urlSerializer(this._URL)
  }

  /** @inheritdoc */
  get documentURI(): string { return this.URL }

  /** @inheritdoc */
  get origin(): string {
    return "null"
  }

  /** @inheritdoc */
  get compatMode(): string {
    /**
     * The compatMode attribute’s getter must return "BackCompat" if context
     * object’s mode is "quirks", and "CSS1Compat" otherwise.
     */
    return this._mode === "quirks" ? "BackCompat" : "CSS1Compat"
  }

  /** @inheritdoc */
  get characterSet(): string {
    /**
     * The characterSet attribute’s getter, charset attribute’s getter, and
     * inputEncoding attribute’s getter, must return context object’s
     * encoding’s name.
     */
    return this._encoding.name
  }

  /** @inheritdoc */
  get charset(): string { return this._encoding.name }

  /** @inheritdoc */
  get inputEncoding(): string { return this._encoding.name }

  /** @inheritdoc */
  get contentType(): string {
    /**
     * The contentType attribute’s getter must return the content type.
     */
    return this._contentType
  }

  /** @inheritdoc */
  get doctype(): DocumentType | null {
    /**
     * The doctype attribute’s getter must return the child of the document
     * that is a doctype, and null otherwise.
     */
    for (const child of this._children) {
      if (Guard.isDocumentTypeNode(child))
        return child
    }
    return null
  }

  /** @inheritdoc */
  get documentElement(): Element | null {
    /**
     * The documentElement attribute’s getter must return the document element.
     */
    return this._documentElement
  }

  /** @inheritdoc */
  getElementsByTagName(qualifiedName: string): HTMLCollection {
    /**
     * The getElementsByTagName(qualifiedName) method, when invoked, must return
     * the list of elements with qualified name qualifiedName for the context object.
     */
    return node_listOfElementsWithQualifiedName(qualifiedName, this)
  }

  /** @inheritdoc */
  getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollection {
    /**
     * The getElementsByTagNameNS(namespace, localName) method, when invoked,
     * must return the list of elements with namespace namespace and local name
     * localName for the context object.
     */
    return node_listOfElementsWithNamespace(namespace, localName, this)
  }

  /** @inheritdoc */
  getElementsByClassName(classNames: string): HTMLCollection {
    /**
     * The getElementsByClassName(classNames) method, when invoked, must return
     * the list of elements with class names classNames for the context object.
     */
    return node_listOfElementsWithClassNames(classNames, this)
  }

  /** @inheritdoc */
  createElement(localName: string, options?: string | { is: string }): Element {
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

    if (!xml_isName(localName))
      throw new InvalidCharacterError()

    if (this._type === "html") localName = localName.toLowerCase()

    let is: string | null = null
    if (options !== undefined) {
      if (isString(options)) {
        is = options
      } else {
        is = options.is
      }
    }

    const namespace =
      (this._type === "html" || this._contentType === "application/xhtml+xml") ?
        infraNamespace.HTML : null

    return element_createAnElement(this, localName, namespace, null,
      is, true)
  }

  /** @inheritdoc */
  createElementNS(namespace: string | null, qualifiedName: string,
    options?: string | { is: string }): Element {
    /**
     * The createElementNS(namespace, qualifiedName, options) method, when
     * invoked, must return the result of running the internal createElementNS
     * steps, given context object, namespace, qualifiedName, and options.
     */
    return document_internalCreateElementNS(this, namespace,
      qualifiedName, options)
  }

  /** @inheritdoc */
  createDocumentFragment(): DocumentFragment {
    /**
     * The createDocumentFragment() method, when invoked, must return a new
     * DocumentFragment node with its node document set to the context object.
     */
    return create_documentFragment(this)
  }

  /** @inheritdoc */
  createTextNode(data: string): Text {
    /**
     * The createTextNode(data) method, when invoked, must return a new Text
     * node with its data set to data and node document set to the context object.
     */
    return create_text(this, data)
  }

  /** @inheritdoc */
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
      throw new NotSupportedError()

    if (data.indexOf(']]>') !== -1)
      throw new InvalidCharacterError()

    return create_cdataSection(this, data)
  }

  /** @inheritdoc */
  createComment(data: string): Comment {
    /**
     * The createComment(data) method, when invoked, must return a new Comment
     * node with its data set to data and node document set to the context object.
     */
    return create_comment(this, data)
  }

  /** @inheritdoc */
  createProcessingInstruction(target: string, data: string): ProcessingInstruction {
    /**
     * 1. If target does not match the Name production, then throw an
     * "InvalidCharacterError" DOMException.
     * 2. If data contains the string "?>", then throw an
     * "InvalidCharacterError" DOMException.
     * 3. Return a new ProcessingInstruction node, with target set to target,
     * data set to data, and node document set to the context object.
     */

    if (!xml_isName(target))
      throw new InvalidCharacterError()

    if (data.indexOf("?>") !== -1)
      throw new InvalidCharacterError()

    return create_processingInstruction(this, target, data)
  }

  /** @inheritdoc */
  importNode(node: Node, deep: boolean = false): Node {
    /**
     * 1. If node is a document or shadow root, then throw a "NotSupportedError" DOMException.
     */
    if (Guard.isDocumentNode(node) || Guard.isShadowRoot(node))
      throw new NotSupportedError()

    /**
     * 2. Return a clone of node, with context object and the clone children flag set if deep is true.
     */
    return node_clone(node, this, deep)
  }

  /** @inheritdoc */
  adoptNode(node: Node): Node {
    /**
     * 1. If node is a document, then throw a "NotSupportedError" DOMException.
     */
    if (Guard.isDocumentNode(node))
      throw new NotSupportedError()

    /**
     * 2. If node is a shadow root, then throw a "HierarchyRequestError" DOMException.
     */
    if (Guard.isShadowRoot(node))
      throw new HierarchyRequestError()

    /**
     * 3. Adopt node into the context object.
     * 4. Return node.
     */
    document_adopt(node, this)
    return node
  }

  /** @inheritdoc */
  createAttribute(localName: string): Attr {
    /**
     * 1. If localName does not match the Name production in XML, then throw
     * an "InvalidCharacterError" DOMException.
     * 2. If the context object is an HTML document, then set localName to
     * localName in ASCII lowercase.
     * 3. Return a new attribute whose local name is localName and node document
     * is context object.
     */
    if (!xml_isName(localName))
      throw new InvalidCharacterError()

    if (this._type === "html") {
      localName = localName.toLowerCase()
    }

    const attr = create_attr(this, localName)
    return attr
  }

  /** @inheritdoc */
  createAttributeNS(namespace: string, qualifiedName: string): Attr {

    /**
     * 1. Let namespace, prefix, and localName be the result of passing
     * namespace and qualifiedName to validate and extract.
     * 2. Return a new attribute whose namespace is namespace, namespace prefix
     * is prefix, local name is localName, and node document is context object.
     */
    const [ns, prefix, localName] = namespace_validateAndExtract(
      namespace, qualifiedName)

    const attr = create_attr(this, localName)
    attr._namespace = ns
    attr._namespacePrefix = prefix
    return attr
  }

  /** @inheritdoc */
  createEvent(eventInterface: string): Event {
    return event_createLegacyEvent(eventInterface)
  }

  /** @inheritdoc */
  createRange(): Range {
    /**
     * The createRange() method, when invoked, must return a new live range
     * with (context object, 0) as its start and end.
     */
    const range = create_range()
    range._start = [this, 0]
    range._end = [this, 0]
    return range
  }

  /** @inheritdoc */
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
    const iterator = create_nodeIterator(root, root, true)
    iterator._whatToShow = whatToShow
    iterator._iteratorCollection = create_nodeList(root)
    if (isFunction(filter)) {
      iterator._filter = create_nodeFilter()
      iterator._filter.acceptNode = filter
    } else {
      iterator._filter = filter
    }
    return iterator
  }

  /** @inheritdoc */
  createTreeWalker(root: Node, whatToShow: WhatToShow = WhatToShow.All,
    filter: NodeFilter | ((node: Node) => FilterResult) | null = null): TreeWalker {
    /**
     * 1. Let walker be a new TreeWalker object.
     * 2. Set walker’s root and walker’s current to root.
     * 3. Set walker’s whatToShow to whatToShow.
     * 4. Set walker’s filter to filter.
     * 5. Return walker.
     */
    const walker = create_treeWalker(root, root)
    walker._whatToShow = whatToShow
    if (isFunction(filter)) {
      walker._filter = create_nodeFilter()
      walker._filter.acceptNode = filter
    } else {
      walker._filter = filter
    }
    return walker
  }

  /**
   * Gets the parent event target for the given event.
   *
   * @param event - an event
   */
  _getTheParent(event: Event): EventTarget | null {
    /**
     * TODO: Implement realms
     * A document’s get the parent algorithm, given an event, returns null if
     * event’s type attribute value is "load" or document does not have a
     * browsing context, and the document’s relevant global object otherwise.
     */
    if (event._type === "load") {
      return null
    } else {
      return dom.window
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

/**
 * Initialize prototype properties
 */
idl_defineConst(DocumentImpl.prototype, "_nodeType", NodeType.Document)
