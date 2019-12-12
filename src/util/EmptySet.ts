export class EmptySet<T> implements Set<T> {

  get size(): number {
    return 0
  }

  add(value: T): this {
    throw new Error("Cannot add to an empty set.");
  }

  clear(): void {
    // no-op
  }

  delete(value: T): boolean {
    return false
  }

  forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
    // no-op
  }

  has(value: T): boolean {
    return false
  }

  [Symbol.iterator](): IterableIterator<T> {
    return new EmptySetIterator<T>()
  }

  entries(): IterableIterator<[T, T]> {
    return new EmptySetIterator<[T, T]>()
  }

  keys(): IterableIterator<T> {
    return new EmptySetIterator<T>()
  }

  values(): IterableIterator<T> {
    return new EmptySetIterator<T>()
  }

  get [Symbol.toStringTag](): string {
    return "EmptySet"
  }
}

class EmptySetIterator<T> implements IterableIterator<T> {
  [Symbol.iterator](): IterableIterator<T> {
    return this
  }

  next(): IteratorResult<T> {
    return { done: true, value: null }
  }
}
