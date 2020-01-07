import {
  Attr, NamedNodeMap, DOMTokenList, ShadowRoot, NodeType, Node, Document,
  Element, HTMLCollection, NodeList, ShadowRootMode, CustomElementDefinition,
  HTMLSlotElement, Slot, AttributeChangeStep
} from "./interfaces"
import { NodeImpl } from "./NodeImpl"
import {
  InvalidCharacterError, NotFoundError, NotSupportedError, NotImplementedError
} from "./DOMException"
import { list as infraList, namespace as infraNamespace } from "@oozcitak/infra"
import {
  create_namedNodeMap, create_attr, create_domTokenList, create_shadowRoot,
  create_text, customElement_isValidCustomElementName,
  customElement_isValidShadowHostName,
  customElement_lookUpACustomElementDefinition, xml_isName,
  namespace_validateAndExtract, element_getAnAttributeValue,
  element_setAnAttributeValue, element_getAnAttributeByName,
  element_getAnAttributeByNamespaceAndLocalName,
  element_append, element_change, element_removeAnAttributeByName,
  element_removeAnAttributeByNamespaceAndLocalName, element_setAnAttribute,
  element_remove, element_insertAdjacent,
  node_listOfElementsWithNamespace, node_listOfElementsWithClassNames,
  node_listOfElementsWithQualifiedName
} from "../algorithm"

/**
 * Represents an element node.
 */
export class ElementImpl extends NodeImpl implements Element {

  _nodeType: NodeType = NodeType.Element
  _children: Set<Node> = new Set<Node>()

  _namespace: string | null = null
  _namespacePrefix: string | null = null
  _localName: string = ""
  _customElementState: "undefined" | "failed" | "uncustomized" | "custom" = "undefined"
  _customElementDefinition: CustomElementDefinition | null = null
  _is: string | null = null

  _shadowRoot: ShadowRoot | null = null

  _attributeList: NamedNodeMap = create_namedNodeMap(this)

  _uniqueIdentifier?: string

  _attributeChangeSteps: AttributeChangeStep[] = []

  _name: string = ''
  _assignedSlot: Slot | null = null

  /**
   * Initializes a new instance of `Element`.
   */
  constructor() {
    super()
  }

  /** @inheritdoc */
  get namespaceURI(): string | null { return this._namespace }

  /** @inheritdoc */
  get prefix(): string | null { return this._namespacePrefix }

  /** @inheritdoc */
  get localName(): string { return this._localName }

  /** @inheritdoc */
  get tagName(): string { return this._htmlUppercasedQualifiedName }

  /** @inheritdoc */
  get id(): string {
    return element_getAnAttributeValue(this, "id")
  }
  set id(value: string) {
    element_setAnAttributeValue(this, "id", value)
  }

  /** @inheritdoc */
  get className(): string {
    return element_getAnAttributeValue(this, "class")
  }
  set className(value: string) {
    element_setAnAttributeValue(this, "class", value)
  }

  /** @inheritdoc */
  get classList(): DOMTokenList {
    let attr = element_getAnAttributeByName("class", this)
    if (attr === null) {
      attr = create_attr(this._nodeDocument, "class")
    }
    return create_domTokenList(this, attr)
  }

  /** @inheritdoc */
  get slot(): string {
    return element_getAnAttributeValue(this, "slot")
  }
  set slot(value: string) {
    element_setAnAttributeValue(this, "slot", value)
  }

  /** @inheritdoc */
  hasAttributes(): boolean {
    return !infraList.isEmpty(this._attributeList._attributeList)
  }

  /** @inheritdoc */
  get attributes(): NamedNodeMap { return this._attributeList }

  /** @inheritdoc */
  getAttributeNames(): string[] {
    /**
     * The getAttributeNames() method, when invoked, must return the qualified 
     * names of the attributes in context object’s attribute list, in order, 
     * and a new list otherwise.
     */
    const names: string[] = []

    this._attributeList._attributeList.forEach(attr => names.push(attr._qualifiedName))

    return names
  }

