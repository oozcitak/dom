import * as algorithm from "./algorithm"
import * as dom from "./dom"
import * as parser from "./parser"
import * as serializer from "./serializer"
import * as util from "./util"
import { CompareCache } from "@oozcitak/util"
import { Node } from "./dom/interfaces"

export { algorithm, dom, parser, serializer, util }

/**
 * Represents an object implementing DOM algorithms.
 */
export class DOM {
  /**
   * Initializes a new instance of `DOM`.
   * 
   * @param features - DOM features supported by algorithms. All features are
   * enabled by default unless explicity disabled.
   */
  constructor (features?: Partial<algorithm.Interfaces.DOMFeatures> | boolean) {
    const algo = new algorithm.DOMAlgorithm(features)
    util.globalStore.algorithm = algo
    util.globalStore.window = algo.create.window()
    util.globalStore.compareCache = new CompareCache<Node>()    
  }

  /**
   * Gets DOM algorithms.
   */
  get algorithm(): algorithm.Interfaces.DOMAlgorithm { return util.globalStore.algorithm }

  /**
   * Gets the DOM window.
   */
  get window(): dom.Interfaces.Window { return util.globalStore.window }

  /**
   * Gets the DOM implementation.
   */
  get implementation(): dom.Interfaces.DOMImplementation { 
    return util.globalStore.window.document.implementation 
  }
}