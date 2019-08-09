import { Node, NodeList } from "./interfaces"
import { NodeListInternal } from "./interfacesInternal"

/**
 * Represents an ordered list of nodes.
 */
export class NodeListImpl implements NodeListInternal {

  _live: boolean = true
  _root: Node
  _filter: ((node: Node) => any) = (() => true)
  _length = 0

  /**
   * Initializes a new instance of `NodeList`.
   * 
   * @param root - root node
   */
  private constructor(root: Node) {
    this._root = root
  }

  /** @inheritdoc */
  get length(): number {
    /**
     * The length attribute must return the number of nodes represented 
     * by the collection.
     */
    return this._length
  }

  /** @inheritdoc */
  item(index: number): Node | null {
    /**
     * The item(index) method must return the indexth node in the collection. 
     * If there is no indexth node in the collection, then the method must 
     * return null.
     */
    if (index < 0 || index > this.length - 1) return null

    if (index < this.length / 2) {
      let i = 0
      let node = this._root.firstChild
      while (node !== null && i !== index) {
        node = node.nextSibling
        i++
      }
      return node
    }
    else {
      let i = this.length - 1
      let node = this._root.lastChild
      while (node !== null && i !== index) {
        node = node.previousSibling
        i--
      }
      return node
    }
  }

  /** @inheritdoc */
  *keys(): IterableIterator<number> {
    let index = 0
    for (const child of this) {
      yield index++
    }
  }

  /** @inheritdoc */
  *values(): IterableIterator<Node> {
    yield* this
  }

  /** @inheritdoc */
  *entries(): IterableIterator<[number, Node]> {
    let index = 0
    for (const child of this) {
      yield [index++, child]
    }
  }

  /** @inheritdoc */
  *[Symbol.iterator](): IterableIterator<Node> {
    let child = this._root.firstChild
    while (child) {
      yield child
      child = child.nextSibling
    }
  }

  /** @inheritdoc */
  forEach(callback: (node: Node, index: number, list: NodeList) => any,
    thisArg: any): void {
    for (const [index, node] of this.entries()) {
      callback.call(thisArg, node, index, this)
    }
  }

  /**
   * Creates a new `NodeList`.
   * 
   * @param root - root node
   */
  static _create(root: Node): NodeListInternal {
    return new NodeListImpl(root)
  }
}