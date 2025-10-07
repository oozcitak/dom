import { TextImpl } from "./TextImpl"
import { NodeType, CDATASection, Document } from "./interfaces"
import { idl_defineConst } from "../algorithm/WebIDLAlgorithm"

/**
 * Represents a CDATA node.
 */
export class CDATASectionImpl extends TextImpl implements CDATASection {

  _nodeType = NodeType.CData

  /**
   * Initializes a new instance of `CDATASection`.
   *
   * @param data - node contents
   */
  private constructor(data: string) {
    super(data)
  }

  /**
   * Creates a new `CDATASection`.
   *
   * @param document - owner document
   * @param data - node contents
   */
  static _create(document: Document, data: string = ''): CDATASectionImpl {
    const node = new CDATASectionImpl(data)
    node._nodeDocument = document
    return node
  }

}

/**
 * Initialize prototype properties
 */
idl_defineConst(CDATASectionImpl.prototype, "_nodeType", NodeType.CData)
