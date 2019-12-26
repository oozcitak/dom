/**
 * Represents a set of tuples. The set is limited to two-tuples.
 * This implementation does not preserve insertion order.
 */
export class TupleSet<T1, T2> {

  // tuple storage
  private _storage: Map<T1, Set<T2>>

  /**
   * Initializes a new instance of `TupleSet`.
   */
  constructor() {
    this._storage = new Map<T1, Set<T2>>()
  }

  /**
   * Returns the number of items in the set.
   */
  get size(): number {
    let count = 0
    this._storage.forEach(subSet => count += subSet.size)
    return count
  }

  /**
   * Adds or replaces a tuple.
   * 
   * @param val - tuple to add
   */
  set(val: [T1, T2]): void {
    let subSet = this._storage.get(val[0])
    if (!subSet) {
      subSet = new Set<T2>()
      this._storage.set(val[0], subSet)
    }
    subSet.add(val[1])
  }

  /**
   * Removes all elements from the set.
   */
  clear(): void {
    this._storage = new Map<T1, Set<T2>>()
  }

  /**
   * Removes a tuple from the set.
   * 
   * @param val - tuple to remove
   */
  delete(val: [T1, T2]): void {
    const subSet = this._storage.get(val[0])
    if (subSet) {
      subSet.delete(val[1])
      if (subSet.size === 0) {
        this._storage.delete(val[0])
      }
    }
  }

  /**
   * Calls the callback function for each tuple in the set. The callback
   * receives arguments as follows:
   *   - the current tuple
   *   - the set object
   * 
   * @param callback - function to execute for each node 
   * @param thisArg - value to use as `this` when executing callback 
   */
  forEach(callback: (tuple: [T1, T2], set: TupleSet<T1, T2>) => any,
    thisArg?: any): void {
    this._storage.forEach((subSet, key) =>
      subSet.forEach(val => callback.call(thisArg, [key, val], this)
      )
    )
  }

  /**
   * Determines if the given tuple exists in the set.
   * 
   * @param val - tuple to check
   */
  has(val: [T1, T2]): boolean {
    const subSet = this._storage.get(val[0])
    return (!!subSet) && subSet.has(val[1])
  }

}