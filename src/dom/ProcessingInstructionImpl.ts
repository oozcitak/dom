import { NodeType, ProcessingInstruction, Document } from "./interfaces"
import { CharacterDataImpl } from "./CharacterDataImpl"

/**
 * Represents a processing instruction node.
 */
export class ProcessingInstructionImpl extends CharacterDataImpl implements ProcessingInstruction {

  _nodeType: NodeType = NodeType.ProcessingInstruction

  _target: string = ''

  /**
   * Initializes a new instance of `ProcessingInstruction`.
   */
  private constructor(target: string, data: string) {
    super(data)

    this._target = target
  }

  /** 
   * Gets the target of the {@link ProcessingInstruction} node.
   */
  get target(): string { return this._target }

  /**
   * Creates a new `ProcessingInstruction`.
   * 
   * @param document - owner document
   * @param target - instruction target
   * @param data - node contents
   */
  static _create(document: Document, target: string,
    data: string): ProcessingInstructionImpl {
    const node = new ProcessingInstructionImpl(target, data)
    node._nodeDocument = document
    return node
  }

}