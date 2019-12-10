import { CompareCache, isObject, ObjectCache } from "@oozcitak/util"
import { Node, DOM, Window, DOMImplementation, DOMFeatures, Range } from "./dom/interfaces"
import { globalStore } from "./util"
import { create_window } from "./algorithm/CreateAlgorithm"

/**
 * Represents an object implementing DOM algorithms.
 */
class DOMImpl implements DOM {
  
  private _features: DOMFeatures = {
    mutationObservers: true,
    customElements: true,
    slots: true
  }
  private _window: Window | null = null
  private _compareCache: CompareCache<Node>
  private _rangeList: ObjectCache<Range>

  /**
   * Initializes a new instance of `DOM`.
   * 
   * @param features - DOM features supported by algorithms. All features are
   * enabled by default unless explicity disabled.
   */
  constructor (features?: Partial<DOMFeatures> | boolean) {
    if (features === undefined) features = true
    
    if (isObject(features)) {
      for (const key in features) {
        (this._features as any)[key] = (features as any)[key]
      }
    } else {
      // enable/disable all features
      for (const key in this._features) {
        (this._features as any)[key] = features
      }
    }
    
    this._compareCache = new CompareCache<Node>()
    this._rangeList = new ObjectCache<Range>()

    globalStore.dom = this
  }

  /** @inheritdoc */
  get features(): DOMFeatures { return this._features }

  /** @inheritdoc */
  get window(): Window {
    if (this._window === null) {
      this._window = create_window()
    }
    return this._window
  }

  /** @inheritdoc */
  get implementation(): DOMImplementation { return this.window.document.implementation }

  /** @inheritdoc */
  get compareCache(): CompareCache<Node> { return this._compareCache }

  /** @inheritdoc */
  get rangeList(): ObjectCache<Range> { return this._rangeList }
}

export { DOMImpl as DOM }
export { DOMParser } from "./parser"
export { XMLSerializer } from "./serializer"