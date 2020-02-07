import {
  XMLToken, TokenType, XMLLexer, DeclarationToken, PIToken, TextToken,
  ClosingTagToken, ElementToken, CommentToken, DocTypeToken, CDATAToken,
  XMLLexerOptions
} from "./interfaces"

/**
 * Represents a lexer for XML content in a string.
 */
export class XMLStringLexer implements XMLLexer {

  private _str: string
  private _index: number
  private _length: number
  private _options: XMLLexerOptions = {
    skipWhitespaceOnlyText: false
  }

  /**
   * Initializes a new instance of `XMLStringLexer`.
   * 
   * @param str - the string to tokenize and lex
   * @param options - lexer options
   */
  constructor(str: string, options?: Partial<XMLLexerOptions>) {
    this._str = str
    this._index = 0
    this._length = str.length
    if (options) {
      this._options.skipWhitespaceOnlyText = options.skipWhitespaceOnlyText || false
    }
  }

  /**
   * Returns the next token.
   */
  nextToken(): XMLToken {
    if (this.eof()) {
      return { type: TokenType.EOF }
    }

    let token = (this.skipIfStartsWith('<') ? this.openBracket() : this.text())

    if (this._options.skipWhitespaceOnlyText) {
      if (token.type === TokenType.Text && 
        XMLStringLexer.isWhiteSpaceToken(token as TextToken)) {
        token = this.nextToken()
      }
    }

    return token
  }

  /**
   * Branches from an opening bracket (`<`).
   */
  private openBracket(): XMLToken {
    if (this.skipIfStartsWith('?')) {
      if (this.skipIfStartsWith('xml')) {
        return this.declaration()
      } else {
        return this.pi()
      }
    } else if (this.skipIfStartsWith('!')) {
      if (this.skipIfStartsWith('--')) {
        return this.comment()
      } else if (this.skipIfStartsWith('[CDATA[')) {
        return this.cdata()
      } else if (this.skipIfStartsWith('DOCTYPE')) {
        return this.doctype()
      } else {
        throw new Error("Invalid '!' in opening tag.")
      }
    } else if (this.skipIfStartsWith('/')) {
      return this.closeTag()
    } else {
      return this.openTag()
    }
  }

  /**
   * Produces an XML declaration token.
   */
  private declaration(): DeclarationToken {
    let version = ''
    let encoding = ''
    let standalone = ''

    while (!this.eof()) {
      this.skipSpace()
      if (this.skipIfStartsWith('?>')) {
        return { type: TokenType.Declaration, version: version, encoding: encoding, standalone: standalone }
      } else {
        // attribute name
        const [attName, attValue] = this.attribute()

        if (attName === 'version')
          version = attValue
        else if (attName === 'encoding')
          encoding = attValue
        else if (attName === 'standalone')
          standalone = attValue
        else
          throw new Error('Invalid attribute name: ' + attName)
      }
    }

    throw new Error('Missing declaration end symbol `?>`')
  }

  /**
   * Produces a doc type token.
   */
  private doctype(): DocTypeToken {
    let pubId = ''
    let sysId = ''

    // name
    this.skipSpace()
    const name = this.takeUntil2('[', '>', true)

    this.skipSpace()
    if (this.skipIfStartsWith('PUBLIC')) {
      pubId = this.quotedString()
      sysId = this.quotedString()
    } else if (this.skipIfStartsWith('SYSTEM')) {
      sysId = this.quotedString()
    }

    // skip internal subset
    this.skipSpace()
    if (this.skipIfStartsWith('[')) {
      // skip internal subset nodes
      this.skipUntil(']')
      if (!this.skipIfStartsWith(']')) {
        throw new Error('Missing end bracket of DTD internal subset')
      }
    }
    this.skipSpace()
    if (!this.skipIfStartsWith('>')) {
      throw new Error('Missing doctype end symbol `>`')
    }

    return { type: TokenType.DocType, name: name, pubId: pubId, sysId: sysId }
  }

