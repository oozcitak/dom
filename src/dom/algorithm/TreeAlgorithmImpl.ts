import { TreeAlgorithm, DOMAlgorithm } from './interfaces'
import { ElementInternal, NodeInternal } from '../interfacesInternal'
import { Guard } from '../util'
import { NodeType } from '../interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'

/**
 * Contains tree manipulation algorithms.
 */
export class TreeAlgorithmImpl extends SubAlgorithmImpl implements TreeAlgorithm {

  /**
   * Initializes a new `TreeAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  *getDescendantNodes(node: NodeInternal, self: boolean = false,
    shadow: boolean = false, filter:
      ((childNode: NodeInternal) => any) = () => true):
    IterableIterator<NodeInternal> {

    if (self && filter(node))
      yield node

    // traverse shadow tree
    if (shadow && Guard.isElementNode(node)) {
      if (node.shadowRoot) {
        let child = node.shadowRoot.firstChild as NodeInternal | null
        while (child) {
          yield* this.getDescendantNodes(child, true, shadow, filter)
          child = child.nextSibling as NodeInternal | null
        }
      }
    }

    // traverse child nodes
    let child = node.firstChild as NodeInternal | null
    while (child) {
      yield* this.getDescendantNodes(child, true, shadow, filter)
      child = child.nextSibling as NodeInternal | null
    }
  }

  /** @inheritdoc */
  *getDescendantElements(node: NodeInternal, self: boolean = false,
    shadow: boolean = false, filter:
      ((childNode: ElementInternal) => any) = (() => true)):
    IterableIterator<ElementInternal> {

    for (const child of this.getDescendantNodes(node, self, shadow,
      (node) => { return Guard.isElementNode(node) })) {
      const ele = child as ElementInternal
      if (filter(ele))
        yield ele
    }
  }

  /** @inheritdoc */
  *getSiblingNodes(node: NodeInternal, self: boolean = false,
    filter: ((childNode: NodeInternal) => any) = (() => true)):
    IterableIterator<NodeInternal> {

    if (node.parentNode) {
      let child = node.parentNode.firstChild as NodeInternal | null
      while (child) {
        if (!filter || !!filter(child)) {
          if (child === node) {
            if (self) yield child
          } else {
            yield child
          }
        }
        child = child.nextSibling as NodeInternal | null
      }
    }
  }

  /** @inheritdoc */
  *getAncestorNodes(node: NodeInternal, self: boolean = false,
    filter: ((ancestorNode: NodeInternal) => any) = (() => true)):
    IterableIterator<NodeInternal> {

    if (self && filter(node))
      yield node

    let parent = node.parentNode
    while (parent !== null) {
      if (filter(node))
        yield node
      parent = parent.parentNode
    }
  }

  /** @inheritdoc */
  getFollowingNode(root: NodeInternal, node: NodeInternal): NodeInternal | null {
    if (node.firstChild) {
      return node.firstChild as NodeInternal
    } else if (node.nextSibling) {
      return node.nextSibling as NodeInternal
    } else {
      while (true) {
        const parent = node.parentNode as NodeInternal | null
        if (parent === null || parent === root) {
          return null
        } else if (parent.nextSibling) {
          return parent.nextSibling as NodeInternal
        } else {
          node = parent
        }
      }
    }
  }

  /** @inheritdoc */
  getPrecedingNode(root: NodeInternal, node: NodeInternal): NodeInternal | null {
    if (node === root) {
      return null
    }
    if (node.previousSibling) {
      node = node.previousSibling as NodeInternal
      if (node.lastChild) {
        return node.lastChild as NodeInternal
      } else {
        return node
      }
    } else {
      return node.parentNode as NodeInternal | null
    }
  }

