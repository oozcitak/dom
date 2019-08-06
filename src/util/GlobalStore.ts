/**
 * Represents a global data store.
 */
export class GlobalStore {
  private static _instance: GlobalStore
  private static _reservedNames = ['_store', 'get', 'set']

  private _store: { [key: string]: any } = {}

  /**
   * Initializes a new instance of `GlobalStore`.
   */
  private constructor() { }

  /**
   * Returns the instance of `GlobalStore`. 
   */
  static get instance(): GlobalStore {
    if (!GlobalStore._instance) {
      GlobalStore._instance = new GlobalStore()
    }
    return GlobalStore._instance
  }

  /*
   * Gets or sets the value corresponding to the given key.
   */
  [key: string]: any

  /**
   * Implements a proxy get trap to provide array-like access.
   */
  get<T>(target: GlobalStore, key: string | symbol, receiver: any): T {
    if (typeof key === 'string' && GlobalStore._reservedNames.indexOf(key) === -1) {
      return target._store[key]
    } else {
      return Reflect.get(target, key, receiver)
    }
  }

  /**
   * Implements a proxy get trap to provide array-like access.
   */
  set<T>(target: GlobalStore, key: string | symbol, value: T, receiver: any): void {
    if (typeof key === 'string' && GlobalStore._reservedNames.indexOf(key) === -1) {
      target._store[key] = value
    } else {
      Reflect.set(target, key, value, receiver)
    }
  }
}
