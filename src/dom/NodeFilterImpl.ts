import { Node, FilterResult, NodeFilter } from "./interfaces"

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

  FILTER_ACCEPT!: number
  FILTER_REJECT!: number
  FILTER_SKIP!: number

  SHOW_ALL!: number
  SHOW_ELEMENT!: number
  SHOW_ATTRIBUTE!: number
  SHOW_TEXT!: number
  SHOW_CDATA_SECTION!: number
  SHOW_ENTITY_REFERENCE!: number
  SHOW_ENTITY!: number
  SHOW_PROCESSING_INSTRUCTION!: number
  SHOW_COMMENT!: number
  SHOW_DOCUMENT!: number
  SHOW_DOCUMENT_TYPE!: number
  SHOW_DOCUMENT_FRAGMENT!: number
  SHOW_NOTATION!: number

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
NodeFilterImpl.prototype.FILTER_ACCEPT = 1
NodeFilterImpl.prototype.FILTER_REJECT = 2
NodeFilterImpl.prototype.FILTER_SKIP = 3

NodeFilterImpl.prototype.SHOW_ALL = 0xffffffff
NodeFilterImpl.prototype.SHOW_ELEMENT = 0x1
NodeFilterImpl.prototype.SHOW_ATTRIBUTE = 0x2
NodeFilterImpl.prototype.SHOW_TEXT = 0x4
NodeFilterImpl.prototype.SHOW_CDATA_SECTION = 0x8
NodeFilterImpl.prototype.SHOW_ENTITY_REFERENCE = 0x10
NodeFilterImpl.prototype.SHOW_ENTITY = 0x20
NodeFilterImpl.prototype.SHOW_PROCESSING_INSTRUCTION = 0x40
NodeFilterImpl.prototype.SHOW_COMMENT = 0x80
NodeFilterImpl.prototype.SHOW_DOCUMENT = 0x100
NodeFilterImpl.prototype.SHOW_DOCUMENT_TYPE = 0x200
NodeFilterImpl.prototype.SHOW_DOCUMENT_FRAGMENT = 0x400
NodeFilterImpl.prototype.SHOW_NOTATION = 0x800
