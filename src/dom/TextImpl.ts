import { NodeType, Text, HTMLSlotElement } from "./interfaces"
import { CharacterDataImpl } from "./CharacterDataImpl"
import { TextInternal, DocumentInternal, SlotInternal } from "./interfacesInternal"

/**
 * Represents a text node.
 */
export class TextImpl extends CharacterDataImpl implements TextInternal {

  _nodeType: NodeType = NodeType.Text

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

    for (const node of this._algo.text.contiguousTextNodes(this, true)) {
      text = text + node.data
    }

    return text
  }

  /** @inheritdoc */
  splitText(offset: number): Text {
    /**
     * The splitText(offset) method, when invoked, must split context object
     * with offset offset.
     */
    return this._algo.text.split(this, offset)
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
  static _create(document: DocumentInternal, data: string = ''): TextInternal {
    const node = new TextImpl(data)
    node._nodeDocument = document
    return node
  }

}