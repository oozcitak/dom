import { NodeType, Comment, Document, Node } from "./interfaces"
import { CharacterDataImpl } from "./CharacterDataImpl"

/**
 * Represents a comment node.
 */
export class CommentImpl extends CharacterDataImpl implements Comment {

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
  static _create(document: Document, data: string = ''): CommentImpl {
    const node = new CommentImpl(data)
    node._nodeDocument = document
    return node
  }

}
