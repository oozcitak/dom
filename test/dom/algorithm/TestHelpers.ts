import TestHelpersRoot from "../TestHelpers"
import { DOMAlgorithmImpl } from '../../../src/dom/algorithm/DOMAlgorithmImpl'

export default class TestHelpers extends TestHelpersRoot {
  /**
   * Returns the algorithm object.
   */
  static algo = new DOMAlgorithmImpl()
}