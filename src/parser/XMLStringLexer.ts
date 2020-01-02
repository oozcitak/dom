import {
  XMLToken, TokenType, XMLLexer, DeclarationToken, PIToken, TextToken,
  ClosingTagToken, ElementToken, CommentToken, DocTypeToken, CDATAToken,
  XMLLexerOptions
} from "./interfaces"
import { StringWalker, SeekOrigin } from "@oozcitak/util"

/**
 * Represents a lexer for XML content in a string.
 */
export class XMLStringLexer implements XMLLexer {

  private static _WhiteSpace = /^[ \n\r\t\f]*$/
  private _walker: StringWalker
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
    this._walker = new StringWalker(str)
    if (options) {
      if (options.skipWhitespaceOnlyText !== undefined) {
        this._options.skipWhitespaceOnlyText = options.skipWhitespaceOnlyText
      }
    }
  }

  /**
   * Returns the next token.
   */
  nextToken(): XMLToken {
    if (this._walker.eof) {
      return { type: TokenType.EOF }
    }

    let token: XMLToken = { type: TokenType.EOF }
    const char = this._walker.c
    if (char === '<') {
      this._walker.nextChar()
      token = this.openBracket()
    } else {
      token = this.text()
    }

    if (this._options.skipWhitespaceOnlyText) {
      if (token.type === TokenType.Text && XMLStringLexer.isWhiteSpaceToken(token as TextToken)) {
        token = this.nextToken()
      }
    }

    return token
  }

  /**
   * Branches from an opening bracket (`<`).
   */
  private openBracket(): XMLToken {
    switch (this._walker.c) {
      case '?':
        this._walker.nextChar()
        if (this._walker.startsWith('xml')) {
          this._walker.seekChar(3)
          return this.declaration()
        } else {
          return this.pi()
        }
      case '!':
        this._walker.nextChar()
        if (this._walker.startsWith('--')) {
          this._walker.seekChar(2)
          return this.comment()
        } else if (this._walker.startsWith('[CDATA[')) {
          this._walker.seekChar(7)
          return this.cdata()
        } else if (this._walker.startsWith('DOCTYPE')) {
          this._walker.seekChar(7)
          return this.doctype()
        }
      case '/':
        this._walker.nextChar()
        return this.closeTag()
      default:
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

    while (!this._walker.eof) {
      this._walker.skipChar(c => XMLStringLexer.isSpace(c))
      if (this._walker.startsWith('?>')) {
        this._walker.seekChar(2)
        return { type: TokenType.Declaration, version: version, encoding: encoding, standalone: standalone }
      } else {
        const attName = this._walker.takeChar(c => c !== '=' && !XMLStringLexer.isSpace(c))
        this._walker.skipChar(c => XMLStringLexer.isSpace(c))
        if (this._walker.c !== '=') {
          throw new Error('Missing equals sign before attribute value')
        }
        this._walker.skipChar(c => c === '=' || XMLStringLexer.isSpace(c))
        const startQuote = this._walker.takeChar(1)
        if (!XMLStringLexer.isQuote(startQuote)) {
          throw new Error('Missing start quote character before attribute value')
        }
        const attValue = this._walker.takeChar(c => c !== startQuote)
        if (this._walker.c !== startQuote) {
          throw new Error('Missing end quote character after attribute value')
        }
        this._walker.seekChar(1)

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
    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    const name = this._walker.takeChar(c => !XMLStringLexer.isSpace(c) && c !== '[' && c !== '>')

    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    if (this._walker.startsWith('PUBLIC')) {
      this._walker.seekChar(6)
      // pubId
      this._walker.skipChar(c => XMLStringLexer.isSpace(c))
      let startQuote = this._walker.takeChar(1)
      if (!XMLStringLexer.isQuote(startQuote)) {
        throw new Error('Missing start quote character before pubId value')
      }
      pubId = this._walker.takeChar(c => c !== startQuote)
      if (this._walker.c !== startQuote) {
        throw new Error('Missing end quote character after pubId value')
      }
      this._walker.seekChar(1)

      // sysId
      this._walker.skipChar(c => XMLStringLexer.isSpace(c))
      startQuote = this._walker.takeChar(1)
      if (!XMLStringLexer.isQuote(startQuote)) {
        throw new Error('Missing start quote character before sysId value')
      }
      sysId = this._walker.takeChar(c => c !== startQuote)
      if (this._walker.c !== startQuote) {
        throw new Error('Missing end quote character after sysId value')
      }
      this._walker.seekChar(1)
    } else if (this._walker.startsWith('SYSTEM')) {
      this._walker.seekChar(6)
      // sysId
      this._walker.skipChar(c => XMLStringLexer.isSpace(c))
      const startQuote = this._walker.takeChar(1)
      if (!XMLStringLexer.isQuote(startQuote)) {
        throw new Error('Missing start quote character before sysId value')
      }
      sysId = this._walker.takeChar(c => c !== startQuote)
      if (this._walker.c !== startQuote) {
        throw new Error('Missing end quote character after sysId value')
      }
      this._walker.seekChar(1)
    }

    // skip internal subset
    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    if (this._walker.c === '[') {
      this._walker.skipChar(c => c !== ']')
      if (this._walker.peekChar(1) !== ']') {
        throw new Error('Missing end bracket of DTD internal subset')
      }
      this._walker.seekChar(1)
    }
    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    if (this._walker.c !== '>') {
      throw new Error('Missing doctype end symbol `>`')
    }
    this._walker.seekChar(1)

    return { type: TokenType.DocType, name: name, pubId: pubId, sysId: sysId }
  }

  /**
   * Produces a processing instruction token.
   */
  private pi(): PIToken {
    const target = this._walker.takeChar(c => !XMLStringLexer.isSpace(c) && !this._walker.startsWith('?>'))
    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    if (this._walker.startsWith('?>')) {
      this._walker.seekChar(2)
      return { type: TokenType.PI, target: target, data: '' }
    }

    const data = this._walker.takeChar(() => !this._walker.startsWith('?>'))
    if (this._walker.eof) {
      throw new Error('Missing processing instruction end symbol `?>`')
    }
    this._walker.seekChar(2)

    return { type: TokenType.PI, target: target, data: data }
  }

  /**
   * Produces a text token.
   * 
   */
  private text(): TextToken {
    const data = this._walker.takeChar(c => c !== '<')

    return { type: TokenType.Text, data: data }
  }

  /**
   * Produces a comment token.
   * 
   */
  private comment(): CommentToken {
    const data = this._walker.takeChar(() => !this._walker.startsWith('-->'))
    if (this._walker.eof) {
      throw new Error('Missing comment end symbol `-->`')
    }
    this._walker.seekChar(3)

    return { type: TokenType.Comment, data: data }
  }

  /**
   * Produces a CDATA token.
   * 
   */
  private cdata(): CDATAToken {
    const data = this._walker.takeChar(() => !this._walker.startsWith(']]>'))
    if (this._walker.eof) {
      throw new Error('Missing CDATA end symbol `]>`')
    }
    this._walker.seekChar(3)

    return { type: TokenType.CDATA, data: data }
  }

  /**
   * Produces an element token.
   */
  private openTag(): ElementToken {
    // element name
    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    const name = this._walker.takeChar(c => c !== '>' && c !== '/' && !XMLStringLexer.isSpace(c))
    if (this._walker.c === '>') {
      this._walker.seekChar(1)
      return { type: TokenType.Element, name: name, attributes: {}, selfClosing: false }
    } else if (this._walker.startsWith('/>')) {
      this._walker.seekChar(2)
      return { type: TokenType.Element, name: name, attributes: {}, selfClosing: true }
    }

    // attributes
    const attributes: { [name: string]: string } = {}
    while (!this._walker.eof) {
      // end tag
      this._walker.skipChar(c => XMLStringLexer.isSpace(c))
      if (this._walker.c === '>') {
        this._walker.seekChar(1)
        return { type: TokenType.Element, name: name, attributes: attributes, selfClosing: false }
      } else if (this._walker.startsWith('/>')) {
        this._walker.seekChar(2)
        return { type: TokenType.Element, name: name, attributes: attributes, selfClosing: true }
      }

      // attribute name
      const attName = this._walker.takeChar(c => c !== '=' && !XMLStringLexer.isSpace(c))
      this._walker.skipChar(c => XMLStringLexer.isSpace(c))
      if (this._walker.c !== '=') {
        throw new Error('Missing equals sign before attribute value')
      }
      this._walker.seekChar(1)

      // attribute value
      this._walker.skipChar(c => XMLStringLexer.isSpace(c))
      const startQuote = this._walker.takeChar(1)
      if (!XMLStringLexer.isQuote(startQuote)) {
        throw new Error('Missing start quote character before attribute value')
      }
      const attValue = this._walker.takeChar(c => c !== startQuote)
      if (this._walker.c !== startQuote) {
        throw new Error('Missing end quote character after attribute value')
      }
      this._walker.seekChar(1)

      attributes[attName] = attValue
    }

    throw new Error('Missing opening element tag end symbol `>`')
  }

  /**
   * Produces a closing tag token.
   * 
   */
  private closeTag(): ClosingTagToken {
    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    const name = this._walker.takeChar(c => c !== '>' && !XMLStringLexer.isSpace(c))
    this._walker.skipChar(c => XMLStringLexer.isSpace(c))
    if (this._walker.c !== '>') {
      throw new Error('Missing closing element tag end symbol `>`')
    }
    this._walker.seekChar(1)

    return { type: TokenType.ClosingTag, name: name }
  }

  /**
   * Determines if the given token is entirely whitespace.
   * 
   * @param token - the token to check
   */
  private static isWhiteSpaceToken(token: TextToken): boolean {
    return XMLStringLexer._WhiteSpace.test(token.data)
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
    this._walker.seek(0, SeekOrigin.Start)

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
