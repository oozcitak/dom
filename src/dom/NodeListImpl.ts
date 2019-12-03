import { Node, NodeList } from "./interfaces"
import { globalStore } from "../util"

/**
 * Represents an ordered list of nodes.
 */
export class NodeListImpl implements NodeList {

  _live: boolean = true
  _root: Node
  _filter: ((node: Node) => any) | null = null
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
    return this._root._children.size
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
      let node = this._root._firstChild
      while (node !== null && i !== index) {
        node = node._nextSibling
        i++
      }
      return node
    }
    else {
      let i = this.length - 1
      let node = this._root._lastChild
      while (node !== null && i !== index) {
        node = node._previousSibling
        i--
      }
      return node
    }
  }

  /** @inheritdoc */
  keys(): Iterable<number> {
    return {
      [Symbol.iterator]: function(this: NodeListImpl): Iterator<number> {
        let index = 0
    
        return {
          next: function(this: NodeListImpl): IteratorResult<number> {
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
      [Symbol.iterator]: function(this: NodeListImpl): Iterator<Node> {

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
      [Symbol.iterator]: function(this: NodeListImpl): Iterator<[number, Node]> {
        
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
    const it = this._root._children[Symbol.iterator]()

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
   */
  static _create(root: Node): NodeListImpl {
    return new NodeListImpl(root)
  }
}