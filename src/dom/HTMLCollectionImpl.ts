import { Node, Element, HTMLCollection } from "./interfaces"
import { HTMLCollectionInternal, ElementInternal, AttrInternal, NodeInternal } from "./interfacesInternal"
import { globalStore } from "../util"
import { DOMAlgorithm } from "../algorithm/interfaces"
import { namespace as infraNamespace } from '@oozcitak/infra'

/**
 * Represents a collection of elements.
 */
export class HTMLCollectionImpl implements HTMLCollectionInternal {

  _live: boolean = true
  _root: Node
  _filter: ((element: ElementInternal) => any)

  protected static reservedNames = ['_root', '_live', '_filter', 'length',
    'item', 'namedItem', 'get']

  /**
   * Initializes a new instance of `HTMLCollection`.
   * 
   * @param root - root node
   * @param filter - node filter
   */
  private constructor(root: Node, filter: ((element: ElementInternal) => any)) {
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
    for (const node of this) {
      count++
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
    for (const node of this) {
      if (i === index)
        return node
      else
        i++
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

    for (const ele of this) {
      const eleInt = ele as ElementInternal
      if (eleInt._uniqueIdentifier === key) {
        return eleInt
      } else if (eleInt._namespace === infraNamespace.HTML) {
        for (const attr of eleInt._attributeList) {
          const attrInt = attr as AttrInternal
          if (attrInt._localName === "name" && attrInt._namespace === null &&
            attrInt._namespacePrefix === null && attrInt._value === key)
            return eleInt
        }
      }
    }

    return null
  }

  /** @inheritdoc */
  *[Symbol.iterator](): IterableIterator<Element> {
    const algo = globalStore.algorithm as DOMAlgorithm
    yield* algo.tree.getDescendantElements(this._root as NodeInternal, false, false,
      (ele) => { return !!this._filter(ele as ElementInternal) })
  }

  /** @inheritdoc */
  [index: number]: any

  /** @inheritdoc */
  [key: string]: any

  /**
   * Implements a proxy get trap to provide array-like access.
   */
  get(target: HTMLCollection, key: string | symbol, receiver: any): Element | null {
    if (typeof key === 'string' && HTMLCollectionImpl.reservedNames.indexOf(key) === -1) {
      const index = Number(key)
      if (isNaN(Number(index)))
        return target.namedItem(key)
      else
        return target.item(index)
    } else {
      return Reflect.get(target, key, receiver)
    }
  }


  /**
   * Creates a new `HTMLCollection`.
   * 
   * @param root - root node
   * @param filter - node filter
   */
  static _create(root: Node,
    filter: ((element: ElementInternal) => any) = (() => true)): HTMLCollectionInternal {
    return new HTMLCollectionImpl(root, filter)
  }
}
