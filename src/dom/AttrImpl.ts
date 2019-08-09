import { Element, NodeType } from "./interfaces"
import { NodeImpl } from "./NodeImpl"
import { AttrInternal, DocumentInternal } from "./interfacesInternal"

/**
 * Represents an attribute of an element node.
 */
export class AttrImpl extends NodeImpl implements AttrInternal {

  _nodeType: NodeType = NodeType.Attribute

  _localName: string
  _namespace: string | null = null
  _namespacePrefix: string | null = null
  _element: Element | null = null
  _value: string = ''

  /**
   * Initializes a new instance of `Attr`.
   * 
   * @param localName - local name
   */
  private constructor(localName: string) {
    super()

    this._localName = localName
  }

  /** @inheritdoc */
  readonly specified: boolean = true

  /** @inheritdoc */
  get ownerElement(): Element | null { return this._element }

  /** @inheritdoc */
  get namespaceURI(): string | null { return this._namespace }

  /** @inheritdoc */
  get prefix(): string | null { return this._namespacePrefix }

  /** @inheritdoc */
  get localName(): string { return this._localName }

  /** @inheritdoc */
  get name(): string { return this._qualifiedName }

  /** @inheritdoc */
  get value(): string { return this._value }
  set value(value: string) { 
    /**
     * The value attribute’s setter must set an existing attribute value with 
     * context object and the given value.
     */
    this._algo.attr.setAnExistingAttributeValue(this, value)
  }

  /** 
   * Returns the qualified name.
   */
  get _qualifiedName(): string {
    /**
     * An attribute’s qualified name is its local name if its namespace prefix 
     * is null, and its namespace prefix, followed by ":", followed by its 
     * local name, otherwise.
     */
    return (this._namespacePrefix ?
      this._namespacePrefix + ':' + this.localName :
      this.localName)
  }

  /**
   * Creates a `Attr`.
   * 
   * @param document - owner document
   * @param localName - local name
   */
  static _create(document: DocumentInternal, localName: string): AttrInternal {
    const node = new AttrImpl(localName)
    node._nodeDocument = document
    return node
  }

}