import TestHelpersRoot from "../TestHelpers"
import * as util from '../../src/util'
import { GlobalStore } from '../../src/util/GlobalStore'

export default class TestHelpers extends TestHelpersRoot {
  static util = util
  static GlobalStore = GlobalStore
}