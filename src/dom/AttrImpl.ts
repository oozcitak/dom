import { Attr, Node, Element, NodeType } from "./interfaces"
import { NodeImpl } from "./NodeImpl"
import { AttrInternal } from "./interfacesInternal"

/**
 * Represents an attribute of an element node.
 */
export class AttrImpl extends NodeImpl implements AttrInternal {

  _namespace: string | null = null
  _namespacePrefix: string | null = null
  _element: Element | null = null
  _localName: string = ''
  _value: string = ''

  /**
   * Initializes a new instance of `Attr`.
   */
  private constructor() {
    super()
  }

  /** 
   * Always returns true.
   */
  readonly specified: boolean = true

  /** 
   * Returns the type of node. 
   */
  get nodeType(): NodeType { return NodeType.Attribute }

  /** 
   * Returns a string appropriate for the type of node. 
   */
  get nodeName(): string { return this.name }

  /** 
   * Gets the owner element node.
   */
  get ownerElement(): Element | null { return this._element }

  /** 
   * Gets the namespace URI.
   */
  get namespaceURI(): string | null { return this._namespace }

  /** 
   * Gets the namespace prefix.
   */
  get prefix(): string | null { return this._namespacePrefix }

  /** 
   * Gets the local name.
   */
  get localName(): string { return this._localName }

  /** 
   * Gets the qualified name.
   */
  get name(): string { return this._qualifiedName }

  /** 
   * Gets or sets the attribute value.
   */
  get value(): string { return this._value }
  set value(value: string) { this._value = value }

  /** 
   * Gets or sets the data associated with a {@link Attr} node.
   */
  get nodeValue(): string | null { return this._value }
  set nodeValue(value: string | null) { this._value = value || '' }

  /** 
   * Gets or sets the data associated with a {@link Attr} node.
   */
  get textContent(): string | null { return this._value }
  set textContent(value: string | null) { this._value = value || '' }

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
    const attr = new AttrImpl()
    attr._namespace = this._namespace
    attr._namespacePrefix = this._namespacePrefix
    attr._localName = this._localName
    attr._value = this._value

    return attr
  }

  /**
   * Returns the prefix for a given namespace URI, if present, and 
   * `null` if not.
   * 
   * @param namespace - the namespace to search
   */
  lookupPrefix(namespace: string | null): string | null {
    if (!namespace) return null

    if (this.ownerElement)
      return this.ownerElement.lookupPrefix(namespace)

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

    if (this.ownerElement)
      return this.ownerElement.lookupNamespaceURI(prefix)

    return null
  }

  /**
   * Determines if the given node is equal to this one.
   * 
   * @param node - the node to compare with
   */
  isEqualNode(node: Node | null = null): boolean {
    if (!super.isEqualNode(node))
      return false

    const other = <Attr>node
    return (other && this.namespaceURI === other.namespaceURI &&
      this.localName === other.localName &&
      this.value === other.value)
  }

  /** 
   * Returns the qualified name.
   */
  get _qualifiedName(): string  {
    return (this._namespacePrefix ?
      this._namespacePrefix + ':' + this.localName :
      this.localName)
  }

  /**
   * Creates a `Attr`.
   */
  static _create(): AttrInternal {
    return new AttrImpl()
  }

}