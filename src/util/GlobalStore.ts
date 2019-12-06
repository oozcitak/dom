import { DOM } from "../dom/interfaces"

/**
 * Represents a global data store.
 */
export class GlobalStore {
  private static _instance: GlobalStore
  
  private _dom: DOM | null = null

  /**
   * Initializes a new instance of `GlobalStore`.
   */
  private constructor() { }

  /**
   * Gets or sets the DOM container class.
   */
  get dom(): DOM {
    /* istanbul ignore next */
    if (this._dom === null) {
      throw new Error("DOM container class instance is null.")
    }
    return this._dom
  }
  set dom(val: DOM) { this._dom = val }

  /**
   * Returns the instance of `GlobalStore`. 
   */
  static get instance(): GlobalStore {
    if (!GlobalStore._instance) {
      GlobalStore._instance = new GlobalStore()
    }
    return GlobalStore._instance
  }
}
