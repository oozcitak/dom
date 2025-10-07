import { Node, FilterResult, NodeFilter } from "./interfaces"
import { idl_defineConst } from "../algorithm/WebIDLAlgorithm"

/**
 * Represents a node filter.
 */
export class NodeFilterImpl implements NodeFilter {

  static FILTER_ACCEPT = 1
  static FILTER_REJECT = 2
  static FILTER_SKIP = 3

  static SHOW_ALL = 0xffffffff
  static SHOW_ELEMENT = 0x1
  static SHOW_ATTRIBUTE = 0x2
  static SHOW_TEXT = 0x4
  static SHOW_CDATA_SECTION = 0x8
  static SHOW_ENTITY_REFERENCE = 0x10
  static SHOW_ENTITY = 0x20
  static SHOW_PROCESSING_INSTRUCTION = 0x40
  static SHOW_COMMENT = 0x80
  static SHOW_DOCUMENT = 0x100
  static SHOW_DOCUMENT_TYPE = 0x200
  static SHOW_DOCUMENT_FRAGMENT = 0x400
  static SHOW_NOTATION = 0x800

  FILTER_ACCEPT = 1
  FILTER_REJECT = 2
  FILTER_SKIP = 3

  SHOW_ALL = 0xffffffff
  SHOW_ELEMENT = 0x1
  SHOW_ATTRIBUTE = 0x2
  SHOW_TEXT = 0x4
  SHOW_CDATA_SECTION = 0x8
  SHOW_ENTITY_REFERENCE = 0x10
  SHOW_ENTITY = 0x20
  SHOW_PROCESSING_INSTRUCTION = 0x40
  SHOW_COMMENT = 0x80
  SHOW_DOCUMENT = 0x100
  SHOW_DOCUMENT_TYPE = 0x200
  SHOW_DOCUMENT_FRAGMENT = 0x400
  SHOW_NOTATION = 0x800

  /**
   * Initializes a new instance of `NodeFilter`.
   */
  private constructor() {

  }

  /**
   * Callback function.
   */
  acceptNode(node: Node): FilterResult {
    return FilterResult.Accept
  }

  /**
   * Creates a new `NodeFilter`.
   */
  static _create(): NodeFilter {
    return new NodeFilterImpl()
  }
}

/**
 * Define constants on prototype.
 */
idl_defineConst(NodeFilterImpl.prototype, "FILTER_ACCEPT", 1)
idl_defineConst(NodeFilterImpl.prototype, "FILTER_REJECT", 2)
idl_defineConst(NodeFilterImpl.prototype, "FILTER_SKIP", 3)

idl_defineConst(NodeFilterImpl.prototype, "SHOW_ALL", 0xffffffff)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_ELEMENT", 0x1)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_ATTRIBUTE", 0x2)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_TEXT", 0x4)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_CDATA_SECTION", 0x8)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_ENTITY_REFERENCE", 0x10)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_ENTITY", 0x20)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_PROCESSING_INSTRUCTION", 0x40)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_COMMENT", 0x80)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT", 0x100)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT_TYPE", 0x200)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_DOCUMENT_FRAGMENT", 0x400)
idl_defineConst(NodeFilterImpl.prototype, "SHOW_NOTATION", 0x800)