  /** @inheritdoc */
  getAttribute(qualifiedName: string): string | null {
    /**
     * 1. Let attr be the result of getting an attribute given qualifiedName 
     * and the context object.
     * 2. If attr is null, return null.
     * 3. Return attr’s value.
     */
    const attr = element_getAnAttributeByName(qualifiedName, this)
    return (attr ? attr._value : null)
  }

  /** @inheritdoc */
  getAttributeNS(namespace: string, localName: string): string | null {
    /**
     * 1. Let attr be the result of getting an attribute given namespace, 
     * localName, and the context object.
     * 2. If attr is null, return null.
     * 3. Return attr’s value.
     */
    const attr = element_getAnAttributeByNamespaceAndLocalName(namespace, localName, this)
    return (attr ? attr._value : null)
  }

  /** @inheritdoc */
  setAttribute(qualifiedName: string, value: string): void {
    /**
     * 1. If qualifiedName does not match the Name production in XML, then 
     * throw an "InvalidCharacterError" DOMException.
     */
    if (!xml_isName(qualifiedName))
      throw new InvalidCharacterError()

    /**
     * 2. If the context object is in the HTML namespace and its node document 
     * is an HTML document, then set qualifiedName to qualifiedName in ASCII 
     * lowercase.
     */
    if (this._namespace === infraNamespace.HTML && this._nodeDocument._type === "html") {
      qualifiedName = qualifiedName.toLowerCase()
    }

    /**
     * 3. Let attribute be the first attribute in context object’s attribute
     * list whose qualified name is qualifiedName, and null otherwise.
     */
    let attribute: Attr | null = null
    for (let i = 0; i < this._attributeList._attributeList.length; i++) {
      const attr = this._attributeList._attributeList[i]
      if (attr._qualifiedName === qualifiedName) {
        attribute = attr
        break
      }
    }

    /**
     * 4. If attribute is null, create an attribute whose local name is
     * qualifiedName, value is value, and node document is context object’s 
     * node document, then append this attribute to context object, and 
     * then return.
     */
    if (attribute === null) {
      attribute = create_attr(this._nodeDocument, qualifiedName)
      attribute._value = value
      element_append(attribute, this)
      return
    }

    /**
     * 5. Change attribute from context object to value.
     */
    element_change(attribute, this, value)
  }

  /** @inheritdoc */
  setAttributeNS(namespace: string, qualifiedName: string, value: string): void {
    /**
     * 1. Let namespace, prefix, and localName be the result of passing
     * namespace and qualifiedName to validate and extract.
     * 2. Set an attribute value for the context object using localName, value, 
     * and also prefix and namespace.
     */
    const [ns, prefix, localName] =
      namespace_validateAndExtract(namespace, qualifiedName)
    element_setAnAttributeValue(this, localName, value,
      prefix, ns)
  }

  /** @inheritdoc */
  removeAttribute(qualifiedName: string): void {
    /**
     * The removeAttribute(qualifiedName) method, when invoked, must remove an
     * attribute given qualifiedName and the context object, and then return 
     * undefined.
     */
    element_removeAnAttributeByName(qualifiedName, this)
  }

  /** @inheritdoc */
  removeAttributeNS(namespace: string, localName: string): void {
    /**
     * The removeAttributeNS(namespace, localName) method, when invoked, must 
     * remove an attribute given namespace, localName, and context object, and 
     * then return undefined.
     */
    element_removeAnAttributeByNamespaceAndLocalName(namespace,
      localName, this)
  }

