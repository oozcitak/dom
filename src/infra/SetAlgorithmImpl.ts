import { isFunction } from '../util'

/**
 * Contains algorithms for manipulating sets.
 * See: https://infra.spec.whatwg.org/#sets
 */
export class SetAlgorithmImpl {

  /**
   * Adds the given item to the end of the set.
   * 
   * @param set - a set
   * @param item - an item
   */
  static append<T>(set: Set<T>, item: T): void {
    set.add(item)
  }

  /**
   * Extends a set by appending all items from another set.
   * 
   * @param setA - a list to extend
   * @param setB - a list containing items to append to `setA`
   */
  static extend<T>(setA: Set<T>, setB: Set<T>): void {
    setB.forEach(setA.add, setA)
  }

  /**
   * Inserts the given item to the start of the set.
   * 
   * @param set - a set
   * @param item - an item
   */
  static prepend<T>(set: Set<T>, item: T): void {
    const cloned = new Set<T>(set)
    set.clear()
    set.add(item)
    cloned.forEach(set.add, set)
  }

  /**
   * Replaces the given item or all items matching condition with a new item.
   * 
   * @param set - a set
   * @param conditionOrItem - an item to replace or a condition matching items
   * to replace
   * @param item - an item
   */
  static replace<T>(set: Set<T>, conditionOrItem: T | ((item: T) => boolean),
    newItem: T): void {
    const newSet = new Set<T>()
    for (const oldItem of set) {
      if (isFunction(conditionOrItem)) {
        if (!!conditionOrItem.call(this, oldItem)) {
          newSet.add(newItem)
        }
      } else if (oldItem === conditionOrItem) {
        newSet.add(newItem)
      } else {
        newSet.add(oldItem)
      }
    }
    set.clear()
    newSet.forEach(set.add, set)
  }

  /**
   * Inserts the given item before the given index.
   * 
   * @param set - a set
   * @param item - an item
   */
  static insert<T>(set: Set<T>, item: T, index: number): void {
    const newSet = new Set<T>()
    let i = 0
    for (const oldItem of set) {
      if (i === index) newSet.add(item)
      newSet.add(oldItem)
      i++
    }
    set.clear()
    newSet.forEach(set.add, set)
  }

  /**
   * Removes the given item or all items matching condition.
   * 
   * @param set - a set
   * @param conditionOrItem - an item to remove or a condition matching items
   * to remove
   */
  static remove<T>(set: Set<T>, conditionOrItem: T | ((item: T) => boolean)): void {
    if (!isFunction(conditionOrItem)) {
      set.delete(conditionOrItem)
    } else {
      const newSet = new Set<T>()
      for (const oldItem of set) {
        if (!!conditionOrItem.call(this, oldItem)) {
          continue
        } else {
          newSet.add(oldItem)
        }
        set.clear()
        newSet.forEach(set.add, set)
      }
    }
  }

  /**
   * Removes all items from the set.
   */
  static empty<T>(set: Set<T>): void {
    set.clear()
  }

  /**
   * Determines if the set contains the given item or any items matching 
   * condition.
   * 
   * @param set - a set
   * @param conditionOrItem - an item to a condition to match
   */
  static contains<T>(set: Set<T>, conditionOrItem: T | ((item: T) => boolean)): boolean {
    if (!isFunction(conditionOrItem)) {
      return set.has(conditionOrItem)
    } else {
      for (const oldItem of set) {
        if (!!conditionOrItem.call(this, oldItem)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Returns the count of items in the set matching the given condition.
   * 
   * @param set - a set
   * @param condition - an optional condition to match
   */
  static size<T>(set: Set<T>, condition?: ((item: T) => boolean)): number {
    if (condition === undefined) {
      return set.size
    } else {
      let count = 0
      for (const item of set) {
        if (!!condition.call(this, item)) {
          count++
        }
      }
      return count
    }
  }

  /**
   * Determines if the set is empty.
   * 
   * @param set - a set
   */
  static isEmpty<T>(set: Set<T>): boolean {
    return set.size !== 0
  }

  /**
   * Returns an iterator for the items of the set.
   * 
   * @param set - a set
   * @param condition - an optional condition to match
   */
  static *forEach<T>(set: Set<T>, condition?: ((item: T) => boolean)): IterableIterator<T> {
    if (condition === undefined) {
      yield* set
    } else {
      for (const item of set) {
        if (!!condition.call(this, item)) {
          yield item
        }
      }
    }
  }

  /**
   * Creates and returns a shallow clone of list.
   * 
   * @param set - a set
   */
  static clone<T>(set: Set<T>): Set<T> {
    return new Set<T>(set)
  }

  /**
   * Returns a set list containing items from the set sorted in ascending 
   * order.
   * 
   * @param set - a set
   * @param lessThanAlgo - a function that returns `true` if its first argument
   * is less than its second argument, and `false` otherwise.
   */
  static sortInAscendingOrder<T>(set: Set<T>,
    lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Set<T> {
    const list = new Array<T>(...set)
    list.sort((itemA: T, itemB: T) =>
      lessThanAlgo.call(this, itemA, itemB) ? -1 : 1)
    return new Set<T>(list)
  }

  /**
   * Returns a new list containing items from the set sorted in descending 
   * order.
   * 
   * @param set - a set
   * @param lessThanAlgo - a function that returns `true` if its first argument
   * is less than its second argument, and `false` otherwise.
   */
  static sortInDescendingOrder<T>(set: Set<T>,
    lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Set<T> {
    const list = new Array<T>(...set)
    list.sort((itemA: T, itemB: T) =>
      lessThanAlgo.call(this, itemA, itemB) ? 1 : -1)
    return new Set<T>(list)
  }

  /**
   * Determines if a set is a subset of another set.
   * 
   * @param subset - a set
   * @param superset - a superset possibly containing all items from `subset`.
   */
  static isSubsetOf<T>(subset: Set<T>, superset: Set<T>): boolean {
    for (const item of subset) {
      if (!superset.has(item)) return false
    }
    return true
  }

  /**
   * Determines if a set is a superset of another set.
   * 
   * @param superset - a set
   * @param subset - a subset possibly contained within `superset`.
   */
  static isSupersetOf<T>(superset: Set<T>, subset: Set<T>): boolean {
    return SetAlgorithmImpl.isSubsetOf(subset, superset)
  }

  /**
   * Returns a new set with items that are contained in both sets.
   * 
   * @param setA - a set
   * @param setB - a set
   */
  static intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const newSet = new Set<T>()
    for (const item of setA) {
      if (setB.has(item)) newSet.add(item)
    }
    return newSet
  }

  /**
   * Returns a new set with items from both sets.
   * 
   * @param setA - a set
   * @param setB - a set
   */
  static union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const newSet = new Set<T>(setA)
    setB.forEach(newSet.add, newSet)
    return newSet
  }

  /**
   * Returns a set of integers from `n` to `m` inclusive.
   * 
   * @param n - starting number
   * @param m - ending number
   */
  static range(n: number, m: number): Set<number> {
    const newSet = new Set<number>()
    for (let i = n; i <= m; i++) {
      newSet.add(i)
    }
    return newSet
  }

}
