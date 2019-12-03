import { DOMAlgorithm, RangeAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { 
  Node, AbstractRange, DocumentFragment, CharacterData, Range, BoundaryPoint, 
  BoundaryPosition
} from '../dom/interfaces'
import { DOMException } from '../dom/DOMException'
import { globalStore, Guard } from '../util'
import { ObjectCache } from '@oozcitak/util'

/**
 * Contains range algorithms.
 */
export class RangeAlgorithmImpl extends SubAlgorithmImpl implements RangeAlgorithm {

  /**
   * Initializes a new `RangeAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  collapsed(range: AbstractRange): boolean {
    /**
     * A range is collapsed if its start node is its end node and its start offset is its end offset.
     */
    return (range._startNode === range._endNode && range._startOffset === range._endOffset)
  }

  /** @inheritdoc */
  root(range: AbstractRange): Node {
    /**
     * The root of a live range is the root of its start node.
     */
    return this.dom.tree.rootNode(range._startNode)
  }

  /** @inheritdoc */
  isContained(node: Node, range: AbstractRange): boolean {
    /**
     * A node node is contained in a live range range if node’s root is range’s
     * root, and (node, 0) is after range’s start, and (node, node’s length) is
     * before range’s end.
     */
    return (this.dom.tree.rootNode(node) === this.root(range) &&
      this.dom.boundaryPoint.position([node, 0], range._start) === BoundaryPosition.After &&
      this.dom.boundaryPoint.position([node, this.dom.tree.nodeLength(node)], range._end) === BoundaryPosition.Before)
  }

  /** @inheritdoc */
  isPartiallyContained(node: Node, range: AbstractRange): boolean {
    /**
     * A node is partially contained in a live range if it’s an inclusive
     * ancestor of the live range’s start node but not its end node, 
     * or vice versa.
     */
    const startCheck = this.dom.tree.isAncestorOf(range._startNode, node, true)
    const endCheck = this.dom.tree.isAncestorOf(range._endNode, node, true)

    return (startCheck && !endCheck) || (!startCheck && endCheck)
  }

  /** @inheritdoc */
  setTheStart(range: AbstractRange, node: Node, offset: number): void {
    /**
     * 1. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
     * 2. If offset is greater than node’s length, then throw an "IndexSizeError" 
     * DOMException.
     * 3. Let bp be the boundary point (node, offset).
     * 4. If these steps were invoked as "set the start"
     * 4.1. If bp is after the range’s end, or if range’s root is not equal to
     * node’s root, set range’s end to bp.
     * 4.2. Set range’s start to bp.
     */
    if (Guard.isDocumentTypeNode(node.nodeType)) {
      throw DOMException.InvalidNodeTypeError
    }
    if (offset > this.dom.tree.nodeLength(node)) {
      throw DOMException.IndexSizeError
    }

    const bp: BoundaryPoint = [node, offset]

    if (this.root(range) !== this.dom.tree.rootNode(node) ||
      this.dom.boundaryPoint.position(bp, range._end) === BoundaryPosition.After) {
      range._end = bp
    }

    range._start = bp
  }

  /** @inheritdoc */
  setTheEnd(range: AbstractRange, node: Node, offset: number): void {
    /**
     * 1. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
     * 2. If offset is greater than node’s length, then throw an "IndexSizeError" 
     * DOMException.
     * 3. Let bp be the boundary point (node, offset).
     * 4. If these steps were invoked as "set the end"
     * 4.1. If bp is before the range’s start, or if range’s root is not equal
     * to node’s root, set range’s start to bp.
     * 4.2. Set range’s end to bp.
     */
    if (Guard.isDocumentTypeNode(node.nodeType)) {
      throw DOMException.InvalidNodeTypeError
    }
    if (offset > this.dom.tree.nodeLength(node)) {
      throw DOMException.IndexSizeError
    }

    const bp: BoundaryPoint = [node, offset]

    if (this.root(range) !== this.dom.tree.rootNode(node) ||
      this.dom.boundaryPoint.position(bp, range._start) === BoundaryPosition.Before) {
      range._start = bp
    }

    range._end = bp
  }

  /** @inheritdoc */
  select(node: Node, range: AbstractRange): void {
    /**
     * 1. Let parent be node’s parent.
     * 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
     */
    const parent = node._parent
    if (parent === null)
      throw DOMException.InvalidNodeTypeError

    /**
     * 3. Let index be node’s index.
     * 4. Set range’s start to boundary point (parent, index).
     * 5. Set range’s end to boundary point (parent, index plus 1).
     */
    const index = this.dom.tree.index(node)
    range._start = [parent, index]
    range._end = [parent, index + 1]
  }

  /** @inheritdoc */
  extract(range: AbstractRange): DocumentFragment {
    /**
     * 1. Let fragment be a new DocumentFragment node whose node document is
     * range’s start node’s node document.
     * 2. If range is collapsed, then return fragment.
     */
    const fragment = this.dom.create.documentFragment(range._startNode._nodeDocument)
    if (this.collapsed(range)) return fragment

    /**
     * 3. Let original start node, original start offset, original end node,
     * and original end offset be range’s start node, start offset, end node,
     * and end offset, respectively.
     */
    const originalStartNode = range._startNode
    const originalStartOffset = range._startOffset
    const originalEndNode = range._endNode
    const originalEndOffset = range._endOffset

    /**
     * 4. If original start node is original end node, and they are a Text, 
     * ProcessingInstruction, or Comment node:
     * 4.1. Let clone be a clone of original start node.
     * 4.2. Set the data of clone to the result of substringing data with node
     * original start node, offset original start offset, and count original end
     * offset minus original start offset.
     * 4.3. Append clone to fragment.
     * 4.4. Replace data with node original start node, offset original start
     * offset, count original end offset minus original start offset, and data
     * the empty string.
     * 4.5. Return fragment.
     */
    if (originalStartNode === originalEndNode &&
      Guard.isCharacterDataNode(originalStartNode)) {
      const clone = this.dom.node.clone(originalStartNode) as CharacterData
      clone._data = this.dom.characterData.substringData(
        originalStartNode, originalStartOffset,
        originalEndOffset - originalStartOffset)
      this.dom.mutation.append(clone, fragment)
      this.dom.characterData.replaceData(
        originalStartNode, originalStartOffset,
        originalEndOffset - originalStartOffset, '')
      return fragment
    }

    /**
     * 5. Let common ancestor be original start node.
     * 6. While common ancestor is not an inclusive ancestor of original end
     * node, set common ancestor to its own parent.
     */
    let commonAncestor = originalStartNode
    while(!this.dom.tree.isAncestorOf(originalEndNode, commonAncestor, true)) {
      if (commonAncestor._parent === null) {
        throw new Error("Parent node  is null.")
      }
      commonAncestor = commonAncestor._parent as Node
    }

    /**
     * 7. Let first partially contained child be null.
     * 8. If original start node is not an inclusive ancestor of original end
     * node, set first partially contained child to the first child of common
     * ancestor that is partially contained in range.
     */
    let firstPartiallyContainedChild: Node | null = null
    if (!this.dom.tree.isAncestorOf(originalEndNode, originalStartNode, true)) {
      for (const node of commonAncestor._children) {
        if (this.isPartiallyContained(node as Node, range)) {
          firstPartiallyContainedChild = node as Node
          break
        }
      }
    }

    /**
     * 9. Let last partially contained child be null.
     * 10. If original end node is not an inclusive ancestor of original start
     * node, set last partially contained child to the last child of common
     * ancestor that is partially contained in range.
     */
    let lastPartiallyContainedChild: Node | null = null
    if (!this.dom.tree.isAncestorOf(originalStartNode, originalEndNode, true)) {
      const children = [...commonAncestor._children]
      for (let i = children.length - 1; i > 0; i--) {
        const node = children[i]
        if (this.isPartiallyContained(node as Node, range)) {
          lastPartiallyContainedChild = node as Node
          break
        }
      }
    }

    /**
     * 11. Let contained children be a list of all children of common ancestor
     * that are contained in range, in tree order.
     * 12. If any member of contained children is a doctype, then throw a
     * "HierarchyRequestError" DOMException.
     */
    const containedChildren: Node[] = []
    for (const child of commonAncestor._children) {
      if (this.isContained(child as Node, range)) {
        if (Guard.isDocumentTypeNode(child)) {
          throw DOMException.HierarchyRequestError
        }
        containedChildren.push(child as Node)
      }
    }

    let newNode: Node
    let newOffset: number
    if (this.dom.tree.isAncestorOf(originalEndNode, originalStartNode, true)) {
      /**
       * 13. If original start node is an inclusive ancestor of original end node,
       * set new node to original start node and new offset to original start
       * offset.
       */
      newNode = originalStartNode
      newOffset = originalStartOffset
    } else {
      /**
       * 14. Otherwise:
       * 14.1. Let reference node equal original start node.
       * 14.2. While reference node’s parent is not null and is not an inclusive
       * ancestor of original end node, set reference node to its parent.
       * 14.3. Set new node to the parent of reference node, and new offset to
       * one plus reference node’s index.
       */
      let referenceNode = originalStartNode
      while (referenceNode._parent !== null &&
        !this.dom.tree.isAncestorOf(originalEndNode, referenceNode._parent as Node)) {
        referenceNode = referenceNode._parent as Node
      }
      /* istanbul ignore next */
      if (referenceNode._parent === null) {
        /**
         * If reference node’s parent is null, it would be the root of range, 
         * so would be an inclusive ancestor of original end node, and we could
         * not reach this point.
         */
        throw new Error("Parent node is null.")
      }
      newNode = referenceNode._parent as Node
      newOffset = 1 + this.dom.tree.index(referenceNode)
    }

    if (Guard.isCharacterDataNode(firstPartiallyContainedChild)) {
      /**
       * 15. If first partially contained child is a Text, ProcessingInstruction, 
       * or Comment node:
       * 15.1. Let clone be a clone of original start node.
       * 15.2. Set the data of clone to the result of substringing data with 
       * node original start node, offset original start offset, and count 
       * original start node’s length minus original start offset.
       * 15.3. Append clone to fragment.
       * 15.4. Replace data with node original start node, offset original 
       * start offset, count original start node’s length minus original start 
       * offset, and data the empty string.
       */
      const clone = this.dom.node.clone(originalStartNode) as CharacterData
      clone._data = this.dom.characterData.substringData(
        originalStartNode as CharacterData, originalStartOffset,
        this.dom.tree.nodeLength(originalStartNode) - originalStartOffset)
      this.dom.mutation.append(clone, fragment)
      this.dom.characterData.replaceData(originalStartNode as CharacterData,
        originalStartOffset,
        this.dom.tree.nodeLength(originalStartNode) - originalStartOffset, '')
    } else if (firstPartiallyContainedChild !== null) {
      /**
       * 16. Otherwise, if first partially contained child is not null:
       * 16.1. Let clone be a clone of first partially contained child.
       * 16.2. Append clone to fragment.
       * 16.3. Let subrange be a new live range whose start is (original start
       * node, original start offset) and whose end is (first partially
       * contained child, first partially contained child’s length).
       * 16.4. Let subfragment be the result of extracting subrange.
       * 16.5. Append subfragment to clone.
       */
      const clone = this.dom.node.clone(firstPartiallyContainedChild)
      this.dom.mutation.append(clone, fragment)
      const subrange = this.dom.create.range(
        [originalStartNode, originalStartOffset],
        [firstPartiallyContainedChild, this.dom.tree.nodeLength(firstPartiallyContainedChild)])
      const subfragment = this.extract(subrange)
      this.dom.mutation.append(subfragment, clone)
    }

    /**
     * 17. For each contained child in contained children, append contained
     * child to fragment.
     */
    for (const child of containedChildren) {
      this.dom.mutation.append(child, fragment)
    }

    if (Guard.isCharacterDataNode(lastPartiallyContainedChild)) {
      /**
       * 18. If last partially contained child is a Text, ProcessingInstruction,
       * or Comment node:
       * 18.1. Let clone be a clone of original end node.
       * 18.2. Set the data of clone to the result of substringing data with
       * node original end node, offset 0, and count original end offset.
       * 18.3. Append clone to fragment.
       * 18.4. Replace data with node original end node, offset 0, count
       * original end offset, and data the empty string.
       */
      const clone = this.dom.node.clone(originalEndNode) as CharacterData
      clone._data = this.dom.characterData.substringData(
        originalEndNode as CharacterData, 0, originalEndOffset)
      this.dom.mutation.append(clone, fragment)
      this.dom.characterData.replaceData(originalEndNode as CharacterData,
        0, originalEndOffset, '')
    } else if (lastPartiallyContainedChild !== null) {
      /**
       * 19. Otherwise, if last partially contained child is not null:
       * 19.1. Let clone be a clone of last partially contained child.
       * 19.2. Append clone to fragment.
       * 19.3. Let subrange be a new live range whose start is (last partially
       * contained child, 0) and whose end is (original end node, original
       * end offset).
       * 19.4. Let subfragment be the result of extracting subrange.
       * 19.5. Append subfragment to clone.
       */
      const clone = this.dom.node.clone(lastPartiallyContainedChild)
      this.dom.mutation.append(clone, fragment)
      const subrange = this.dom.create.range(
        [lastPartiallyContainedChild, 0],
        [originalEndNode, originalEndOffset])
      const subfragment = this.extract(subrange)
      this.dom.mutation.append(subfragment, clone)
    }

    /**
     * 20. Set range’s start and end to (new node, new offset).
     */
    range._start = [newNode, newOffset]
    range._end = [newNode, newOffset]

    /**
     * 21. Return fragment.
     */
    return fragment
  }

  /** @inheritdoc */
  cloneTheContents(range: AbstractRange): DocumentFragment {
    /**
     * 1. Let fragment be a new DocumentFragment node whose node document
     * is range’s start node’s node document.
     * 2. If range is collapsed, then return fragment.
     */
    const fragment = this.dom.create.documentFragment(range._startNode._nodeDocument)
    if (this.collapsed(range)) return fragment

    /**
     * 3. Let original start node, original start offset, original end node,
     * and original end offset be range’s start node, start offset, end node,
     * and end offset, respectively.
     * 4. If original start node is original end node, and they are a Text, 
     * ProcessingInstruction, or Comment node:
     * 4.1. Let clone be a clone of original start node.
     * 4.2. Set the data of clone to the result of substringing data with node
     * original start node, offset original start offset, and count original end
     * offset minus original start offset.
     * 4.3. Append clone to fragment.
     * 4.5. Return fragment.
     */
    const originalStartNode = range._startNode
    const originalStartOffset = range._startOffset
    const originalEndNode = range._endNode
    const originalEndOffset = range._endOffset

    if (originalStartNode === originalEndNode &&
      Guard.isCharacterDataNode(originalStartNode)) {
      const clone = this.dom.node.clone(originalStartNode) as CharacterData
      clone._data = this.dom.characterData.substringData(
        originalStartNode, originalStartOffset,
        originalEndOffset - originalStartOffset)
      this.dom.mutation.append(clone, fragment)
    }

    /**
     * 5. Let common ancestor be original start node.
     * 6. While common ancestor is not an inclusive ancestor of original end
     * node, set common ancestor to its own parent.
     */
    let commonAncestor = originalStartNode
    while(!this.dom.tree.isAncestorOf(originalEndNode, commonAncestor, true)) {
      if (commonAncestor._parent === null) {
        throw new Error("Parent node  is null.")
      }
      commonAncestor = commonAncestor._parent as Node
    }

    /**
     * 7. Let first partially contained child be null.
     * 8. If original start node is not an inclusive ancestor of original end
     * node, set first partially contained child to the first child of common
     * ancestor that is partially contained in range.
     */
    let firstPartiallyContainedChild: Node | null = null
    if (!this.dom.tree.isAncestorOf(originalEndNode, originalStartNode, true)) {
      for (const node of commonAncestor._children) {
        if (this.isPartiallyContained(node as Node, range)) {
          firstPartiallyContainedChild = node as Node
          break
        }
      }
    }

    /**
     * 9. Let last partially contained child be null.
     * 10. If original end node is not an inclusive ancestor of original start
     * node, set last partially contained child to the last child of common
     * ancestor that is partially contained in range.
     */
    let lastPartiallyContainedChild: Node | null = null
    if (!this.dom.tree.isAncestorOf(originalStartNode, originalEndNode, true)) {
      const children = [...commonAncestor._children]
      for (let i = children.length - 1; i > 0; i--) {
        const node = children[i]
        if (this.isPartiallyContained(node as Node, range)) {
          lastPartiallyContainedChild = node as Node
          break
        }
      }
    }

    /**
     * 11. Let contained children be a list of all children of common ancestor
     * that are contained in range, in tree order.
     * 12. If any member of contained children is a doctype, then throw a
     * "HierarchyRequestError" DOMException.
     */
    const containedChildren: Node[] = []
    for (const child of commonAncestor._children) {
      if (this.isContained(child as Node, range)) {
        if (Guard.isDocumentTypeNode(child)) {
          throw DOMException.HierarchyRequestError
        }
        containedChildren.push(child as Node)
      }
    }

    if (Guard.isCharacterDataNode(firstPartiallyContainedChild)) {
      /**
       * 13. If first partially contained child is a Text, ProcessingInstruction, 
       * or Comment node:
       * 13.1. Let clone be a clone of original start node.
       * 13.2. Set the data of clone to the result of substringing data with 
       * node original start node, offset original start offset, and count 
       * original start node’s length minus original start offset.
       * 13.3. Append clone to fragment.
       */
      const clone = this.dom.node.clone(originalStartNode) as CharacterData
      clone._data = this.dom.characterData.substringData(
        originalStartNode as CharacterData, originalStartOffset,
        this.dom.tree.nodeLength(originalStartNode) - originalStartOffset)
      this.dom.mutation.append(clone, fragment)
    } else if (firstPartiallyContainedChild !== null) {
      /**
       * 14. Otherwise, if first partially contained child is not null:
       * 14.1. Let clone be a clone of first partially contained child.
       * 14.2. Append clone to fragment.
       * 14.3. Let subrange be a new live range whose start is (original start
       * node, original start offset) and whose end is (first partially
       * contained child, first partially contained child’s length).
       * 14.4. Let subfragment be the result of cloning the contents of
       * subrange.
       * 14.5. Append subfragment to clone.
       */
      const clone = this.dom.node.clone(firstPartiallyContainedChild)
      this.dom.mutation.append(clone, fragment)
      const subrange = this.dom.create.range(
        [originalStartNode, originalStartOffset],
        [firstPartiallyContainedChild, this.dom.tree.nodeLength(firstPartiallyContainedChild)])
      const subfragment = this.cloneTheContents(subrange)
      this.dom.mutation.append(subfragment, clone)
    }

    /**
     * 15. For each contained child in contained children, append contained
     * child to fragment.
     * 15.1. Let clone be a clone of contained child with the clone children
     * flag set.
     * 15.2. Append clone to fragment.
     */
    for (const child of containedChildren) {
      const clone = this.dom.node.clone(child)
      this.dom.mutation.append(clone, fragment)
    }

    if (Guard.isCharacterDataNode(lastPartiallyContainedChild)) {
      /**
       * 16. If last partially contained child is a Text, ProcessingInstruction,
       * or Comment node:
       * 16.1. Let clone be a clone of original end node.
       * 16.2. Set the data of clone to the result of substringing data with
       * node original end node, offset 0, and count original end offset.
       * 16.3. Append clone to fragment.
       */
      const clone = this.dom.node.clone(originalEndNode) as CharacterData
      clone._data = this.dom.characterData.substringData(
        originalEndNode as CharacterData, 0, originalEndOffset)
      this.dom.mutation.append(clone, fragment)
    } else if (lastPartiallyContainedChild !== null) {
      /**
       * 17. Otherwise, if last partially contained child is not null:
       * 17.1. Let clone be a clone of last partially contained child.
       * 17.2. Append clone to fragment.
       * 17.3. Let subrange be a new live range whose start is (last partially
       * contained child, 0) and whose end is (original end node, original
       * end offset).
       * 17.4. Let subfragment be the result of cloning the contents of subrange.
       * 17.5. Append subfragment to clone.
       */
      const clone = this.dom.node.clone(lastPartiallyContainedChild)
      fragment.append(clone)
      const subrange = this.dom.create.range(
        [lastPartiallyContainedChild, 0],
        [originalEndNode, originalEndOffset])
      const subfragment = this.extract(subrange)
      this.dom.mutation.append(subfragment, clone)
    }

    /**
     * 18. Return fragment.
     */
    return fragment
  }

  /** @inheritdoc */
  insert(node: Node, range: AbstractRange): void {
    /**
     * 1. If range’s start node is a ProcessingInstruction or Comment node, is a
     * Text node whose parent is null, or is node, then throw a
     * "HierarchyRequestError" DOMException.
     */
    if (Guard.isProcessingInstructionNode(range._startNode) ||
      Guard.isCommentNode(range._startNode) ||
      (Guard.isTextNode(range._startNode) && range._startNode._parent === null) ||
      range._startNode === node) {
      throw DOMException.HierarchyRequestError
    }

    /**
     * 2. Let referenceNode be null.
     * 3. If range’s start node is a Text node, set referenceNode to that Text
     * node.
     * 4. Otherwise, set referenceNode to the child of start node whose index is
     * start offset, and null if there is no such child.
     */
    let referenceNode: Node | null = null
    if (Guard.isTextNode(range._startNode)) {
      referenceNode = range._startNode
    } else {
      let index = 0
      for (const child of range._startNode._children) {
        if (index === range._startOffset) {
          referenceNode = child as Node
          break
        }
        index++
      }
    }

    /**
     * 5. Let parent be range’s start node if referenceNode is null, and
     * referenceNode’s parent otherwise.
     */
    let parent: Node
    if (referenceNode === null) {
      parent = range._startNode
    } else {
      if (referenceNode._parent === null) {
        throw new Error("Parent node is null.")
      }
      parent = referenceNode._parent as Node
    }

    /**
     * 6. Ensure pre-insertion validity of node into parent before referenceNode.
     */
    this.dom.mutation.ensurePreInsertionValidity(node, parent, referenceNode)

    /**
     * 7. If range’s start node is a Text node, set referenceNode to the result
     * of splitting it with offset range’s start offset.
     */
    if (Guard.isTextNode(range._startNode)) {
      referenceNode = this.dom.text.split(range._startNode, range._startOffset)
    }

    /**
     * 8. If node is referenceNode, set referenceNode to its next sibling.
     */
    if (node === referenceNode) {
      referenceNode = node.nextSibling as Node | null
    }

    /**
     * 9. If node’s parent is not null, remove node from its parent.
     */
    if (node._parent !== null) {
      this.dom.mutation.remove(node, node._parent as Node)
    }

    /**
     * 10. Let newOffset be parent’s length if referenceNode is null, and
     * referenceNode’s index otherwise.
     */
    let newOffset = (referenceNode === null ?
      this.dom.tree.nodeLength(parent) : this.dom.tree.index(referenceNode))

    /**
     * 11. Increase newOffset by node’s length if node is a DocumentFragment
     * node, and one otherwise.
     */
    if (Guard.isDocumentFragmentNode(node)) {
      newOffset += this.dom.tree.nodeLength(node)
    } else {
      newOffset++
    }

    /**
     * 12. Pre-insert node into parent before referenceNode.
     */
    this.dom.mutation.preInsert(node, parent, referenceNode)

    /**
     * 13. If range is collapsed, then set range’s end to (parent, newOffset).
     */
    if (this.collapsed(range)) {
      range._end = [parent, newOffset]
    }
  }

  /** @inheritdoc */
  getContainedNodes(range: Range): Iterable<Node> {   
    return {
      [Symbol.iterator]: function(this: RangeAlgorithmImpl): Iterator<Node> {

        const container = range.commonAncestorContainer as Node
        const it = this.dom.tree.getDescendantNodes(container)[Symbol.iterator]()            
        let currentNode: Node | null = it.next().value
        
        return {
          next: function(this: RangeAlgorithmImpl): IteratorResult<Node> {
            while (currentNode && !this.isContained(currentNode, range)) {
							currentNode = it.next().value
            }
            
            if (currentNode === null) {
              return { done: true, value: null }
            } else {
              const result = { done: false, value: currentNode }
              currentNode = it.next().value
              return result
            }
          }.bind(this)
        }
      }.bind(this)
    }
  }

  /** @inheritdoc */
  getPartiallyContainedNodes(range: Range): Iterable<Node> {   
    return {
      [Symbol.iterator]: function(this: RangeAlgorithmImpl): Iterator<Node> {

        const container = range.commonAncestorContainer as Node
        const it = this.dom.tree.getDescendantNodes(container)[Symbol.iterator]()
        let currentNode: Node | null = it.next().value
        
        return {
          next: function(this: RangeAlgorithmImpl): IteratorResult<Node> {
            while (currentNode && !this.isPartiallyContained(currentNode, range)) {
							currentNode = it.next().value
            }
            
            if (currentNode === null) {
              return { done: true, value: null }
            } else {
              const result = { done: false, value: currentNode }
              currentNode = it.next().value
              return result
            }
          }.bind(this)
        }
      }.bind(this)
    }
  }

  /** @inheritdoc */
  get rangeList(): ObjectCache<Range> {
    return globalStore.window._rangeList
  }

}
