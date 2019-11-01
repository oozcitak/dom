import { globalStore } from "./util"
import { DOMAlgorithmImpl } from "./algorithm"

const algo = new DOMAlgorithmImpl()
globalStore.algorithm = algo
globalStore.window = algo.create.window()

export const window = globalStore.window

// DOMParser
export { DOMParser, MimeType } from './parser'

// XMLSerializer
export { XMLSerializer, PreSerializer } from './serializer'
