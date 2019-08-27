import { DOMAlgorithm, OrderedSetAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { infra } from '../../infra';

/**
 * Contains ordered set manipulation algorithms.
 */
export class OrderedSetAlgorithmImpl extends SubAlgorithmImpl implements OrderedSetAlgorithm {

  /**
   * Initializes a new `OrderedSetAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  parse(value: string): Set<string> {
    /**
     * 1. Let inputTokens be the result of splitting input on ASCII whitespace.
     * 2. Let tokens be a new ordered set.
     * 3. For each token in inputTokens, append token to tokens.
     * 4. Return tokens.
     */
    const inputTokens = infra.string.splitAStringOnASCIIWhitespace(value)
    return new Set<string>(inputTokens)
  }

  /** @inheritdoc */
  serialize(tokens: Set<string>): string {
    /**
     * The ordered set serializer takes a set and returns the concatenation of
     * set using U+0020 SPACE.
     */
    return [...tokens].join(' ')
  }

  /** @inheritdoc */
  sanitize(value: string): string {
    return this.serialize(this.parse(value))
  }

  /** @inheritdoc */
  contains(set1: Set<string>, set2: Set<string>,
    caseSensitive: boolean = true): boolean {

    for (const val2 of set2) {
      let found = false
      for (const val1 of set1) {
        if (caseSensitive) {
          if (val1 === val2) {
            found = true
            break
          }
        } else {
          if (val1.toUpperCase() === val2.toUpperCase()) {
            found = true
            break
          }
        }
      }
      if (!found) return false
    }

    return true
  }

}
