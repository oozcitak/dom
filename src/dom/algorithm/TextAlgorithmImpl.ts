import { DOMAlgorithm, TextAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { NodeInternal, TextInternal, RangeInternal } from '../interfacesInternal'
import { Guard } from '../util'
import { DOMException } from '../DOMException'

/**
 * Contains text algorithms.
 */
export class TextAlgorithmImpl extends SubAlgorithmImpl implements TextAlgorithm {

  /**
   * Initializes a new `TextAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  *contiguousTextNodes(node: TextInternal, self: boolean = false):
    IterableIterator<TextInternal> {
    /**
     * The contiguous Text nodes of a node node are node, node’s previous
     * sibling Text node, if any, and its contiguous Text nodes, and node’s next
     * sibling Text node, if any, and its contiguous Text nodes, avoiding any
     * duplicates.
     */
    if (self) yield node
    if (node.previousSibling !== null && Guard.isTextNode(node.previousSibling)) {
      yield node.previousSibling
      yield *this.contiguousTextNodes(node.previousSibling)
    }
    if (node.nextSibling !== null && Guard.isTextNode(node.nextSibling)) {
      yield node.nextSibling
      yield *this.contiguousTextNodes(node.nextSibling)
    }
  }

  /** @inheritdoc */
  *contiguousExclusiveTextNodes(node: TextInternal, self: boolean = false):
    IterableIterator<TextInternal> {
    /**
     * The contiguous exclusive Text nodes of a node node are node, node’s 
     * previous sibling exclusive Text node, if any, and its contiguous 
     * exclusive Text nodes, and node’s next sibling exclusive Text node, 
     * if any, and its contiguous exclusive Text nodes, avoiding any duplicates.
     */
    if (self && Guard.isExclusiveTextNode(node)) yield node
    if (node.previousSibling !== null && Guard.isExclusiveTextNode(node.previousSibling)) {
      yield node.previousSibling
      yield *this.contiguousExclusiveTextNodes(node.previousSibling)
    }
    if (node.nextSibling !== null && Guard.isExclusiveTextNode(node.nextSibling)) {
      yield node.nextSibling
      yield *this.contiguousExclusiveTextNodes(node.nextSibling)
    }
  }

  /** @inheritdoc */
  descendantTextContent(node: NodeInternal): string {
    /**
     * The descendant text content of a node node is the concatenation of the 
     * data of all the Text node descendants of node, in tree order.
     */
    let contents = ''
    for (const text of this.dom.tree.getDescendantNodes(node)) {
      if (Guard.isTextNode(text)) {
        contents += text._data
      }
    }
    return contents
  }

  /** @inheritdoc */
  split(node: TextInternal, offset: number): TextInternal {
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError" 
     * DOMException.
     */
    const length = node.data.length
    if (offset > length) {
      throw DOMException.IndexSizeError
    }

    /**
     * 3. Let count be length minus offset.
     * 4. Let new data be the result of substringing data with node node, 
     * offset offset, and count count.
     * 5. Let new node be a new Text node, with the same node document as node. 
     * Set new node’s data to new data.
     * 6. Let parent be node’s parent.
     * 7. If parent is not null, then:
     */
    const count = length - offset
    const newData = this.dom.characterData.substringData(node, offset, count)
    const newNode = this.dom.create.text(node._nodeDocument, newData)
    const parent = node.parentNode
    if (parent !== null) {
      /**
       * 7.1. Insert new node into parent before node’s next sibling.
       */
      this.dom.mutation.insert(newNode, parent as NodeInternal,
        node.nextSibling as NodeInternal | null)

      /**
       * 7.2. For each live range whose start node is node and start offset is
       * greater than offset, set its start node to new node and decrease its
       * start offset by offset.
       * 7.3. For each live range whose end node is node and end offset is greater
       * than offset, set its end node to new node and decrease its end offset
       * by offset.
       * 7.4. For each live range whose start node is parent and start offset is
       * equal to the index of node plus 1, increase its start offset by 1.
       * 7.5. For each live range whose end node is parent and end offset is equal
       * to the index of node plus 1, increase its end offset by 1.
       */
      const doc = node._nodeDocument
      for (const item of doc._rangeList) {
        const range = item as RangeInternal
        if (range._start[0] === node && range._start[1] > offset) {
          range._start[0] = newNode
          range._start[1] -= offset
        }
        if (range._end[0] === node && range._end[1] > offset) {
          range._end[0] = newNode
          range._end[1] -= offset
        }
        const index = this.dom.tree.index(node)
        if (range._start[0] === parent && range._start[1] === index + 1) {
          range._start[1]++
        }
        if (range._end[0] === parent && range._end[1] === index + 1) {
          range._end[1]++
        }
      }
    }

    /**
     * 8. Replace data with node node, offset offset, count count, and data 
     * the empty string.
     * 9. Return new node.
     */
    this.dom.characterData.replaceData(node, offset, count, '')
    return newNode
  }

}
