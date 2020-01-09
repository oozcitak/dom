import { Element, NodeType, Attr, Document } from "./interfaces"
import { NodeImpl } from "./NodeImpl"
import { attr_setAnExistingAttributeValue } from "../algorithm"
import { idl_defineConst } from "../algorithm/WebIDLAlgorithm"

/**
 * Represents an attribute of an element node.
 */
export class AttrImpl extends NodeImpl implements Attr {

  _nodeType!: NodeType
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
  specified!: boolean

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
    attr_setAnExistingAttributeValue(this, value)
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
    return (this._namespacePrefix !== null ?
      this._namespacePrefix + ':' + this._localName :
      this._localName)
  }

  /**
   * Creates an `Attr`.
   * 
   * @param document - owner document
   * @param localName - local name
   */
  static _create(document: Document, localName: string): AttrImpl {
    const node = new AttrImpl(localName)
    node._nodeDocument = document
    return node
  }

}

/**
 * Initialize prototype properties
 */
idl_defineConst(AttrImpl.prototype, "_nodeType", NodeType.Attribute)
idl_defineConst(AttrImpl.prototype, "specified", true)
