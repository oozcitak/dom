import { dom } from "./DOMImpl"
import { Node, NodeList } from "./interfaces"
import { isString } from "@oozcitak/util"

/**
 * Represents an ordered list of nodes.
 * This is a static implementation of `NodeList`.
 */
export class NodeListStaticImpl implements NodeList {

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

    return new Proxy<NodeListStaticImpl>(this, this)
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
  [index: number]: Node | undefined

  /** @inheritdoc */
  keys(): Iterable<number> {
    return {
      [Symbol.iterator]: function (this: NodeListStaticImpl): Iterator<number> {
        let index = 0

        return {
          next: function (this: NodeListStaticImpl): IteratorResult<number> {
            if (index === this.length) {
              return { done: true, value: null }
            } else {
              return { done: false, value: index++ }
            }
          }.bind(this)
        }
      }.bind(this)
    }
  }

  /** @inheritdoc */
  values(): Iterable<Node> {
    return {
      [Symbol.iterator]: function (this: NodeListStaticImpl): Iterator<Node> {

        const it = this[Symbol.iterator]()

        return {
          next(): IteratorResult<Node> {
            return it.next()
          }
        }
      }.bind(this)
    }
  }

  /** @inheritdoc */
  entries(): Iterable<[number, Node]> {
    return {
      [Symbol.iterator]: function (this: NodeListStaticImpl): Iterator<[number, Node]> {

        const it = this[Symbol.iterator]()
        let index = 0

        return {
          next(): IteratorResult<[number, Node]> {
            const itResult = it.next()
            if (itResult.done) {
              return { done: true, value: null }
            } else {
              return { done: false, value: [index++, itResult.value] }
            }
          }
        }
      }.bind(this)
    }
  }

  /** @inheritdoc */
  [Symbol.iterator](): Iterator<Node> {
    const it = this._items[Symbol.iterator]()

    return {
      next(): IteratorResult<Node> {
        return it.next()
      }
    }
  }

  /** @inheritdoc */
  forEach(callback: (node: Node, index: number, list: NodeList) => any,
    thisArg?: any): void {
    if (thisArg === undefined) {
      thisArg = dom.window
    }

    let index = 0
    for (const node of this._items) {
      callback.call(thisArg, node, index++, this)
    }
  }

  /**
   * Implements a proxy get trap to provide array-like access.
   */
  get(target: NodeListStaticImpl, key: PropertyKey, receiver: any): Node | undefined {
    if (!isString(key)) {
      return Reflect.get(target, key, receiver)
    }

    const index = Number(key)
    if (isNaN(index)) {
      return Reflect.get(target, key, receiver)
    }

    return target._items[index] || undefined
  }

  /**
   * Implements a proxy set trap to provide array-like access.
   */
  set(target: NodeListStaticImpl, key: PropertyKey, value: Node, receiver: any): boolean {
    if (!isString(key)) {
      return Reflect.set(target, key, value, receiver)
    }

    const index = Number(key)
    if (isNaN(index)) {
      return Reflect.set(target, key, value, receiver)
    }

    if (index >= 0 && index < target._items.length) {
      target._items[index] = value
      return true
    } else {
      return false
    }
  }

  /**
   * Creates a new `NodeList`.
   * 
   * @param root - root node
   * @param items - a list of items to initialize the list
   */
  static _create(root: Node, items: Node[]): NodeListStaticImpl {
    const list = new NodeListStaticImpl(root)
    list._items = items
    return list
  }

}