export class EmptySet<T> {

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

  [Symbol.iterator]() {
    return new EmptySetIterator<T>()
  }

  entries() {
    return new EmptySetIterator<[T, T]>()
  }

  keys() {
    return new EmptySetIterator<T>()
  }

  values() {
    return new EmptySetIterator<T>()
  }

  get [Symbol.toStringTag](): string {
    return "EmptySet"
  }
}

class EmptySetIterator<T> {
  [Symbol.iterator]() {
    return this
  }

  next() {
    return { done: true, value: null }
  }
}
