import { SelectorsAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { DOMException } from '../dom/DOMException'
import { Element, Node } from '../dom/interfaces'

/**
 * Contains selectors algorithms.
 */
export class SelectorsAlgorithmImpl extends SubAlgorithmImpl implements SelectorsAlgorithm {

  /**
   * Initializes a new `SelectorsAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  scopeMatchASelectorsString(selectors: string, node: Node):
    Element[] {
    /**
     * TODO: Selectors
     * 1. Let s be the result of parse a selector selectors. [SELECTORS4]
     * 2. If s is failure, then throw a "SyntaxError" DOMException.
     * 3. Return the result of match a selector against a tree with s and node’s 
     * root using scoping root node. [SELECTORS4].
     */
    throw DOMException.NotSupportedError
  }

}