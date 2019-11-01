import { Element, Attr, NamedNodeMap } from "./interfaces"
import { DOMException } from "./DOMException"
import { DOMAlgorithm } from "../algorithm/interfaces"
import { globalStore } from "../util"

/**
 * Represents a collection of nodes.
 */
export class NamedNodeMapImpl implements NamedNodeMap {

  private _algo: DOMAlgorithm

  _element: Element
  _attributeList: Attr[] = []

  /**
   * Initializes a new instance of `NamedNodeMap`.
   * 
   * @param element - parent element
   */
  private constructor(element: Element) {
    this._algo = globalStore.algorithm as DOMAlgorithm

    this._element = element as Element
  }

  /** @inheritdoc */
  get length(): number {
    /**
     * The length attribute’s getter must return the attribute list’s size.
     */
    return this._attributeList.length
  }

  /** @inheritdoc */
  item(index: number): Attr | null {
    /**
     * 1. If index is equal to or greater than context object’s attribute list’s
     * size, then return null.
     * 2. Otherwise, return context object’s attribute list[index].
     * 
     */
    return this._attributeList[index] || null
  }

  /** @inheritdoc */
  getNamedItem(qualifiedName: string): Attr | null {
    /**
     * The getNamedItem(qualifiedName) method, when invoked, must return the 
     * result of getting an attribute given qualifiedName and element.
     */
    return this._algo.element.getAnAttributeByName(qualifiedName, this._element)
  }

  /** @inheritdoc */
  getNamedItemNS(namespace: string | null, localName: string): Attr | null {
    /**
     * The getNamedItemNS(namespace, localName) method, when invoked, must 
     * return the result of getting an attribute given namespace, localName, 
     * and element.
     */
    return this._algo.element.getAnAttributeByNamespaceAndLocalName(
      namespace || '', localName, this._element)
  }

  /** @inheritdoc */
  setNamedItem(attr: Attr): Attr | null {
    /**
     * The setNamedItem(attr) and setNamedItemNS(attr) methods, when invoked, 
     * must return the result of setting an attribute given attr and element.
     */
    return this._algo.element.setAnAttribute(attr as Attr, this._element)
  }

  /** @inheritdoc */
  setNamedItemNS(attr: Attr): Attr | null {
    return this._algo.element.setAnAttribute(attr as Attr, this._element)
  }

  /** @inheritdoc */
  removeNamedItem(qualifiedName: string): Attr {
    /**
     * 1. Let attr be the result of removing an attribute given qualifiedName 
     * and element.
     * 2. If attr is null, then throw a "NotFoundError" DOMException.
     * 3. Return attr.
     */
    const attr = this._algo.element.removeAnAttributeByName(qualifiedName, this._element)

    if (attr === null)
      throw DOMException.NotFoundError

    return attr
  }

  /** @inheritdoc */
  removeNamedItemNS(namespace: string | null, localName: string): Attr {
    /**
     * 1. Let attr be the result of removing an attribute given namespace, 
     * localName, and element.
     * 2. If attr is null, then throw a "NotFoundError" DOMException.
     * 3. Return attr.
     */
    const attr = this._algo.element.removeAnAttributeByNamespaceAndLocalName(
      namespace || '', localName, this._element)

    if (attr === null)
      throw DOMException.NotFoundError

    return attr
  }

  /**
   * Returns an iterator for nodes.
   */
  *[Symbol.iterator](): IterableIterator<Attr> {
    yield* this._attributeList
  }

  /**
   * Creates a new `NamedNodeMap`.
   * 
   * @param element - parent element
   */
  static _create(element: Element): NamedNodeMapImpl {
    return new NamedNodeMapImpl(element)
  }
}