import {
  Attr, NamedNodeMap, DOMTokenList, ShadowRoot, NodeType, Node,
  Element, HTMLCollection, NodeList, ShadowRootMode
} from './interfaces'
import { HTMLSpec, XMLSpec } from './spec'
import { NodeImpl } from './NodeImpl'
import { DOMException } from './DOMException'
import {
  ElementInternal, AttrInternal, DocumentInternal, NamedNodeMapInternal, SlotInternal
} from './interfacesInternal'
import { HTMLSlotElement } from '../htmldom/interfaces'
import { infra } from '../infra'
import { AttributeChangeStep, DOMAlgorithm } from './algorithm/interfaces'
import { Guard } from './util'
import { globalStore } from '../util'

/**
 * Represents an element node.
 */
export class ElementImpl extends NodeImpl implements ElementInternal {

  _nodeType: NodeType = NodeType.Element

  _namespace: string | null
  _namespacePrefix: string | null
  _localName: string
  _customElementState: "undefined" | "failed" | "uncustomized" | "custom" = "undefined"
  _customElementDefinition = ElementImpl
  _is: string | null = null

  _shadowRoot: ShadowRoot | null = null

  _attributeList: NamedNodeMap

  _uniqueIdentifier?: string | undefined

  _attributeChangeSteps: AttributeChangeStep[] = []
    
  /**
   * Initializes a new instance of `Element`.
   * 
   * @param document - owner document
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  private constructor(localName: string, namespace: string | null,
    namespacePrefix: string | null) {
    super()

    this._localName = localName
    this._namespace = namespace
    this._namespacePrefix = namespacePrefix
    this._attributeList = this._algo.create.namedNodeMap(this)

    this._attributeChangeSteps.push(this._updateASlotablesName)
    this._attributeChangeSteps.push(this._updateASlotsName)
    this._attributeChangeSteps.push(this._updateAnElementID)
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
    return this._algo.element.getAnAttributeValue(this, "id")
  }
  set id(value: string) {
    this._algo.element.setAnAttributeValue(this, "id", value)
  }

  /** @inheritdoc */
  get className(): string {
    return this._algo.element.getAnAttributeValue(this, "class")
  }
  set className(value: string) {
    this._algo.element.setAnAttributeValue(this, "class", value)
  }

  /** @inheritdoc */
  get classList(): DOMTokenList {
    let attr = this._algo.element.getAnAttributeByName("class", this)
    if (attr === null) {
      attr = this._algo.create.attr(this._nodeDocument, "class")
    }
    return this._algo.create.domTokenList(this, attr)
  }

  /** @inheritdoc */
  get slot(): string {
    return this._algo.element.getAnAttributeValue(this, "slot")
  }
  set slot(value: string) {
    this._algo.element.setAnAttributeValue(this, "slot", value)
  }

  /** @inheritdoc */
  hasAttributes(): boolean {
    return !infra.list.isEmpty(
      (this._attributeList as NamedNodeMapInternal)._attributeList)
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

    for (const attr of this._attributeList) {
      const attrInt = attr as AttrInternal
      names.push(attrInt._qualifiedName)
    }

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
    const attr = this._algo.element.getAnAttributeByName(qualifiedName, this)
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
    const attr = this._algo.element.getAnAttributeByNamespaceAndLocalName(namespace, localName, this)
    return (attr ? attr.value : null)
  }

