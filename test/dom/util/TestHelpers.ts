import TestHelpersRoot from "../TestHelpers"
import { Cast, Guard, NodeCompareCache } from '../../../src/dom/util'

export default class TestHelpers extends TestHelpersRoot {
  static Cast = Cast
  static Guard = Guard
  static NodeCompareCache = NodeCompareCache
}