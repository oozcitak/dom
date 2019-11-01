import * as algorithm from "./algorithm"
import * as dom from "./dom"
import * as parser from "./parser"
import * as serializer from "./serializer"
import * as util from "./util"

export { algorithm, dom, parser, serializer, util }

const algo = new algorithm.DOMAlgorithm()
util.globalStore.algorithm = algo
util.globalStore.window = algo.create.window()

export const window = util.globalStore.window
export const implementation = window.document.implementation
