/**
 * Contains algorithms for manipulating strings.
 * See: https://infra.spec.whatwg.org/#strings
 */
export class StringAlgorithmImpl {

  /**
   * Defines a regular expression that matches ASCII whitespace:
   * * U+0009 TAB
   * * U+000A LF
   * * U+000C FF
   * * U+000D CR
   * * U+0020 SPACE
   * 
   * See: https://infra.spec.whatwg.org/#ascii-whitespace
   */
  static readonly ASCIIWhiteSpace = /[\t\n\f\r ]/

  /**
   * Splits a string on ASCII whitespace.
   * 
   * @param str - a string
   */
  static splitAStringOnASCIIWhitespace(str: string): Array<string> {
    return str.split(StringAlgorithmImpl.ASCIIWhiteSpace)    
  }

}
