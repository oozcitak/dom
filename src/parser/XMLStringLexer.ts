import {
  EOFToken, DeclarationToken, PIToken, TextToken,
  ClosingTagToken, ElementToken, CommentToken, DocTypeToken, CDATAToken
} from "./XMLToken"
import { XMLToken, TokenType, XMLLexer } from "./interfaces"
import { StringWalker, SeekOrigin } from "@oozcitak/util"

/**
 * Represents a lexer for XML content in a string.
 */
export class XMLStringLexer implements XMLLexer {

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
      return new EOFToken()
    }

    let token: XMLToken = new EOFToken()
    const char = this._walker.take(1)
    if (char === '<') {
      token = this.openBracket()
    } else {
      this._walker.seek(-1)
      token = this.text()
    }

    if (this.skipWhitespaceOnlyText) {
      if (token.type === TokenType.Text) {
        const textToken = <TextToken>token
        if (textToken.isWhitespace) {
          token = this.nextToken()
        }
      }
    }

    return token
  }

  /**
   * Branches from an opening bracket (`<`).
   */
  private openBracket(): XMLToken {
    switch (this._walker.take(1)) {
      case '?':
        if (this._walker.peek(3) === 'xml') {
          this._walker.seek(3)
          return this.declaration()
        } else {
          return this.pi()
        }
      case '!':
        if (this._walker.peek(2) === '--') {
          this._walker.seek(2)
          return this.comment()
        } else if (this._walker.peek(7) === '[CDATA[') {
          this._walker.seek(7)
          return this.cdata()
        } else if (this._walker.peek(7) === 'DOCTYPE') {
          this._walker.seek(7)
          return this.doctype()
        }
      case '/':
        return this.closeTag()
      default:
        this._walker.seek(-1)
        return this.openTag()
    }
  }

  /**
   * Produces an XML declaration token.
   */
  private declaration(): XMLToken {
    let attName = ''
    let attValue = ''
    let version = ''
    let encoding = ''
    let standalone = ''
    let inName = false
    let inValue = false
    let startQuote = ''

    this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
    inName = true
    inValue = false
    while (!this._walker.eof) {
      let char = this._walker.take(1)
      const nextChar = this._walker.c
      if (char === '?' && nextChar === '>') {
        this._walker.seek(1)
        return new DeclarationToken(version, encoding, standalone)
      } else if (inName && XMLStringLexer.isSpace(char) || char === '=') {
        inName = false
        inValue = true
        this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
        while (!this._walker.eof && char !== '=') { char = this._walker.take(1) }
        if (char !== '=') {
          throw new Error('Missing equals sign before attribute value')
        }
        this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
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
        this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
      } else if (inValue) {
        attValue += char
      }
    }

    throw new Error('Missing declaration end symbol `?>`')
  }

  /**
   * Produces a doc type token.
   */
  private doctype(): XMLToken {
    let name = ''
    let pubId = ''
    let sysId = ''

    // name
    this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '>') {
        return new DocTypeToken(name, '', '')
      } else if (char === '[') {
        this._walker.seek(-1)
        break
      } else if (XMLStringLexer.isSpace(char)) {
        break
      } else {
        name += char
      }
    }

    this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
    if (this._walker.peek(6) === 'PUBLIC') {
      this._walker.seek(6)
      // pubId
      this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
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
      this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
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
    } else if (this._walker.peek(6) === 'SYSTEM') {
      this._walker.seek(6)
      // sysId
      this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
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
    this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '>') {
        return new DocTypeToken(name, pubId, sysId)
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
      this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
      while (!this._walker.eof) {
        const char = this._walker.take(1)
        if (char === '>') {
          return new DocTypeToken(name, pubId, sysId)
        }
      }
    }

    throw new Error('Missing doctype end symbol `>`')
  }

  /**
   * Produces a processing instruction token.
   */
  private pi(): XMLToken {
    let target = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      const nextChar = this._walker.c
      const endTag = (char === '?' && nextChar === '>')
      if (XMLStringLexer.isSpace(char) || endTag) {
        if (endTag) {
          this._walker.seek(1)
          return new PIToken(target, '')
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
        return new PIToken(target, data)
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
  private text(): XMLToken {
    let data = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '<') {
        this._walker.seek(-1)
        break
      }
      data += char
    }

    return new TextToken(data)
  }

  /**
   * Produces a comment token.
   * 
   */
  private comment(): XMLToken {
    let data = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '-' && this._walker.peek(2) === '->') {
        this._walker.seek(2)
        return new CommentToken(data)
      }
      data += char
    }

    throw new Error('Missing comment end symbol `-->`')
  }

  /**
   * Produces a CDATA token.
   * 
   */
  private cdata(): XMLToken {
    let data = ''
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === ']' && this._walker.peek(2) === ']>') {
        this._walker.seek(2)
        return new CDATAToken(data)
      }
      data += char
    }

    throw new Error('Missing CDATA end symbol `]>`')
  }

  /**
   * Produces an element token.
   */
  private openTag(): XMLToken {
    let name = ''
    let attributes: { [name: string]: string } = {}
    let attName = ''
    let attValue = ''
    let inAttName = false
    let inAttValue = false
    let startQuote = ''

    // element name
    this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      const nextChar = this._walker.c
      if (char === '>') {
        return new ElementToken(name, {}, false)
      } else if (char === '/' && nextChar === '>') {
        this._walker.seek(1)
        return new ElementToken(name, {}, true)
      } else if (XMLStringLexer.isSpace(char)) {
        break
      } else {
        name += char
      }
    }

    // attributes
    this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
    inAttName = true
    inAttValue = false
    while (!this._walker.eof) {
      let char = this._walker.take(1)
      const nextChar = this._walker.c
      if (char === '>') {
        return new ElementToken(name, attributes, false)
      } else if (char === '/' && nextChar === '>') {
        this._walker.seek(1)
        return new ElementToken(name, attributes, true)
      } else if (inAttName && XMLStringLexer.isSpace(char) || char === '=') {
        inAttName = false
        inAttValue = true
        this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
        while (!this._walker.eof && char !== '=') { char = this._walker.take(1) }
        if (char !== '=') {
          throw new Error('Missing equals sign before attribute value')
        }
        this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
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
        this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
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
  private closeTag(): XMLToken {
    let name = ''
    this._walker.skip(c => XMLStringLexer.isSpace(this._walker.c))
    while (!this._walker.eof) {
      const char = this._walker.take(1)
      if (char === '>') {
        return new ClosingTagToken(name)
      } else if (!XMLStringLexer.isSpace(char)) {
        name += char
      }
    }

    throw new Error('Missing closing element tag end symbol `>`')
  }

  /**
   * Determines if the given character is whitespace.
   * 
   * @param char - the character to check
   */
  private static isSpace(char: string): boolean {
    const ch = char.charCodeAt(0)
    return ch === 9 || ch === 10 || ch === 13 || ch === 32
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
