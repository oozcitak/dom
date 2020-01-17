import { Node, Element, HTMLCollection } from "./interfaces"
import { namespace as infraNamespace } from "@oozcitak/infra"
import { tree_getFirstDescendantNode, tree_getNextDescendantNode, mutation_replace } from "../algorithm"
import { Guard } from "../util"
import { isString } from "@oozcitak/util"

/**
 * Represents a collection of elements.
 */
export class HTMLCollectionImpl implements HTMLCollection {

  _live: boolean = true
  _root: Node
  _filter: ((element: Element) => boolean)

  protected static reservedNames = ['_root', '_live', '_filter', 'length',
    'item', 'namedItem', 'get', 'set']

  /**
   * Initializes a new instance of `HTMLCollection`.
   * 
   * @param root - root node
   * @param filter - node filter
   */
  private constructor(root: Node, filter: ((element: Element) => boolean)) {
    this._root = root
    this._filter = filter

    return new Proxy<HTMLCollectionImpl>(this, this)
  }

  /** @inheritdoc */
  get length(): number {
    /**
     * The length attribute’s getter must return the number of nodes
     * represented by the collection.
     */
    let count = 0
    let node = tree_getFirstDescendantNode(this._root, false, false,
      (e) => Guard.isElementNode(e) && this._filter(e))
    while (node !== null) {
      count++
      node = tree_getNextDescendantNode(this._root, node, false, false,
        (e) => Guard.isElementNode(e) && this._filter(e))
    }
    return count
  }

  /** @inheritdoc */
  item(index: number): Element | null {
    /**
     * The item(index) method, when invoked, must return the indexth element 
     * in the collection. If there is no indexth element in the collection, 
     * then the method must return null.
     */
    let i = 0
    let node = tree_getFirstDescendantNode(this._root, false, false,
      (e) => Guard.isElementNode(e) && this._filter(e)) as Element | null
    while (node !== null) {
      if (i === index)
        return node
      else
        i++

      node = tree_getNextDescendantNode(this._root, node, false, false,
        (e) => Guard.isElementNode(e) && this._filter(e)) as Element | null
    }

    return null
  }

  /** @inheritdoc */
  namedItem(key: string): Element | null {
    /**
     * 1. If key is the empty string, return null.
     * 2. Return the first element in the collection for which at least one of
     * the following is true:
     * - it has an ID which is key;
     * - it is in the HTML namespace and has a name attribute whose value is key;
     * or null if there is no such element.
     */
    if (key === '') return null

    let ele = tree_getFirstDescendantNode(this._root, false, false,
      (e) => Guard.isElementNode(e) && this._filter(e)) as Element | null

    while (ele != null) {
      if (ele._uniqueIdentifier === key) {
        return ele
      } else if (ele._namespace === infraNamespace.HTML) {
        for (let i = 0; i < ele._attributeList._attributeList.length; i++) {
          const attr = ele._attributeList._attributeList[i];
          if (attr._localName === "name" && attr._namespace === null &&
            attr._namespacePrefix === null && attr._value === key)
            return ele
        }
      }

      ele = tree_getNextDescendantNode(this._root, ele, false, false,
        (e) => Guard.isElementNode(e) && this._filter(e)) as Element | null
    }

    return null
  }

  /** @inheritdoc */
  [Symbol.iterator](): Iterator<Element> {
    const root = this._root
    const filter = this._filter
    let currentNode: Element | null = tree_getFirstDescendantNode(root, 
      false, false, (e) => Guard.isElementNode(e) && filter(e)) as Element | null

    return {
      next(): IteratorResult<Element> {
        if (currentNode === null) {
          return { done: true, value: null }
        } else {
          const result = { done: false, value: currentNode }
          currentNode = tree_getNextDescendantNode(root, currentNode,
            false, false, (e) => Guard.isElementNode(e) && filter(e)) as Element | null
          return result
        }
      }
    }
  }

  /** @inheritdoc */
  [index: number]: Element | undefined

  /** @inheritdoc */
  [key: string]: any

  /**
   * Implements a proxy get trap to provide array-like access.
   */
  get(target: HTMLCollection, key: PropertyKey, receiver: any): Element | null | undefined {
    if (!isString(key) || HTMLCollectionImpl.reservedNames.indexOf(key) !== -1) {
      return Reflect.get(target, key, receiver)
    }

    const index = Number(key)
    if (isNaN(index)) {
      return target.namedItem(key) || undefined
    } else {
      return target.item(index) || undefined
    }
  }

  /**
   * Implements a proxy set trap to provide array-like access.
   */
  set(target: HTMLCollection, key: PropertyKey, value: Element, receiver: any): boolean {
    if (!isString(key) || HTMLCollectionImpl.reservedNames.indexOf(key) !== -1) {
      return Reflect.set(target, key, value, receiver)
    }

    const index = Number(key)
    const node = isNaN(index) ?
      target.namedItem(key) || undefined : target.item(index) || undefined
      
    if (node && node._parent) {
      mutation_replace(node, value, node._parent)
      return true
    } else {
      return false
    }
  }

  /**
   * Creates a new `HTMLCollection`.
   * 
   * @param root - root node
   * @param filter - node filter
   */
  static _create(root: Node,
    filter: ((element: Element) => boolean) = (() => true)): HTMLCollectionImpl {
    return new HTMLCollectionImpl(root, filter)
  }
}
