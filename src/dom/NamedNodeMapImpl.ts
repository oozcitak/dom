import { Element, Attr, NamedNodeMap } from "./interfaces"
import { NotFoundError } from "./DOMException"
import {
  element_getAnAttributeByName, element_getAnAttributeByNamespaceAndLocalName,
  element_setAnAttribute, element_removeAnAttributeByName,
  element_removeAnAttributeByNamespaceAndLocalName
} from "../algorithm"

/**
 * Represents a collection of attributes.
 */
export class NamedNodeMapImpl extends Array<Attr> implements NamedNodeMap {

  _element: Element

  /**
   * Initializes a new instance of `NamedNodeMap`.
   * 
   * @param element - parent element
   */
  private constructor(element: Element) {
    super()
    this._element = element
    // TODO: This workaround is needed to extend Array in ES5
    Object.setPrototypeOf(this, NamedNodeMapImpl.prototype)
  }

  _asArray(): Array<Attr> { return this }

  /** @inheritdoc */
  item(index: number): Attr | null {
    /**
     * 1. If index is equal to or greater than context object’s attribute list’s
     * size, then return null.
     * 2. Otherwise, return context object’s attribute list[index].
     * 
     */
    return this[index] || null
  }

  /** @inheritdoc */
  getNamedItem(qualifiedName: string): Attr | null {
    /**
     * The getNamedItem(qualifiedName) method, when invoked, must return the 
     * result of getting an attribute given qualifiedName and element.
     */
    return element_getAnAttributeByName(qualifiedName, this._element)
  }

  /** @inheritdoc */
  getNamedItemNS(namespace: string | null, localName: string): Attr | null {
    /**
     * The getNamedItemNS(namespace, localName) method, when invoked, must 
     * return the result of getting an attribute given namespace, localName, 
     * and element.
     */
    return element_getAnAttributeByNamespaceAndLocalName(
      namespace || '', localName, this._element)
  }

  /** @inheritdoc */
  setNamedItem(attr: Attr): Attr | null {
    /**
     * The setNamedItem(attr) and setNamedItemNS(attr) methods, when invoked, 
     * must return the result of setting an attribute given attr and element.
     */
    return element_setAnAttribute(attr, this._element)
  }

  /** @inheritdoc */
  setNamedItemNS(attr: Attr): Attr | null {
    return element_setAnAttribute(attr, this._element)
  }

  /** @inheritdoc */
  removeNamedItem(qualifiedName: string): Attr {
    /**
     * 1. Let attr be the result of removing an attribute given qualifiedName 
     * and element.
     * 2. If attr is null, then throw a "NotFoundError" DOMException.
     * 3. Return attr.
     */
    const attr = element_removeAnAttributeByName(qualifiedName, this._element)

    if (attr === null)
      throw new NotFoundError()

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
    const attr = element_removeAnAttributeByNamespaceAndLocalName(
      namespace || '', localName, this._element)

    if (attr === null)
      throw new NotFoundError()

    return attr
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