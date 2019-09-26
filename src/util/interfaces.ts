import { NodeInternal } from "../dom/interfacesInternal"

/**
 * Represents a cache for DOM objects.
 */
export interface DOMObjectCache<T> {

  /**
   * Adds a new item to the cache.
   * 
   * @param item - an item
   */
  add(item: T): void

  /**
   * Removes an item from the cache.
   * 
   * @param item - an item
   */
  remove(item: T): void

  /**
   * Removes all items from the cache.
   */
  clear(): void

  /**
   * Gets the number of items in the cache.
   */
  readonly length: number

  /**
   * Iterates through the items in the cache.
   */
  entries(): IterableIterator<T>
}
