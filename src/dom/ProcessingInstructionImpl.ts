import { Node, Document, ProcessingInstruction, NodeType } from "./interfaces"
import { CharacterDataImpl } from "./CharacterDataImpl"
import { ProcessingInstructionInternal } from "./interfacesInternal"

/**
 * Represents a processing instruction node.
 */
export class ProcessingInstructionImpl extends CharacterDataImpl implements ProcessingInstructionInternal {

  _target: string = ''

  /**
   * Initializes a new instance of `ProcessingInstruction`.
   */
  private constructor() {
    super()
  }

  /** 
   * Returns the type of node. 
   */
  get nodeType(): NodeType { return NodeType.ProcessingInstruction }

  /** 
   * Returns a string appropriate for the type of node. 
   */
  get nodeName(): string { return this._target }

  /** 
   * Gets the target of the {@link ProcessingInstruction} node.
   */
  get target(): string { return this._target }

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
    const node = new ProcessingInstructionImpl()
    node._data = this._data
    node._target = this._target
    return node
  }

  /**
   * Determines if the given node is equal to this one.
   * 
   * @param node - the node to compare with
   */
  isEqualNode(node: Node | null = null): boolean {
    if (!super.isEqualNode(node))
      return false

    return (this.target === (<ProcessingInstruction>node).target)
  }

  /**
   * Creates a new `ProcessingInstruction`.
   * 
   * @param target - instruction target
   * @param data - node contents
   */
  static _create(target: string, data: string): ProcessingInstructionInternal {
    const node = new ProcessingInstructionImpl()
    node._data = data
    node._target = target
    return node
  }

}