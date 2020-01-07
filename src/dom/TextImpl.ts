import { NodeType, Text, HTMLSlotElement, Document, Slot, Node } from "./interfaces"
import { CharacterDataImpl } from "./CharacterDataImpl"
import { text_contiguousTextNodes, text_split } from "../algorithm"
import { EmptySet } from "../util"

/**
 * Represents a text node.
 */
export class TextImpl extends CharacterDataImpl implements Text {

  _nodeType: NodeType = NodeType.Text
  _children: Set<Node> = new EmptySet<Node>()

  _name: string = ''
  _assignedSlot: Slot | null = null

  /**
   * Initializes a new instance of `Text`.
   *
   * @param data - the text content
   */
  public constructor(data: string = '') {
    super(data)
  }

  /** @inheritdoc */
  get wholeText(): string {
    /**
     * The wholeText attribute’s getter must return the concatenation of the 
     * data of the contiguous Text nodes of the context object, in tree order.
     */
    let text = ''

    for (const node of text_contiguousTextNodes(this, true)) {
      text = text + node._data
    }

    return text
  }

  /** @inheritdoc */
  splitText(offset: number): Text {
    /**
     * The splitText(offset) method, when invoked, must split context object
     * with offset offset.
     */
    return text_split(this, offset)
  }

  // MIXIN: Slotable
  /* istanbul ignore next */
  get assignedSlot(): HTMLSlotElement | null { throw new Error("Mixin: Slotable not implemented.") }

  /**
   * Creates a `Text`.
   * 
   * @param document - owner document
   * @param data - the text content
   */
  static _create(document: Document, data: string = ''): TextImpl {
    const node = new TextImpl(data)
    node._nodeDocument = document
    return node
  }

}