import { TextImpl } from "./TextImpl"
import { NodeType, CDATASection, Document, Node } from "./interfaces"
import { EmptySet } from "../util"

/**
 * Represents a CDATA node.
 */
export class CDATASectionImpl extends TextImpl implements CDATASection {

  _nodeType: NodeType = NodeType.CData
  _children: Set<Node> = new EmptySet<Node>()

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