  /** @inheritdoc */
  hasAttribute(qualifiedName: string): boolean {
    /**
     * 1. If the context object is in the HTML namespace and its node document 
     * is an HTML document, then set qualifiedName to qualifiedName in ASCII 
     * lowercase.
     * 2. Return true if the context object has an attribute whose qualified
     * name is qualifiedName, and false otherwise.
     */
    if (this._namespace === infraNamespace.HTML && this._nodeDocument._type === "html") {
      qualifiedName = qualifiedName.toLowerCase()
    }

    for (let i = 0; i < this._attributeList._attributeList.length; i++) {
      const attr = this._attributeList._attributeList[i]
      if (attr._qualifiedName === qualifiedName) {
        return true
      }
    }

    return false
  }

  /** @inheritdoc */
  toggleAttribute(qualifiedName: string, force?: boolean): boolean {
    /**
     * 1. If qualifiedName does not match the Name production in XML, then
     * throw an "InvalidCharacterError" DOMException.
     */
    if (!xml_isName(qualifiedName))
      throw new InvalidCharacterError()

    /**
     * 2. If the context object is in the HTML namespace and its node document
     * is an HTML document, then set qualifiedName to qualifiedName in ASCII 
     * lowercase.
     */
    if (this._namespace === infraNamespace.HTML && this._nodeDocument._type === "html") {
      qualifiedName = qualifiedName.toLowerCase()
    }

    /**
     * 3. Let attribute be the first attribute in the context object’s attribute
     * list whose qualified name is qualifiedName, and null otherwise.
     */
    let attribute: Attr | null = null
    for (let i = 0; i < this._attributeList._attributeList.length; i++) {
      const attr = this._attributeList._attributeList[i]
      if (attr._qualifiedName === qualifiedName) {
        attribute = attr
        break
      }
    }

    if (attribute === null) {
      /**
       * 4. If attribute is null, then:
       * 4.1. If force is not given or is true, create an attribute whose local
       * name is qualifiedName, value is the empty string, and node document is
       * the context object’s node document, then append this attribute to the
       * context object, and then return true.
       * 4.2. Return false.
       */
      if (force === undefined || force === true) {
        attribute = create_attr(this._nodeDocument, qualifiedName)
        attribute._value = ''
        element_append(attribute, this)
        return true
      }
      return false
    } else if (force === undefined || force === false) {
      /**
       * 5. Otherwise, if force is not given or is false, remove an attribute
       * given qualifiedName and the context object, and then return false.
       */
      element_removeAnAttributeByName(qualifiedName, this)
      return false
    }

    /**
     * 6. Return true.
     */
    return true
  }

  /** @inheritdoc */
  hasAttributeNS(namespace: string, localName: string): boolean {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. Return true if the context object has an attribute whose namespace is
     * namespace and local name is localName, and false otherwise.
     */
    const ns = namespace || null

    for (let i = 0; i < this._attributeList._attributeList.length; i++) {
      const attr = this._attributeList._attributeList[i]
      if (attr._namespace === ns && attr._localName === localName) {
        return true
      }
    }

    return false
  }

  /** @inheritdoc */
  getAttributeNode(qualifiedName: string): Attr | null {
    /**
     * The getAttributeNode(qualifiedName) method, when invoked, must return the
     * result of getting an attribute given qualifiedName and context object.
     */
    return element_getAnAttributeByName(qualifiedName, this)
  }

  /** @inheritdoc */
  getAttributeNodeNS(namespace: string, localName: string): Attr | null {
    /**
     * The getAttributeNodeNS(namespace, localName) method, when invoked, must
     * return the result of getting an attribute given namespace, localName, and
     * the context object.
     */
    return element_getAnAttributeByNamespaceAndLocalName(
      namespace, localName, this)
  }

  /** @inheritdoc */
  setAttributeNode(attr: Attr): Attr | null {
    /**
     * The setAttributeNode(attr) and setAttributeNodeNS(attr) methods, when 
     * invoked, must return the result of setting an attribute given attr and 
     * the context object.
     */
    return element_setAnAttribute(attr, this)
  }

  /** @inheritdoc */
  setAttributeNodeNS(attr: Attr): Attr | null {
    return element_setAnAttribute(attr, this)
  }

