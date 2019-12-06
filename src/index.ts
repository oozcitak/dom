import { CompareCache, isObject } from "@oozcitak/util"
import { Node, DOM, Window, DOMImplementation, DOMFeatures } from "./dom/interfaces"
import { DOMAlgorithm } from "./algorithm/interfaces"
import { DOMAlgorithmImpl } from "./algorithm/DOMAlgorithmImpl"
import { globalStore } from "./util"

/**
 * Represents an object implementing DOM algorithms.
 */
class DOMImpl implements DOM {
  
  private _features: DOMFeatures = {
    mutationObservers: true,
    customElements: true,
    slots: true
  }
  private _algorithm: DOMAlgorithm
  private _window: Window | null = null
  private _compareCache: CompareCache<Node>
  
  /**
   * Initializes a new instance of `DOM`.
   * 
   * @param features - DOM features supported by algorithms. All features are
   * enabled by default unless explicity disabled.
   */
  constructor (features?: Partial<DOMFeatures> | boolean) {
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
    
    this._algorithm = new DOMAlgorithmImpl()
    this._compareCache = new CompareCache<Node>()    

    globalStore.dom = this
  }

  /** @inheritdoc */
  get features(): DOMFeatures { return this._features }

  /** @inheritdoc */
  get algorithm(): DOMAlgorithm { return this._algorithm }

  /** @inheritdoc */
  get window(): Window {
    if (this._window === null) {
      this._window = this._algorithm.create.window()
    }
    return this._window
  }

  /** @inheritdoc */
  get implementation(): DOMImplementation { return this.window.document.implementation }

  /** @inheritdoc */
  get compareCache(): CompareCache<Node> { return this._compareCache }
}

export { DOMImpl as DOM }
export { DOMParser } from "./parser"
export { XMLSerializer } from "./serializer"