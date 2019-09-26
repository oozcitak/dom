import { DOMObjectCache } from "./interfaces"

/**
 * Represents a cache for DOM objects.
 * 
 * TODO:
 * Since weak references are not yet implemented in EcmaScript,
 * limit the number of items in the cache.
 */
export class DOMObjectCacheImpl<T> implements DOMObjectCache<T> {

  _items: T[] = []

  /**
   * Initializes a new instance of `DOMObjectCache`.
   */
  public constructor() { }

  /** @inheritdoc */
  add(item: T): void {
    this._items.push(item)
  }

  /** @inheritdoc */
  remove(item: T): void {
    const index = this._items.indexOf(item)
    if (index !== -1) this._items.splice(index, 1)
  }

  /** @inheritdoc */
  clear(): void {
    this._items = []
  }

  /** @inheritdoc */
  get length(): number { return this._items.length }

  /** @inheritdoc */
  *entries(): IterableIterator<T> {
    for (const item of this._items) {
      yield item
    }
  }
}
