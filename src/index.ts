import { globalStore } from "./util"
import { HTMLAlgorithmImpl } from "./html/algorithm"

const algo = new HTMLAlgorithmImpl()
globalStore.algorithm = algo
globalStore.window = algo.create.window()

export const window = globalStore.window

// DOMParser
export { DOMParser, MimeType } from './parser'
