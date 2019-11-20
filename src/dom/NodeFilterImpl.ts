import { Node, FilterResult, NodeFilter } from "./interfaces"

/**
 * Represents a node filter.
 */
export class NodeFilterImpl implements NodeFilter {

  readonly FILTER_ACCEPT: number = 1
  readonly FILTER_REJECT: number = 2
  readonly FILTER_SKIP: number = 3

  readonly SHOW_ALL: number = 0xffffffff
  readonly SHOW_ELEMENT: number = 0x1
  readonly SHOW_ATTRIBUTE: number = 0x2
  readonly SHOW_TEXT: number = 0x4
  readonly SHOW_CDATA_SECTION: number = 0x8
  readonly SHOW_ENTITY_REFERENCE: number = 0x10
  readonly SHOW_ENTITY: number = 0x20
  readonly SHOW_PROCESSING_INSTRUCTION: number = 0x40
  readonly SHOW_COMMENT: number = 0x80
  readonly SHOW_DOCUMENT: number = 0x100
  readonly SHOW_DOCUMENT_TYPE: number = 0x200
  readonly SHOW_DOCUMENT_FRAGMENT: number = 0x400
  readonly SHOW_NOTATION: number = 0x800

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