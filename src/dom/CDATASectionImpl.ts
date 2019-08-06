import { Node, NodeType } from "./interfaces"
import { TextImpl } from "./TextImpl"
import { CDATASectionInternal } from "./interfacesInternal"

/**
 * Represents a CDATA node.
 */
export class CDATASectionImpl extends TextImpl implements CDATASectionInternal {
  /**
   * Initializes a new instance of `CDATASection`.
   */
  private constructor() {
    super()
  }

  /** 
   * Returns the type of node. 
   */
  get nodeType(): NodeType { return NodeType.CData }

  /** 
   * Returns a string appropriate for the type of node. 
   */
  get nodeName(): string { return '#cdata-section' }

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
    const node = new CDATASectionImpl()
    node._data = this._data
    return node
  }

  /**
   * Creates a new `CDATASection`.
   */
  static _create(data: string = ''): CDATASectionInternal {
    const node = new CDATASectionImpl()
    node._data = data
    return node
  }

}