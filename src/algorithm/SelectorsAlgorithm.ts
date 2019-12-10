import { NotSupportedError } from '../dom/DOMException'
import { Element, Node } from '../dom/interfaces'

/**
 * Matches elements with the given selectors.
 * 
 * @param selectors - selectors
 * @param node - the node to match against
 */

export function selectors_scopeMatchASelectorsString(selectors: string, node: Node):
  Element[] {
  /**
   * TODO: Selectors
   * 1. Let s be the result of parse a selector selectors. [SELECTORS4]
   * 2. If s is failure, then throw a "SyntaxError" DOMException.
   * 3. Return the result of match a selector against a tree with s and node’s 
   * root using scoping root node. [SELECTORS4].
   */
  throw new NotSupportedError()
}