  /** @inheritdoc */
  removeAttributeNode(attr: Attr): Attr {
    /**
     * 1. If context object’s attribute list does not contain attr, then throw 
     * a "NotFoundError" DOMException.
     * 2. Remove attr from context object.
     * 3. Return attr.
     */
    let found = false
    for (let i = 0; i < this._attributeList._attributeList.length; i++) {
      const attribute = this._attributeList._attributeList[i]
      if (attribute === attr) {
        found = true
        break
      }
    }
    if (!found)
      throw new NotFoundError()

    element_remove(attr, this)
    return attr
  }

  /** @inheritdoc */
  attachShadow(init: { mode: ShadowRootMode }): ShadowRoot {
    /**
     * 1. If context object’s namespace is not the HTML namespace, then throw a
     * "NotSupportedError" DOMException.
     */
    if (this._namespace !== infraNamespace.HTML)
      throw new NotSupportedError()

    /**
     * 2. If context object’s local name is not a valid custom element name, 
     * "article", "aside", "blockquote", "body", "div", "footer", "h1", "h2", 
     * "h3", "h4", "h5", "h6", "header", "main" "nav", "p", "section", 
     * or "span", then throw a "NotSupportedError" DOMException.
     */
    if (!customElement_isValidCustomElementName(this._localName) &&
      !customElement_isValidShadowHostName(this._localName))
      throw new NotSupportedError()

    /**
     * 3. If context object’s local name is a valid custom element name, 
     * or context object’s is value is not null, then:
     * 3.1. Let definition be the result of looking up a custom element 
     * definition given context object’s node document, its namespace, its 
     * local name, and its is value.
     * 3.2. If definition is not null and definition’s disable shadow is true,
     *  then throw a "NotSupportedError" DOMException.
     */
    if (customElement_isValidCustomElementName(this._localName) || this._is !== null) {
      const definition = customElement_lookUpACustomElementDefinition(
        this._nodeDocument, this._namespace, this._localName, this._is)
      if (definition !== null && definition.disableShadow === true) {
        throw new NotSupportedError()
      }
    }

    /**
     * 4. If context object is a shadow host, then throw an "NotSupportedError" 
     * DOMException.
     */
    if (this._shadowRoot !== null)
      throw new NotSupportedError()

    /**
     * 5. Let shadow be a new shadow root whose node document is context 
     * object’s node document, host is context object, and mode is init’s mode.
     * 6. Set context object’s shadow root to shadow.
     * 7. Return shadow.
     */
    const shadow = create_shadowRoot(this._nodeDocument, this)
    shadow._mode = init.mode
    this._shadowRoot = shadow
    return shadow
  }

  /** @inheritdoc */
  get shadowRoot(): ShadowRoot | null {
    /**
     * 1. Let shadow be context object’s shadow root.
     * 2. If shadow is null or its mode is "closed", then return null.
     * 3. Return shadow.
     */
    const shadow = this._shadowRoot
    if (shadow === null || shadow.mode === "closed")
      return null
    else
      return shadow
  }

  /** @inheritdoc */
  closest(selectors: string): Element | null {
    /**
     * TODO: Selectors
     * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
     * 2. If s is failure, throw a "SyntaxError" DOMException.
     * 3. Let elements be context object’s inclusive ancestors that are 
     * elements, in reverse tree order.
     * 4. For each element in elements, if match a selector against an element,
     * using s, element, and :scope element context object, returns success, 
     * return element. [SELECTORS4]
     * 5. Return null.
     */
    throw new NotImplementedError()
  }

  /** @inheritdoc */
  matches(selectors: string): boolean {
    /**
     * TODO: Selectors
     * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
     * 2. If s is failure, throw a "SyntaxError" DOMException.
     * 3. Return true if the result of match a selector against an element, 
     * using s, element, and :scope element context object, returns success,
     * and false otherwise. [SELECTORS4]
     */
    throw new NotImplementedError()
  }