  /**
   * Determines if the node tree is constrained. A node tree is 
   * constrained as follows, expressed as a relationship between the 
   * type of node and its allowed children:
   *  - Document (In tree order)
   *    * Zero or more nodes each of which is ProcessingInstruction 
   *      or Comment.
   *    * Optionally one DocumentType node.
   *    * Zero or more nodes each of which is ProcessingInstruction
   *      or Comment.
   *    * Optionally one Element node.
   *    * Zero or more nodes each of which is ProcessingInstruction
   *      or Comment.
   *  - DocumentFragment, Element
   *    * Zero or more nodes each of which is Element, Text, 
   *      ProcessingInstruction, or Comment.
   *  - DocumentType, Text, ProcessingInstruction, Comment
   *    * None.
   * 
   * @param node - the root of the tree
   */
  isConstrained(node: NodeInternal): boolean {
    switch (node.nodeType) {
      case NodeType.Document:
        let hasDocType = false
        let hasElement = false
        for (const childNode of node.childNodes) {
          switch (childNode.nodeType) {
            case NodeType.ProcessingInstruction:
            case NodeType.Comment:
              break
            case NodeType.DocumentType:
              if (hasDocType || hasElement) return false
              hasDocType = true
              break
            case NodeType.Element:
              if (hasElement) return false
              hasElement = true
              break
            default:
              return false
          }
        }
        break
      case NodeType.DocumentFragment:
      case NodeType.Element:
        for (const childNode of node.childNodes) {
          switch (childNode.nodeType) {
            case NodeType.Element:
            case NodeType.Text:
            case NodeType.ProcessingInstruction:
            case NodeType.CData:
            case NodeType.Comment:
              break
            default:
              return false
          }
        }
        break
      case NodeType.DocumentType:
      case NodeType.Text:
      case NodeType.ProcessingInstruction:
      case NodeType.CData:
      case NodeType.Comment:
        return (!node.hasChildNodes())
    }

    for (const childNode of node.childNodes) {
      // recursively check child nodes
      if (!this.isConstrained(childNode as NodeInternal))
        return false
    }
    return true
  }

  /** @inheritdoc */
  nodeLength(node: NodeInternal): number {
    /**
     * To determine the length of a node node, switch on node:
     * - DocumentType
     * Zero.
     * - Text
     * - ProcessingInstruction
     * - Comment
     * Its data’s length.
     * - Any other node
     * Its number of children.
     */
    if (Guard.isDocumentTypeNode(node)) {
      return 0
    } else if (Guard.isCharacterDataNode(node)) {
      return node._data.length
    } else {
      return node.childNodes.length
    }
  }

  /** @inheritdoc */
  isEmpty(node: NodeInternal): boolean {
    /**
     * A node is considered empty if its length is zero.
     */
    return (this.nodeLength(node) === 0)
  }

  /** @inheritdoc */
  rootNode(node: NodeInternal, shadow = false): NodeInternal {
    /**
     * The root of an object is itself, if its parent is null, or else it is the 
     * root of its parent. The root of a tree is any object participating in 
     * that tree whose parent is null.
     */
    if (shadow) {
      const root = this.rootNode(node, false)
      if (Guard.isShadowRoot(root))
        return this.rootNode(root._host as ElementInternal, true)
      else
        return root
    } else {
      if (!node.parentNode)
        return node
      else
        return this.rootNode(node.parentNode as NodeInternal)
    }
  }

  /** @inheritdoc */
  isDescendantOf(node: NodeInternal, other: NodeInternal,
    self: boolean = false, shadow: boolean = false): boolean {
    /**
     * An object A is called a descendant of an object B, if either A is a 
     * child of B or A is a child of an object C that is a descendant of B.
     * 
     * An inclusive descendant is an object or one of its descendants.
     */
    for (const child of this.getDescendantNodes(node, self, shadow)) {
      if (child === other)
        return true
    }

    return false
  }

  /** @inheritdoc */
  isAncestorOf(node: NodeInternal, other: NodeInternal,
    self: boolean = false, shadow: boolean = false): boolean {
    /**
     * An object A is called an ancestor of an object B if and only if B is a
     * descendant of A.
     * 
     * An inclusive ancestor is an object or one of its ancestors.
     */

    return this.isDescendantOf(other, node, self, shadow)
  }

  /** @inheritdoc */
  isSiblingOf(node: NodeInternal, other: NodeInternal,
    self: boolean = false): boolean {
    /**
     * An object A is called a sibling of an object B, if and only if B and A 
     * share the same non-null parent.
     * 
     * An inclusive sibling is an object or one of its siblings.
     */
    if (node === other) {
      if (self) return true
    } else {
      return (node.parentNode !== null &&
        node.parentNode === other.parentNode)
    }

    return false
  }