  /**
   * Produces a processing instruction token.
   */
  private pi(): PIToken {
    const target = this.takeUntilStartsWith('?>', true)
    if (this.eof()) {
      throw new Error('Missing processing instruction end symbol `?>`')
    }
    this.skipSpace()
    if (this.skipIfStartsWith('?>')) {
      return { type: TokenType.PI, target: target, data: '' }
    }

    const data = this.takeUntilStartsWith('?>')
    if (this.eof()) {
      throw new Error('Missing processing instruction end symbol `?>`')
    }
    this.seek(2)

    return { type: TokenType.PI, target: target, data: data }
  }

  /**
   * Produces a text token.
   * 
   */
  private text(): TextToken {
    const data = this.takeUntil('<')

    return { type: TokenType.Text, data: data }
  }

  /**
   * Produces a comment token.
   * 
   */
  private comment(): CommentToken {
    const data = this.takeUntilStartsWith('-->')
    if (this.eof()) {
      throw new Error('Missing comment end symbol `-->`')
    }
    this.seek(3)

    return { type: TokenType.Comment, data: data }
  }

  /**
   * Produces a CDATA token.
   * 
   */
  private cdata(): CDATAToken {
    const data = this.takeUntilStartsWith(']]>')
    if (this.eof()) {
      throw new Error('Missing CDATA end symbol `]>`')
    }
    this.seek(3)

    return { type: TokenType.CDATA, data: data }
  }

  /**
   * Produces an element token.
   */
  private openTag(): ElementToken {
    // element name
    this.skipSpace()
    const name = this.takeUntil2('>', '/', true)
    if (this.skipIfStartsWith('>')) {
      return { type: TokenType.Element, name: name, attributes: [], selfClosing: false }
    } else if (this.skipIfStartsWith('/>')) {
      return { type: TokenType.Element, name: name, attributes: [], selfClosing: true }
    }

    // attributes
    const attributes: Array<[string, string]> = []
    while (!this.eof()) {
      // end tag
      this.skipSpace()
      if (this.skipIfStartsWith('>')) {
        return { type: TokenType.Element, name: name, attributes: attributes, selfClosing: false }
      } else if (this.skipIfStartsWith('/>')) {
        return { type: TokenType.Element, name: name, attributes: attributes, selfClosing: true }
      }

      const attr = this.attribute()
      attributes.push(attr)
    }

    throw new Error('Missing opening element tag end symbol `>`')
  }

  /**
   * Produces a closing tag token.
   * 
   */
  private closeTag(): ClosingTagToken {
    this.skipSpace()
    const name = this.takeUntil('>', true)
    this.skipSpace()
    if (!this.skipIfStartsWith('>')) {
      throw new Error('Missing closing element tag end symbol `>`')
    }

    return { type: TokenType.ClosingTag, name: name }
  }

  /**
   * Reads an attribute name, value pair
   */
  private attribute(): [string, string] {
    // attribute name
    this.skipSpace()
    const name = this.takeUntil('=', true)
    this.skipSpace()
    if (!this.skipIfStartsWith('=')) {
      throw new Error('Missing equals sign before attribute value')
    }

    // attribute value
    const value = this.quotedString()

    return [name, value]
  }

  /**
   * Reads a string between double or single quotes.
   */
  private quotedString(): string {
    this.skipSpace()
    const startQuote = this.take(1)
    if (!XMLStringLexer.isQuote(startQuote)) {
      throw new Error('Missing start quote character before quoted value')
    }
    const value = this.takeUntil(startQuote)
    if (!this.skipIfStartsWith(startQuote)) {
      throw new Error('Missing end quote character after quoted value')
    }

    return value
  }

  /**
   * Determines if the current index is at or past the end of input string.
   */
  private eof(): boolean { return this._index >= this._length }

  /**
   * Skips the length of the given string if the string from current position 
   * starts with the given string.
   * 
   * @param str - the string to match
   */
  private skipIfStartsWith(str: string): boolean {
    const strLength = str.length

    if (strLength === 1) {
      if(this._str[this._index] === str) {
        this._index++
        return true
      } else {
        return false
      }
    }

    for (let i = 0; i < strLength; i++) {
      if (this._str[this._index + i] !== str[i]) return false
    }

    this._index += strLength
    return true
  }

