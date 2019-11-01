import { Window } from "../dom/interfaces"
import { DOMAlgorithm } from "../algorithm/interfaces"

/**
 * Represents a global data store.
 */
export class GlobalStore {
  private static _instance: GlobalStore
  
  private _algorithm: DOMAlgorithm | null = null
  private _window: Window | null = null

  /**
   * Initializes a new instance of `GlobalStore`.
   */
  private constructor() { }

  /**
   * Gets or sets the DOM algorithm.
   */
  get algorithm(): DOMAlgorithm {
    if (this._algorithm === null) {
      throw new Error("DOM algorithm instance is null.")
    }
    return this._algorithm 
  }
  set algorithm(val: DOMAlgorithm) { this._algorithm = val }

  /**
   * Gets or sets the global window object.
   */
  get window(): Window {
    if (this._window === null) {
      throw new Error("Global window instance is null.")
    }    
    return this._window 
  }
  set window(val: Window) { this._window = val }


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