  /** @inheritdoc */
  isPreceding(node: NodeInternal, other: NodeInternal): boolean {
    /**
     * An object A is preceding an object B if A and B are in the same tree and 
     * A comes before B in tree order.
     */
    const nodePos = this.treePosition(node)
    const otherPos = this.treePosition(other)

    if (nodePos === -1 || otherPos === -1)
      return false
    else if (this.rootNode(node) !== this.rootNode(other))
      return false
    else
      return otherPos < nodePos
  }

  /** @inheritdoc */
  isFollowing(node: NodeInternal, other: NodeInternal): boolean {
    /**
     * An object A is following an object B if A and B are in the same tree and 
     * A comes after B in tree order.
     */
    const nodePos = this.treePosition(node)
    const otherPos = this.treePosition(other)

    if (nodePos === -1 || otherPos === -1)
      return false
    else if (this.rootNode(node) !== this.rootNode(other))
      return false
    else
      return otherPos > nodePos
  }

  /** @inheritdoc */
  isParentOf(node: NodeInternal, other: NodeInternal): boolean {
    /**
     * An object that participates in a tree has a parent, which is either
     * null or an object, and has children, which is an ordered set of objects.
     * An object A whose parent is object B is a child of B.
     */
    if (node.parentNode === null) {
      return false
    }

    return (node.parentNode === other)
  }

  /** @inheritdoc */
  isChildOf(node: NodeInternal, other: NodeInternal): boolean {
    /**
     * An object that participates in a tree has a parent, which is either
     * null or an object, and has children, which is an ordered set of objects.
     * An object A whose parent is object B is a child of B.
     */
    if (node.parentNode === null || other.parentNode === null) {
      return false
    }

    if (node.parentNode !== other.parentNode) {
      return false
    }

    for (const child of node.childNodes) {
      if (child === other)
        return true
    }

    return false
  }

  /** @inheritdoc */
  previousSibling(node: NodeInternal): NodeInternal | null {
    /**
     * The previous sibling of an object is its first preceding sibling or null 
     * if it has no preceding sibling.
     */
    return node.previousSibling as NodeInternal | null
  }

  /** @inheritdoc */
  nextSibling(node: NodeInternal): NodeInternal | null {
    /**
     * The next sibling of an object is its first following sibling or null 
     * if it has no following sibling.
     */
    return node.nextSibling as NodeInternal | null
  }

  /** @inheritdoc */
  firstChild(node: NodeInternal): NodeInternal | null {
    /**
     * The first child of an object is its first child or null if it has no 
     * children.
     */
    return node.firstChild as NodeInternal | null
  }

  /** @inheritdoc */
  lastChild(node: NodeInternal): NodeInternal | null {
    /**
     * The last child of an object is its last child or null if it has no 
     * children.
     */
    return node.lastChild as NodeInternal | null
  }

  /** @inheritdoc */
  treePosition(node: NodeInternal): number {
    const root = this.rootNode(node)

    let pos = 0
    for (const childNode of this.getDescendantNodes(root)) {
      pos++
      if (childNode === node) return pos
    }

    return -1
  }

  /** @inheritdoc */
  index(node: NodeInternal): number {
    /**
     * The index of an object is its number of preceding siblings, or 0 if it 
     * has none.
     */
    let n = 0

    while (node.previousSibling !== null) {
      n++
      node = node.previousSibling as NodeInternal
    }

    return n
  }

  /** @inheritdoc */
  retarget(a: any, b: any): any {
    /**
     * To retarget an object A against an object B, repeat these steps until
     * they return an object:
     * 1. If one of the following is true
     * - A is not a node
     * - A's root is not a shadow root
     * - B is a node and A's root is a shadow-including inclusive ancestor
     * of B
     * then return A.
     * 2. Set A to A's root's host.
     */

    while (true) {
      if (!a || !Guard.isNode(a)) {
        return a
      }

      const rootOfA = this.rootNode(a)
      if (!Guard.isShadowRoot(rootOfA)) {
        return a
      }

      if (b && Guard.isNode(b) && this.isAncestorOf(rootOfA, b, true, true)) {
        return a
      }

      a = rootOfA.host
    }
  }

}
