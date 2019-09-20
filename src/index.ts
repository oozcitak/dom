import { globalStore } from "./util"
import { DOMAlgorithmImpl } from "./dom/algorithm"
import { WindowImpl } from './htmldom/WindowImpl'

globalStore.algorithm = new DOMAlgorithmImpl()
globalStore.window = WindowImpl._create()
export const window = globalStore.window
