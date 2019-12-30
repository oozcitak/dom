import { Node, FilterResult, NodeFilter } from "./interfaces"

/**
 * Represents a node filter.
 */
export class NodeFilterImpl implements NodeFilter {

  static FILTER_ACCEPT: number = 1
  static FILTER_REJECT: number = 2
  static FILTER_SKIP: number = 3

  static SHOW_ALL: number = 0xffffffff
  static SHOW_ELEMENT: number = 0x1
  static SHOW_ATTRIBUTE: number = 0x2
  static SHOW_TEXT: number = 0x4
  static SHOW_CDATA_SECTION: number = 0x8
  static SHOW_ENTITY_REFERENCE: number = 0x10
  static SHOW_ENTITY: number = 0x20
  static SHOW_PROCESSING_INSTRUCTION: number = 0x40
  static SHOW_COMMENT: number = 0x80
  static SHOW_DOCUMENT: number = 0x100
  static SHOW_DOCUMENT_TYPE: number = 0x200
  static SHOW_DOCUMENT_FRAGMENT: number = 0x400
  static SHOW_NOTATION: number = 0x800

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