/**
 * Includes methods for ordered sets.
 */
export class OrderedSet {
  /**
   * RegExp to split attribute values at ASCII whitespace
   * https://infra.spec.whatwg.org/#ascii-whitespace
   * U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or U+0020 SPACE
   */
  static readonly WhiteSpace = /[\t\n\f\r ]/
  /**
   * Converts a whitespace separated string into an array of tokens.
   * 
   * @param value - a string of whitespace separated tokens
   */
  static parse(value: string): Set<string> {
    const arr = value.split(OrderedSet.WhiteSpace)
    // remove empty strings
    const filtered = new Set<string>()
    for (const str of arr)
      if (str) filtered.add(str)
    return filtered
  }
  /**
   * Converts an array of tokens into a space separated string.
   * 
   * @param tokens - an array of token strings
   */
  static serialize(tokens: Set<string>): string {
    return [...tokens].join(' ')
  }
  /**
   * Removes duplicate tokens and convert all whitespace characters
   * to space.
   * 
   * @param value - a string of whitespace separated tokens
   */
  static sanitize(value: string): string {
    return OrderedSet.serialize(OrderedSet.parse(value))
  }

  /**
   * Determines whether a set contains the other.
   * 
   * @param set1 - a set
   * @param set1 - a set that is contained in set1
   * @param caseSensitive - whether matches are case-sensitive
   */
  static contains(set1: Set<string>, set2: Set<string>,
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
