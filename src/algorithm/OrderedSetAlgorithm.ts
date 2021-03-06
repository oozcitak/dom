import { string as infraString } from "@oozcitak/infra"

/**
 * Converts a whitespace separated string into an array of tokens.
 * 
 * @param value - a string of whitespace separated tokens
 */
export function orderedSet_parse(value: string): Set<string> {
  /**
   * 1. Let inputTokens be the result of splitting input on ASCII whitespace.
   * 2. Let tokens be a new ordered set.
   * 3. For each token in inputTokens, append token to tokens.
   * 4. Return tokens.
   */
  const inputTokens = infraString.splitAStringOnASCIIWhitespace(value)
  return new Set<string>(inputTokens)
}

/**
 * Converts an array of tokens into a space separated string.
 * 
 * @param tokens - an array of token strings
 */
export function orderedSet_serialize(tokens: Set<string>): string {
  /**
   * The ordered set serializer takes a set and returns the concatenation of
   * set using U+0020 SPACE.
   */
  return [...tokens].join(' ')
}

/**
 * Removes duplicate tokens and convert all whitespace characters
 * to space.
 * 
 * @param value - a string of whitespace separated tokens
 */
export function orderedSet_sanitize(value: string): string {
  return orderedSet_serialize(orderedSet_parse(value))
}

/**
 * Determines whether a set contains the other.
 * 
 * @param set1 - a set
 * @param set1 - a set that is contained in set1
 * @param caseSensitive - whether matches are case-sensitive
 */
export function orderedSet_contains(set1: Set<string>, set2: Set<string>,
  caseSensitive: boolean): boolean {

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
