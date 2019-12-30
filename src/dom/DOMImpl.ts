import { DOMFeatures, Window, Node, Range } from "./interfaces"
import { CompareCache, FixedSizeSet, Lazy, isObject } from "@oozcitak/util"
import { create_window } from "../algorithm"

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
export class DOMImpl {
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
  private _regExp: RegExpDict

  /**
   * Initializes a new instance of `DOM`.
   */
  private constructor() {
    this._compareCache = new CompareCache<Node>()
    this._rangeList = new FixedSizeSet<Range>()
    this._regExp = {
      /** Matches a valid XML name */
      Name: new Lazy<RegExp>(() => /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/),
      /** Matches a valid XML qualified name */
      QName: new Lazy<RegExp>(() => /^(([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-9A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*:([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-9A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*)|(([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-9A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*)$/),
      /** Matches a valid XML public identifier string */
      PubidChar: new Lazy<RegExp>(() => /^[\x20\x0D\x0AA-Z-a-z0-9-'()+,./:=?;!*#@$_%]*$/),
      /** Matches an invalid character according to XML 1.0 */
      InvalidChar_10: new Lazy<RegExp>(() => /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/),
      /** Matches an invalid character according to XML 1.1 */
      InvalidChar_11: new Lazy<RegExp>(() => /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/)
    }
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
   * Gets the global RegExp list.
   */
  get regExp(): RegExpDict { return this._regExp }

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
