import * as algorithm from "./algorithm"
import * as dom from "./dom"
import * as parser from "./parser"
import * as serializer from "./serializer"
import * as util from "./util"
import { CompareCache } from "@oozcitak/util"
import { Node } from "./dom/interfaces"

export { algorithm, dom, parser, serializer, util }

const algo = new algorithm.DOMAlgorithm()
util.globalStore.algorithm = algo
util.globalStore.window = algo.create.window()
util.globalStore.compareCache = new CompareCache<Node>()

export const window = util.globalStore.window
export const implementation = window.document.implementation