  /** @inheritdoc */
  setAttribute(qualifiedName: string, value: string): void {
    /**
     * 1. If qualifiedName does not match the Name production in XML, then 
     * throw an "InvalidCharacterError" DOMException.
     */
    if (!XMLSpec.isName(qualifiedName))
      throw DOMException.InvalidCharacterError

    /**
     * 2. If the context object is in the HTML namespace and its node document 
     * is an HTML document, then set qualifiedName to qualifiedName in ASCII 
     * lowercase.
     */
    if (this._namespace === infra.namespace.HTML && this._nodeDocument._type === "html") {
      qualifiedName = qualifiedName.toLowerCase()
    }

    /**
     * 3. Let attribute be the first attribute in context object’s attribute
     * list whose qualified name is qualifiedName, and null otherwise.
     */
    let attribute: AttrInternal | null = null
    for (const attr of this._attributeList) {
      const attrInt = attr as AttrInternal
      if (attrInt._qualifiedName === qualifiedName) {
        attribute = attrInt
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
      attribute = this._algo.create.attr(this._nodeDocument, qualifiedName)
      attribute._value = value
      this._algo.element.append(attribute, this)
      return
    }

    /**
     * 5. Change attribute from context object to value.
     */
    this._algo.element.change(attribute, this, value)
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
      this._algo.namespace.validateAndExtract(namespace, qualifiedName)
    this._algo.element.setAnAttributeValue(this, localName, value,
      prefix, ns)
  }

  /** @inheritdoc */
  removeAttribute(qualifiedName: string): void {
    /**
     * The removeAttribute(qualifiedName) method, when invoked, must remove an
     * attribute given qualifiedName and the context object, and then return 
     * undefined.
     */
    this._algo.element.removeAnAttributeByName(qualifiedName, this)
  }

  /** @inheritdoc */
  removeAttributeNS(namespace: string, localName: string): void {
    /**
     * The removeAttributeNS(namespace, localName) method, when invoked, must 
     * remove an attribute given namespace, localName, and context object, and 
     * then return undefined.
     */
    this._algo.element.removeAnAttributeByNamespaceAndLocalName(namespace,
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
    if (this._namespace === infra.namespace.HTML && this._nodeDocument._type === "html") {
      qualifiedName = qualifiedName.toLowerCase()
    }

    for (const attr of this._attributeList) {
      const attrInt = attr as AttrInternal
      if (attrInt._qualifiedName === qualifiedName) {
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
    if (!XMLSpec.isName(qualifiedName))
      throw DOMException.InvalidCharacterError

    /**
     * 2. If the context object is in the HTML namespace and its node document
     * is an HTML document, then set qualifiedName to qualifiedName in ASCII 
     * lowercase.
     */
    if (this._namespace === infra.namespace.HTML && this._nodeDocument._type === "html") {
      qualifiedName = qualifiedName.toLowerCase()
    }

    /**
     * 3. Let attribute be the first attribute in the context object’s attribute
     * list whose qualified name is qualifiedName, and null otherwise.
     */
    let attribute: AttrInternal | null = null
    for (const attr of this._attributeList) {
      const attrInt = attr as AttrInternal
      if (attrInt._qualifiedName === qualifiedName) {
        attribute = attrInt
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
        attribute = this._algo.create.attr(this._nodeDocument, qualifiedName)
        attribute._value = ''
        this._algo.element.append(attribute, this)
        return true
      }
      return false
    } else if (force === undefined || force === false) {
      /**
       * 5. Otherwise, if force is not given or is false, remove an attribute
       * given qualifiedName and the context object, and then return false.
       */
      this._algo.element.removeAnAttributeByName(qualifiedName, this)
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

    for (const attr of this._attributeList) {
      const attrInt = attr as AttrInternal
      if (attrInt._namespace === ns && attrInt._localName === localName) {
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
    return this._algo.element.getAnAttributeByName(qualifiedName, this)
  }

  /** @inheritdoc */
  getAttributeNodeNS(namespace: string, localName: string): Attr | null {
    /**
     * The getAttributeNodeNS(namespace, localName) method, when invoked, must
     * return the result of getting an attribute given namespace, localName, and
     * the context object.
     */
    return this._algo.element.getAnAttributeByNamespaceAndLocalName(
      namespace, localName, this)
  }

  /** @inheritdoc */
  setAttributeNode(attr: Attr): Attr | null {
    /**
     * The setAttributeNode(attr) and setAttributeNodeNS(attr) methods, when 
     * invoked, must return the result of setting an attribute given attr and 
     * the context object.
     */
    return this._algo.element.setAnAttribute(attr as AttrInternal, this)
  }

  /** @inheritdoc */
  setAttributeNodeNS(attr: Attr): Attr | null {
    return this._algo.element.setAnAttribute(attr as AttrInternal, this)
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
    for (const attribute of this._attributeList) {
      if (attribute === attr) {
        found = true
        break
      }
    }
    if (!found)
      throw DOMException.NotFoundError

    this._algo.element.remove(attr as AttrInternal, this)
    return attr
  }

  /** @inheritdoc */
  attachShadow(init: { mode: ShadowRootMode }): ShadowRoot {
    /**
     * 1. If context object’s namespace is not the HTML namespace, then throw a
     * "NotSupportedError" DOMException.
     */
    if (this._namespace !== infra.namespace.HTML)
      throw DOMException.NotSupportedError

    /**
     * 2. If context object’s local name is not a valid custom element name, 
     * "article", "aside", "blockquote", "body", "div", "footer", "h1", "h2", 
     * "h3", "h4", "h5", "h6", "header", "main" "nav", "p", "section", 
     * or "span", then throw a "NotSupportedError" DOMException.
     */
    if (!HTMLSpec.isValidCustomElementName(this._localName) &&
      !HTMLSpec.isValidShadowHostName(this._localName))
      throw DOMException.NotSupportedError

    /**
     * TODO: 
     * 3. If context object’s local name is a valid custom element name, 
     * or context object’s is value is not null, then:
     * 3.1. Let definition be the result of looking up a custom element 
     * definition given context object’s node document, its namespace, its 
     * local name, and its is value.
     * 3.2. If definition is not null and definition’s disable shadow is true,
     *  then throw a "NotSupportedError" DOMException.
     */

    /**
     * 4. If context object is a shadow host, then throw an "NotSupportedError" 
     * DOMException.
     */
    if (this._shadowRoot !== null)
      throw DOMException.NotSupportedError

    /**
     * 5. Let shadow be a new shadow root whose node document is context 
     * object’s node document, host is context object, and mode is init’s mode.
     * 6. Set context object’s shadow root to shadow.
     * 7. Return shadow.
     */
    const shadow = this._algo.create.shadowRoot(this._nodeDocument, this)
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
     * TODO:
     * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
     * 2. If s is failure, throw a "SyntaxError" DOMException.
     * 3. Let elements be context object’s inclusive ancestors that are 
     * elements, in reverse tree order.
     * 4. For each element in elements, if match a selector against an element,
     * using s, element, and :scope element context object, returns success, 
     * return element. [SELECTORS4]
     * 5. Return null.
     */
    throw DOMException.NotImplementedError
  }

  /** @inheritdoc */
  matches(selectors: string): boolean {
    /**
     * TODO:
     * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
     * 2. If s is failure, throw a "SyntaxError" DOMException.
     * 3. Return true if the result of match a selector against an element, 
     * using s, element, and :scope element context object, returns success,
     * and false otherwise. [SELECTORS4]
     */
    throw DOMException.NotImplementedError
  }

  /** @inheritdoc */
  getElementsByTagName(qualifiedName: string): HTMLCollection {
    /**
     * The getElementsByTagName(qualifiedName) method, when invoked, must return
     * the list of elements with qualified name qualifiedName for context 
     * object.
     */
    return this._algo.node.listOfElementsWithQualifiedName(qualifiedName, this)
  }

  /** @inheritdoc */
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollection {
    /**
     * The getElementsByTagNameNS(namespace, localName) method, when invoked, 
     * must return the list of elements with namespace namespace and local name
     * localName for context object.
     */
    return this._algo.node.listOfElementsWithNamespace(namespace, localName, this)
  }

  /** @inheritdoc */
  getElementsByClassName(classNames: string): HTMLCollection {
    /**
     * The getElementsByClassName(classNames) method, when invoked, must return 
     * the list of elements with class names classNames for context object.
     */
    return this._algo.node.listOfElementsWithClassNames(classNames, this)
  }

  /** @inheritdoc */
  insertAdjacentElement(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend",
    element: Element): Element | null {
    /**
     * The insertAdjacentElement(where, element) method, when invoked, must
     * return the result of running insert adjacent, given context object,
     *  where, and element.
     */
    return this._algo.element.insertAdjacent(this, where,
      element as ElementInternal) as ElementInternal | null
  }

  /** @inheritdoc */
  insertAdjacentText(where: "beforebegin" | "afterbegin" | "beforeend" | "afterend",
    data: string): void {
    /**
     * 1. Let text be a new Text node whose data is data and node document is
     * context object’s node document.
     * 2. Run insert adjacent, given context object, where, and text.
     */
    const text = this._algo.create.text(this._nodeDocument, data)
    this._algo.element.insertAdjacent(this, where, text)
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
      this._namespacePrefix + ':' + this.localName :
      this.localName)
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
    if (this._namespace === infra.namespace.HTML && this._nodeDocument._type === "html") {
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
   * Defines attribute change steps to update a slot’s name.
   */
  private _updateASlotsName(element: ElementInternal, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    /**
     * 1. If element is a slot, localName is name, and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to the
     * empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. Run assign slotables for a tree with element’s root.
     */
    if (Guard.isSlot(element) && localName === "name" && namespace === null) {
      if (value === oldValue) return
      if (value === null && oldValue === '') return
      if (value === '' && oldValue === null) return

      if ((value === null || value === '')) {
        element._name = ''
      } else {
        element._name = value
      }

      const algo = globalStore.algorithm as DOMAlgorithm
      algo.shadowTree.assignSlotablesForATree(algo.tree.rootNode(element))
    }
  }

  /**
   * Defines attribute change steps to update a slotable’s name.
   */
  private _updateASlotablesName(element: ElementInternal, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    /**
     * 1. If localName is slot and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to 
     * the empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. If element is assigned, then run assign slotables for element’s 
     * assigned slot.
     * 1.7. Run assign a slot for element.
     */
    if (Guard.isSlotable(element) && localName === "slot" && namespace === null) {
      if (value === oldValue) return
      if (value === null && oldValue === '') return
      if (value === '' && oldValue === null) return

      if ((value === null || value === '')) {
        element._name = ''
      } else {
        element._name = value
      }

      const algo = globalStore.algorithm as DOMAlgorithm
      if (algo.shadowTree.isAssigned(element)) {
        algo.shadowTree.assignSlotables(element._assignedSlot as SlotInternal)
      }

      algo.shadowTree.assignASlot(element)
    }
  }

  /**
   * Defines attribute change steps to update an element's ID.
   */
  private _updateAnElementID(element: ElementInternal, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    /**
     * 1. If localName is id, namespace is null, and value is null or the empty
     * string, then unset element’s ID.
     * 2. Otherwise, if localName is id, namespace is null, then set element’s
     * ID to value.
     */
    if (localName === "id" && namespace === null) {
      if (!value)
        element._uniqueIdentifier = undefined
      else
        element._uniqueIdentifier = value
    }
  }

  /**
   * Creates a new `Element`.
   * 
   * @param document - owner document
   * @param localName - local name
   * @param namespace - namespace
   * @param prefix - namespace prefix
   */
  static _create(document: DocumentInternal, localName: string,
    namespace: string | null = null,
    namespacePrefix: string | null = null): ElementInternal {
    const node = new ElementImpl(localName, namespace, namespacePrefix)
    node._nodeDocument = document
    return node
  }
}