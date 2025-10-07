import { Node, NodeType, DocumentType, Document } from "./interfaces"
import { NodeImpl } from "./NodeImpl"
import { idl_defineConst } from "../algorithm/WebIDLAlgorithm"

/**
 * Represents an object providing methods which are not dependent on
 * any particular document
 */
export class DocumentTypeImpl extends NodeImpl implements DocumentType {

  _nodeType = NodeType.DocumentType

  _name: string = ''
  _publicId: string = ''
  _systemId: string = ''

  /**
   * Initializes a new instance of `DocumentType`.
   *
   * @param name - name of the node
   * @param publicId - `PUBLIC` identifier
   * @param systemId - `SYSTEM` identifier
   */
  private constructor(name: string, publicId: string, systemId: string) {
    super()

    this._name = name
    this._publicId = publicId
    this._systemId = systemId
  }

  /** @inheritdoc */
  get name(): string { return this._name }

  /** @inheritdoc */
  get publicId(): string { return this._publicId }

  /** @inheritdoc */
  get systemId(): string { return this._systemId }

  // MIXIN: ChildNode
  /* istanbul ignore next */
  before(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  after(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  replaceWith(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  remove(): void { throw new Error("Mixin: ChildNode not implemented.") }

  /**
   * Creates a new `DocumentType`.
   *
   * @param document - owner document
   * @param name - name of the node
   * @param publicId - `PUBLIC` identifier
   * @param systemId - `SYSTEM` identifier
   */
  static _create(document: Document, name: string, publicId: string = '',
    systemId: string = ''): DocumentTypeImpl {
    const node = new DocumentTypeImpl(name, publicId, systemId)
    node._nodeDocument = document
    return node
  }

}

/**
 * Initialize prototype properties
 */
idl_defineConst(DocumentTypeImpl.prototype, "_nodeType", NodeType.DocumentType)
