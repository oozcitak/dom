import { NodeType } from "./interfaces"
import { CharacterDataImpl } from "./CharacterDataImpl"
import { CommentInternal, DocumentInternal } from "./interfacesInternal"

/**
 * Represents a comment node.
 */
export class CommentImpl extends CharacterDataImpl implements CommentInternal {

  _nodeType: NodeType = NodeType.Comment

  /**
   * Initializes a new instance of `Comment`.
   *
   * @param data - the text content
   */
  public constructor(data: string = '') {
    super(data)
  }
 

  /**
   * Creates a new `Comment`.
   * 
   * @param document - owner document
   * @param data - node contents   
   */
  static _create(document: DocumentInternal, data: string = ''): CommentInternal {
    const node = new CommentImpl(data)
    node._nodeDocument = document
    return node
  }

}