  /**
   * Seeks a number of character codes.
   * 
   * @param count - number of characters to skip
   */
  private seek(count: number): void {
    this._index += count
    if (this._index < 0) this._index = 0
    if (this._index > this._length) this._index = this._length
  }

  /**
   * Skips space characters.
   */
  private skipSpace(): void {
    while (!this.eof() && (XMLStringLexer.isSpace(this._str[this._index]))) {
      this._index++
    }
  }

  /**
   * Takes a given number of characters.
   * 
   * @param count - character count
   */
  private take(count: number): string {
    if (count === 1) {
      return this._str[this._index++]
    }
    
    const startIndex = this._index
    this.seek(count)
    return this._str.slice(startIndex, this._index)
  }

  /**
   * Takes characters until the next character matches `char`.
   * 
   * @param char - a character to match
   * @param space - whether a space character stops iteration
   */
  private takeUntil(char: string, space: boolean = false): string {
    const startIndex = this._index
    while (this._index < this._length) {
      const c = this._str[this._index]
      if (c !== char && (!space || !XMLStringLexer.isSpace(c))) {
        this._index++
      } else {
        break
      }
    }

    return this._str.slice(startIndex, this._index)
  }

  /**
   * Takes characters until the next character matches `char1` or `char1`.
   * 
   * @param char1 - a character to match
   * @param char2 - a character to match
   * @param space - whether a space character stops iteration
   */
  private takeUntil2(char1: string, char2: string, space: boolean = false): string {
    const startIndex = this._index
    while (this._index < this._length) {
      const c = this._str[this._index]
      if (c !== char1 && c !== char2 && (!space || !XMLStringLexer.isSpace(c))) {
        this._index++
      } else {
        break
      }
    }

    return this._str.slice(startIndex, this._index)
  }

  /**
   * Takes characters until the next characters matches `str`.
   * 
   * @param str - a string to match
   * @param space - whether a space character stops iteration
   */
  private takeUntilStartsWith(str: string, space: boolean = false): string {
    const startIndex = this._index
    const strLength = str.length
    while (this._index < this._length) {
      let match = true
      for (let i = 0; i < strLength; i++) {
        const c = this._str[this._index + i]
        const char = str[i]
        if (space && XMLStringLexer.isSpace(c)) {
          return this._str.slice(startIndex, this._index)
        } else if (c !== char) {
          this._index++
          match = false
          break
        }
      }

      if (match) return this._str.slice(startIndex, this._index)
    }

    this._index = this._length
    return this._str.slice(startIndex)
  }

  /**
   * Skips characters until the next character matches `char`.
   * 
   * @param char - a character to match
   */
  private skipUntil(char: string): void {
    while (this._index < this._length) {
      const c = this._str[this._index]
      if (c !== char) {
        this._index++
      } else {
        break
      }
    }
  }

  /**
   * Determines if the given token is entirely whitespace.
   * 
   * @param token - the token to check
   */
  private static isWhiteSpaceToken(token: TextToken): boolean {
    const str = token.data
    for (let i = 0; i < str.length; i++) {
      const c = str [i]
      if (c !== ' ' && c !== '\n' && c !== '\r' && c !== '\t' && c !== '\f') return false
    }
    return true
  }

  /**
   * Determines if the given character is whitespace.
   * 
   * @param char - the character to check
   */
  private static isSpace(char: string): boolean {
    return char === ' ' || char === '\n' || char === '\r' || char === '\t'
  }

  /**
   * Determines if the given character is a quote character.
   * 
   * @param char - the character to check
   */
  private static isQuote(char: string): boolean {
    return (char === '"' || char === '\'')
  }

  /**
   * Returns an iterator for the lexer.
   */
  [Symbol.iterator](): Iterator<XMLToken> {
    this._index = 0

    return {
      next: function (this: XMLStringLexer): IteratorResult<XMLToken> {
        const token = this.nextToken()
        if (token.type === TokenType.EOF) {
          return { done: true, value: null }
        } else {
          return { done: false, value: token }
        }
      }.bind(this)
    }
  }

}
