import { Node, NodeList } from "./interfaces"
import { NodeListInternal } from "./interfacesInternal"
import { globalStore } from "../util"

/**
 * Represents an ordered list of nodes.
 * This is a static implementation of `NodeList`.
 */
export class NodeListStaticImpl implements NodeListInternal {

  _live: boolean = false
  _root: Node
  _filter: ((element: Node) => any)
  _items: Node[] = []
  _length = 0

  /**
   * Initializes a new instance of `NodeList`.
   * 
   * @param root - root node
   */
  private constructor(root: Node) {
    this._root = root
    this._items = []
    this._filter = function (node: Node) { return true }
  }

  /** @inheritdoc */
  get length(): number {
    /**
     * The length attribute must return the number of nodes represented by
     * the collection.
     */
    return this._items.length
  }

  /** @inheritdoc */
  item(index: number): Node | null {
    /**
     * The item(index) method must return the indexth node in the collection. 
     * If there is no indexth node in the collection, then the method must 
     * return null.
     */
    if (index < 0 || index > this.length - 1) return null

    return this._items[index]
  }

  /** @inheritdoc */
  *keys(): IterableIterator<number> {
    for (let index = 0; index < this._items.length; index++) {
      yield index
    }
  }

  /** @inheritdoc */
  *values(): IterableIterator<Node> {
    yield* this
  }

  /** @inheritdoc */
  *entries(): IterableIterator<[number, Node]> {
    let index = 0
    for (const child of this._items) {
      yield [index++, child]
    }
  }

  /** @inheritdoc */
  *[Symbol.iterator](): IterableIterator<Node> {
    for (const node of this._items) {
      yield node
    }
  }

  /** @inheritdoc */
  forEach(callback: (node: Node, index: number, list: NodeList) => any,
    thisArg?: any): void {
    if (thisArg === undefined) {
      thisArg = globalStore.window
    }

    for (const [index, node] of this.entries()) {
      callback.call(thisArg, node, index, this)
    }
  }

  /**
   * Creates a new `NodeList`.
   * 
   * @param root - root node
   * @param items - a list of items to initialize the list
   */
  static _create(root: Node, items: Node[]): NodeListInternal {
    const list = new NodeListStaticImpl(root)
    list._items = items
    return list
  }

}