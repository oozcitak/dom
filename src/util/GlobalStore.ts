/**
 * Represents a global data store.
 */
export class GlobalStore {
  private static _instance: GlobalStore

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

}
