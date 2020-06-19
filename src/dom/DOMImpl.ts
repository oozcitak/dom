import { DOMFeatures, Window, Node, Range } from "./interfaces"
import { CompareCache, FixedSizeSet, Lazy, isObject } from "@oozcitak/util"
import { create_window } from "../algorithm/CreateAlgorithm"

type RegExpDict = { 
  Name: Lazy<RegExp> 
  QName: Lazy<RegExp> 
  PubidChar: Lazy<RegExp> 
  InvalidChar_10: Lazy<RegExp> 
  InvalidChar_11: Lazy<RegExp> 
}

/**
 * Represents an object implementing DOM algorithms.
 */
class DOMImpl {
  private static _instance: DOMImpl

  private _features: DOMFeatures = {
    mutationObservers: true,
    customElements: true,
    slots: true,
    steps: true
  }
  private _window: Window | null = null
  private _compareCache: CompareCache<Node>
  private _rangeList: FixedSizeSet<Range>

  /**
   * Initializes a new instance of `DOM`.
   */
  private constructor() {
    this._compareCache = new CompareCache<Node>()
    this._rangeList = new FixedSizeSet<Range>()
  }

  /**
   * Sets DOM algorithm features.
   * 
   * @param features - DOM features supported by algorithms. All features are
   * enabled by default unless explicity disabled.
   */
  setFeatures(features?: Partial<DOMFeatures> | boolean): void {
    if (features === undefined) features = true

    if (isObject(features)) {
      for (const key in features) {
        this._features[key] = features[key] || false
      }
    } else {
      // enable/disable all features
      for (const key in this._features) {
        this._features[key] = features
      }
    }
  }

  /**
   * Gets DOM algorithm features.
   */
  get features(): DOMFeatures { return this._features }

  /**
   * Gets the DOM window.
   */
  get window(): Window {
    if (this._window === null) {
      this._window = create_window()
    }
    return this._window
  }

  /**
   * Gets the global node compare cache.
   */
  get compareCache(): CompareCache<Node> { return this._compareCache }

  /**
   * Gets the global range list.
   */
  get rangeList(): FixedSizeSet<Range> { return this._rangeList }

  /**
   * Returns the instance of `DOM`. 
   */
  static get instance(): DOMImpl {
    if (!DOMImpl._instance) {
      DOMImpl._instance = new DOMImpl()
    }
    return DOMImpl._instance
  }
}

/**
 * Represents an object implementing DOM algorithms.
 */
export const dom = DOMImpl.instance