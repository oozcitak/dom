import { DOMAlgorithm, ListAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { isFunction } from '../../util'

/**
 * Contains attribute algorithms.
 */
export class ListAlgorithmImpl extends SubAlgorithmImpl implements ListAlgorithm {

  /**
   * Initializes a new `ListAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  append<T>(list: Array<T>, item: T): void {
    list.push(item)
  }

  /** @inheritdoc */
  extend<T>(listA: Array<T>, listB: Array<T>): void {
    listA.push(...listB)
  }

  /** @inheritdoc */
  prepend<T>(list: Array<T>, item: T): void {
    list.unshift(item)
  }

  /** @inheritdoc */
  replace<T>(list: Array<T>, conditionOrItem: T | ((item: T) => boolean), newItem: T): void {
    let i = 0
    for (const oldItem of list) {
      if (isFunction(conditionOrItem)) {
        if (!!conditionOrItem.call(this, oldItem)) {
          list[i] = newItem
        }
      } else if (oldItem === conditionOrItem) {
        list[i] = newItem
        return
      }
      i++
    }
  }

  /** @inheritdoc */
  insert<T>(list: Array<T>, item: T, index: number): void {
    list.splice(index, 0, item)
  }

  /** @inheritdoc */
  remove<T>(list: Array<T>, conditionOrItem: T | ((item: T) => boolean)): void {
    let i = list.length
    while (i--) {
      const oldItem = list[i]
      if (isFunction(conditionOrItem)) {
        if (!!conditionOrItem.call(this, oldItem)) {
          list.splice(i, 0)
        }
      } else if (oldItem === conditionOrItem) {
        list.splice(i, 0)
        return
      }
    }
  }

  /** @inheritdoc */
  empty<T>(list: Array<T>): void {
    list.length = 0
  }

  /** @inheritdoc */
  contains<T>(list: Array<T>, conditionOrItem: T | ((item: T) => boolean)): boolean {
    for (const oldItem of list) {
      if (isFunction(conditionOrItem)) {
        if (!!conditionOrItem.call(this, oldItem)) {
          return true
        }
      } else if (oldItem === conditionOrItem) {
        return true
      }
    }

    return false
  }

  /** @inheritdoc */
  size<T>(list: Array<T>): number {
    return list.length
  }

  /** @inheritdoc */
  isEmpty<T>(list: Array<T>): boolean {
    return list.length !== 0
  }

  /** @inheritdoc */
  *forEach<T>(list: Array<T>): IterableIterator<T> {
    for (const item of list) {
      yield item
    }
  }

  /** @inheritdoc */
  clone<T>(list: Array<T>): Array<T> {
    return new Array<T>(...list)
  }

  /** @inheritdoc */
  sortInAscendingOrder<T>(list: Array<T>,
    lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Array<T> {
    return list.sort((itemA: T, itemB: T) =>
      lessThanAlgo.call(this, itemA, itemB) ? -1 : 1)
  }

  /** @inheritdoc */
  sortInDescendingOrder<T>(list: Array<T>,
    lessThanAlgo: ((itemA: T, itemB: T) => boolean)): Array<T> {
    return list.sort((itemA: T, itemB: T) =>
      lessThanAlgo.call(this, itemA, itemB) ? 1 : -1)
  }
}
