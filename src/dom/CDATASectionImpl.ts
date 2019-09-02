import { TextImpl } from "./TextImpl"
import { CDATASectionInternal, DocumentInternal } from "./interfacesInternal"
import { NodeType } from "./interfaces"

/**
 * Represents a CDATA node.
 */
export class CDATASectionImpl extends TextImpl implements CDATASectionInternal {

  _nodeType: NodeType = NodeType.CData

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
  static _create(document: DocumentInternal, data: string = ''): CDATASectionInternal {
    const node = new CDATASectionImpl(data)
    node._nodeDocument = document
    return node
  }

}