  /** @inheritdoc */
  webkitMatchesSelector(selectors: string): boolean {
    return this.matches(selectors)
  }

  /** @inheritdoc */
  getElementsByTagName(qualifiedName: string): HTMLCollection {
    /**
     * The getElementsByTagName(qualifiedName) method, when invoked, must return
     * the list of elements with qualified name qualifiedName for context 
     * object.
     */
    return node_listOfElementsWithQualifiedName(qualifiedName, this)
  }

  /** @inheritdoc */
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollection {
    /**
     * The getElementsByTagNameNS(namespace, localName) method, when invoked, 
     * must return the list of elements with namespace namespace and local name
     * localName for context object.
     */
    return node_listOfElementsWithNamespace(namespace, localName, this)
  }

  /** @inheritdoc */
  getElementsByClassName(classNames: string): HTMLCollection {
    /**
     * The getElementsByClassName(classNames) method, when invoked, must return 
     * the list of elements with class names classNames for context object.
     */
    return node_listOfElementsWithClassNames(classNames, this)
  }

  /** @inheritdoc */
  insertAdjacentElement(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend",
    element: Element): Element | null {
    /**
     * The insertAdjacentElement(where, element) method, when invoked, must
     * return the result of running insert adjacent, given context object,
     *  where, and element.
     */
    return element_insertAdjacent(this, where, element) as Element | null
  }

  /** @inheritdoc */
  insertAdjacentText(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend",
    data: string): void {
    /**
     * 1. Let text be a new Text node whose data is data and node document is
     * context object’s node document.
     * 2. Run insert adjacent, given context object, where, and text.
     */
    const text = create_text(this._nodeDocument, data)
    element_insertAdjacent(this, where, text)
  }

  /** 
   * Returns the qualified name.
   */
  get _qualifiedName(): string {
    /**
     * An element’s qualified name is its local name if its namespace prefix is 
     * null, and its namespace prefix, followed by ":", followed by its 
     * local name, otherwise.
     */
    return (this._namespacePrefix ?
      this._namespacePrefix + ':' + this._localName :
      this._localName)
  }

  /**
   * Returns the upper-cased qualified name for a html element.
   */
  get _htmlUppercasedQualifiedName(): string {
    /**
     * 1. Let qualifiedName be context object’s qualified name.
     * 2. If the context object is in the HTML namespace and its node document 
     * is an HTML document, then set qualifiedName to qualifiedName in ASCII 
     * uppercase.
     * 3. Return qualifiedName.
     */
    let qualifiedName = this._qualifiedName
    if (this._namespace === infraNamespace.HTML && this._nodeDocument._type === "html") {
      qualifiedName = qualifiedName.toUpperCase()
    }
    return qualifiedName
  }

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

  // MIXIN: NonDocumentTypeChildNode
  /* istanbul ignore next */
  get previousElementSibling(): Element | null { throw new Error("Mixin: NonDocumentTypeChildNode not implemented.") }
  /* istanbul ignore next */
  get nextElementSibling(): Element | null { throw new Error("Mixin: NonDocumentTypeChildNode not implemented.") }

  // MIXIN: ChildNode
  /* istanbul ignore next */
  before(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  after(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  replaceWith(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  remove(): void { throw new Error("Mixin: ChildNode not implemented.") }

  // MIXIN: Slotable
  /* istanbul ignore next */
  get assignedSlot(): HTMLSlotElement | null { throw new Error("Mixin: Slotable not implemented.") }

  /**
   * Creates a new `Element`.
   * 
   * @param document - owner document
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  static _create(document: Document, localName: string,
    namespace: string | null = null,
    namespacePrefix: string | null = null): ElementImpl {

    const node = new ElementImpl()
    node._localName = localName
    node._namespace = namespace
    node._namespacePrefix = namespacePrefix

    node._nodeDocument = document
    return node
  }
}