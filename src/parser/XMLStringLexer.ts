import {
  XMLToken, TokenType, XMLLexer, DeclarationToken, PIToken, TextToken,
  ClosingTagToken, ElementToken, CommentToken, DocTypeToken, CDATAToken
} from "./interfaces"
import { StringWalker, SeekOrigin } from "@oozcitak/util"

/**
 * Represents a lexer for XML content in a string.
 */
export class XMLStringLexer implements XMLLexer {

  private static _WhiteSpace = /^[\t\n\f\r ]*$/
  private _walker: StringWalker

  /**
   * Initializes a new instance of `XMLStringLexer`.
   * 
   * @param str - the string to tokenize and lex
   */
  constructor(str: string) {
    this._walker = new StringWalker(str)
  }

  /**
   * Determines whether whitespace-only text nodes are skipped or not.
   */
  skipWhitespaceOnlyText = false

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
      this._walker.next()
      token = this.openBracket()
    } else {
      token = this.text()
    }

    if (this.skipWhitespaceOnlyText) {
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
        this._walker.next()
        if (this._walker.startsWith('xml')) {
          this._walker.seek(3)
          return this.declaration()
        } else {
          return this.pi()
        }
      case '!':
        this._walker.next()
        if (this._walker.startsWith('--')) {
          this._walker.seek(2)
          return this.comment()
        } else if (this._walker.startsWith('[CDATA[')) {
          this._walker.seek(7)
          return this.cdata()
        } else if (this._walker.startsWith('DOCTYPE')) {
          this._walker.seek(7)
          return this.doctype()
        }
      case '/':
        this._walker.next()
        return this.closeTag()
      default:
        return this.openTag()
    }
  }

  /**
   * Produces an XML declaration token.
   */
  private declaration(): DeclarationToken {
    let attName = ''
    let attValue = ''
    let version = ''
    let encoding = ''
    let standalone = ''
    let inName = false
    let inValue = false
    let startQuote = ''

    this._walker.skip(c => XMLStringLexer.isSpace(c))
    inName = true
    inValue = false
    while (!this._walker.eof) {
      let char = this._walker.take(1)
      const nextChar = this._walker.c
      if (char === '?' && nextChar === '>') {
        this._walker.seek(1)
        return { type: TokenType.Declaration, version: version, encoding: encoding, standalone: standalone }
      } else if (inName && XMLStringLexer.isSpace(char) || char === '=') {
        inName = false
        inValue = true
        this._walker.skip(c => XMLStringLexer.isSpace(c))
        while (!this._walker.eof && char !== '=') { char = this._walker.take(1) }
        if (char !== '=') {
          throw new Error('Missing equals sign before attribute value')
        }
        this._walker.skip(c => XMLStringLexer.isSpace(c))
        startQuote = this._walker.take(1)
        if (!XMLStringLexer.isQuote(startQuote)) {
          throw new Error('Missing quote character before attribute value')
        }
      } else if (inName) {
        attName += char
      } else if (inValue && char === startQuote) {
        inName = true
        inValue = false

        if (attName === 'version')
          version = attValue
        else if (attName === 'encoding')
          encoding = attValue
        else if (attName === 'standalone')
          standalone = attValue
        else
          throw new Error('Invalid attribute name: ' + attName)

        attName = ''
        attValue = ''
        this._walker.skip(c => XMLStringLexer.isSpace(c))
      } else if (inValue) {
        attValue += char
      }
    }

    throw new Error('Missing declaration end symbol `?>`')
  }

  /**
   * Produces a doc type token.
   */
  private doctype(): DocTypeToken {
    let name = ''
    let pubId = ''
    let sysId = ''

    // name
    this._walker.skip(c => XMLStringLexer.isSpace(c))
    while (!this._walker.eof) {
      const char = this._walker.c
      if (char === '>') {
        this._walker.next()
        return { type: TokenType.DocType, name: name,  pubId: '', sysId: '' }
      } else if (char === '[') {
        break
      } else if (XMLStringLexer.isSpace(char)) {
        this._walker.next()
        break
      } else {
        this._walker.next()
        name += char
      }
    }

    this._walker.skip(c => XMLStringLexer.isSpace(c))
    if (this._walker.startsWith('PUBLIC')) {
      this._walker.seek(6)
      // pubId
      this._walker.skip(c => XMLStringLexer.isSpace(c))
      let startQuote = this._walker.take(1)
      if (!XMLStringLexer.isQuote(startQuote)) {
        throw new Error('Missing quote character before pubId value')
      }
      while (!this._walker.eof) {
        const char = this._walker.take(1)
        if (char === startQuote) {
          break
        } else {
          pubId += char
        }
      }
      // sysId
      this._walker.skip(c => XMLStringLexer.isSpace(c))
      startQuote = this._walker.take(1)
      if (!XMLStringLexer.isQuote(startQuote)) {
        throw new Error('Missing quote character before sysId value')
      }
      while (!this._walker.eof) {
        const char = this._walker.take(1)
        if (char === startQuote) {
          break
        } else {
          sysId += char
        }
      }
    } else if (this._walker.startsWith('SYSTEM')) {
      this._walker.seek(6)
      // sysId
      this._walker.skip(c => XMLStringLexer.isSpace(c))
      let startQuote = this._walker.take(1)
      if (!XMLStringLexer.isQuote(startQuote)) {
        throw new Error('Missing quote character before sysId value')
      }
      while (!this._walker.eof) {
        const char = this._walker.take(1)
        if (char === startQuote) {
          break
        } else {
          sysId += char
        }
      }
    }

    // skip internal subset
    let hasInternalSubset = false
    this._walker.skip(c => XMLStringLexer.isSpace(c))
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '>') {
        return { type: TokenType.DocType, name: name,  pubId: pubId, sysId: sysId }
      } else if (char === '[') {
        hasInternalSubset = true
        break
      }
    }

    if (hasInternalSubset) {
      while (!this._walker.eof) {
        const char = this._walker.take(1)
        if (char === ']') {
          break
        }
      }
      this._walker.skip(c => XMLStringLexer.isSpace(c))
      while (!this._walker.eof) {
        const char = this._walker.take(1)
        if (char === '>') {
          return { type: TokenType.DocType, name: name,  pubId: pubId, sysId: sysId }
        }
      }
    }

    throw new Error('Missing doctype end symbol `>`')
  }

  /**
   * Produces a processing instruction token.
   */
  private pi(): PIToken {
    let target = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      const nextChar = this._walker.c
      const endTag = (char === '?' && nextChar === '>')
      if (XMLStringLexer.isSpace(char) || endTag) {
        if (endTag) {
          this._walker.seek(1)
          return { type: TokenType.PI, target: target, data: '' }
        }
        break
      } else {
        target += char
      }
    }

    let data = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      const nextChar = this._walker.c
      if (char === '?' && nextChar === '>') {
        this._walker.seek(1)
        return { type: TokenType.PI, target: target, data: data }
      } else {
        data += char
      }
    }

    throw new Error('Missing processing instruction end symbol `?>`')
  }

  /**
   * Produces a text token.
   * 
   */
  private text(): TextToken {
    let data = ''
    while (!this._walker.eof) {
      const char = this._walker.c
      if (char === '<') {
        break
      }
      data += char
      this._walker.next()
    }

    return { type: TokenType.Text, data: data }
  }

  /**
   * Produces a comment token.
   * 
   */
  private comment(): CommentToken {
    let data = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '-' && this._walker.startsWith('->')) {
        this._walker.seek(2)
        return { type: TokenType.Comment, data: data }
      }
      data += char
    }

    throw new Error('Missing comment end symbol `-->`')
  }

  /**
   * Produces a CDATA token.
   * 
   */
  private cdata(): CDATAToken {
    let data = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === ']' && this._walker.startsWith(']>')) {
        this._walker.seek(2)
        return { type: TokenType.CDATA, data: data }
      }
      data += char
    }

    throw new Error('Missing CDATA end symbol `]>`')
  }

  /**
   * Produces an element token.
   */
  private openTag(): ElementToken {
    let name = ''
    let attributes: { [name: string]: string } = {}
    let attName = ''
    let attValue = ''
    let inAttName = false
    let inAttValue = false
    let startQuote = ''

    // element name
    this._walker.skip(c => XMLStringLexer.isSpace(c))
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      const nextChar = this._walker.c
      if (char === '>') {
        return { type: TokenType.Element, name: name, attributes: {}, selfClosing: false }
      } else if (char === '/' && nextChar === '>') {
        this._walker.seek(1)
        return { type: TokenType.Element, name: name, attributes: {}, selfClosing: true }
      } else if (XMLStringLexer.isSpace(char)) {
        break
      } else {
        name += char
      }
    }

    // attributes
    this._walker.skip(c => XMLStringLexer.isSpace(c))
    inAttName = true
    inAttValue = false
    while (!this._walker.eof) {
      let char = this._walker.take(1)
      const nextChar = this._walker.c
      if (char === '>') {
        return { type: TokenType.Element, name: name, attributes: attributes, selfClosing: false }
      } else if (char === '/' && nextChar === '>') {
        this._walker.seek(1)
        return { type: TokenType.Element, name: name, attributes: attributes, selfClosing: true }
      } else if (inAttName && XMLStringLexer.isSpace(char) || char === '=') {
        inAttName = false
        inAttValue = true
        this._walker.skip(c => XMLStringLexer.isSpace(c))
        while (!this._walker.eof && char !== '=') { char = this._walker.take(1) }
        if (char !== '=') {
          throw new Error('Missing equals sign before attribute value')
        }
        this._walker.skip(c => XMLStringLexer.isSpace(c))
        startQuote = this._walker.take(1)
        if (!XMLStringLexer.isQuote(startQuote)) {
          throw new Error('Missing quote character before attribute value')
        }
      } else if (inAttName) {
        attName += char
      } else if (inAttValue && char === startQuote) {
        inAttName = true
        inAttValue = false
        attributes[attName] = attValue
        attName = ''
        attValue = ''
        this._walker.skip(c => XMLStringLexer.isSpace(c))
      } else if (inAttValue) {
        attValue += char
      }
    }

    throw new Error('Missing opening element tag end symbol `>`')
  }

  /**
   * Produces a closing tag token.
   * 
   */
  private closeTag(): ClosingTagToken {
    let name = ''
    this._walker.skip(c => XMLStringLexer.isSpace(c))
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '>') {
        return { type: TokenType.ClosingTag, name: name }
      } else if (!XMLStringLexer.isSpace(char)) {
        name += char
      }
    }

    throw new Error('Missing closing element tag end symbol `>`')
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
