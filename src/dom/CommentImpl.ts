import { NodeType, Comment, Document } from "./interfaces"
import { CharacterDataImpl } from "./CharacterDataImpl"
import { idl_defineConst } from "../algorithm/WebIDLAlgorithm"

/**
 * Represents a comment node.
 */
export class CommentImpl extends CharacterDataImpl implements Comment {

  _nodeType = NodeType.Comment

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

/**
 * Initialize prototype properties
 */
idl_defineConst(CommentImpl.prototype, "_nodeType", NodeType.Comment)
