import $$ from "../TestHelpers"
import { TokenType } from "../../src/parser/interfaces"

$$.suite('XMLStringLexer', () => {

  $$.test('constructor', () => {
    const lexer = new $$.XMLStringLexer('', {}) as any
    $$.deepEqual(lexer._options.skipWhitespaceOnlyText, false)
  })

  $$.test('basic', () => {
    const xmlStr = $$.t`
      <?xml version="1.0"?>
      <!DOCTYPE root>
      <root>
        <node att="val"/>
        <!-- same node below -->
        <node att="val" att2='val2'/>
        <?kidding itwas="different"?>
        <?forreal?>
        <![CDATA[here be dragons]]>
        <text>alien's pinky toe</text>
      </root>
      `
    const tokens = [
      { type: TokenType.Declaration, version: '1.0', encoding: '', standalone: '' },
      { type: TokenType.Text, data: '\n' }, // lexer preserves whitespace
      { type: TokenType.DocType, name: 'root', pubId: '', sysId: '' },
      { type: TokenType.Text, data: '\n' },
      { type: TokenType.Element, name: 'root', attributes: [], selfClosing: false },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Element, name: 'node', attributes: [['att', 'val']], selfClosing: true },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Comment, data: ' same node below ' },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Element, name: 'node', attributes: [['att', 'val'], ['att2', 'val2']], selfClosing: true },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.PI, target: 'kidding', data: 'itwas="different"' },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.PI, target: 'forreal', data: '' },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.CDATA, data: 'here be dragons' },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Element, name: 'text', attributes: [], selfClosing: false },
      { type: TokenType.Text, data: 'alien\'s pinky toe' },
      { type: TokenType.ClosingTag, name: 'text' },
      { type: TokenType.Text, data: '\n' },
      { type: TokenType.ClosingTag, name: 'root' }
    ]

    const lexerTokens = [...new $$.XMLStringLexer(xmlStr)]
    $$.deepEqual(lexerTokens, tokens)
  })

  $$.test('with insignificant whitespace', () => {
    const xmlStr = $$.t`
      <?xml version = "1.0" ?>
      <!DOCTYPE root >
      <root >
        < node />
        <node  att = "val" />
        <!-- same node below -->
        <node att= "val"   att2 = 'val2' />
        <?kidding itwas="different"?>
        <![CDATA[here be dragons]]>
        <text>alien's pinky toe</text>
      </root>
      `
    const tokens = [
      { type: TokenType.Declaration, version: '1.0', encoding: '', standalone: '' },
      { type: TokenType.Text, data: '\n' }, // lexer preserves whitespace
      { type: TokenType.DocType, name: 'root', pubId: '', sysId: '' },
      { type: TokenType.Text, data: '\n' },
      { type: TokenType.Element, name: 'root', attributes: [], selfClosing: false },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Element, name: 'node', attributes: [], selfClosing: true },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Element, name: 'node', attributes: [['att', 'val']], selfClosing: true },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Comment, data: ' same node below ' },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Element, name: 'node', attributes: [['att', 'val'], ['att2', 'val2']], selfClosing: true },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.PI, target: 'kidding', data: 'itwas="different"' },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.CDATA, data: 'here be dragons' },
      { type: TokenType.Text, data: '\n  ' },
      { type: TokenType.Element, name: 'text', attributes: [], selfClosing: false },
      { type: TokenType.Text, data: 'alien\'s pinky toe' },
      { type: TokenType.ClosingTag, name: 'text' },
      { type: TokenType.Text, data: '\n' },
      { type: TokenType.ClosingTag, name: 'root' }
    ]

    const lexerTokens = [...new $$.XMLStringLexer(xmlStr)]
    $$.deepEqual(lexerTokens, tokens)
  })

  $$.test('public DTD', () => {
    const xmlStr = $$.t`
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <!DOCTYPE root PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
      <root/>
      `
    const tokens = [
      { type: TokenType.Declaration, version: '1.0', encoding: 'UTF-8', standalone: 'yes' },
      { type: TokenType.Text, data: '\n' }, // lexer preserves whitespace
      { type: TokenType.DocType, name: 'root', pubId: '-//W3C//DTD HTML 4.01//EN', sysId: 'http://www.w3.org/TR/html4/strict.dtd' },
      { type: TokenType.Text, data: '\n' },
      { type: TokenType.Element, name: 'root', attributes: [], selfClosing: true }
    ]

    const lexerTokens = [...new $$.XMLStringLexer(xmlStr)]
    $$.deepEqual(lexerTokens, tokens)
  })

  $$.test('system DTD', () => {
    const xmlStr = $$.t`
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <!DOCTYPE root SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">
      <root/>
      `
    const tokens = [
      { type: TokenType.Declaration, version: '1.0', encoding: 'UTF-8', standalone: 'yes' },
      { type: TokenType.Text, data: '\n' }, // lexer preserves whitespace
      { type: TokenType.DocType, name: 'root', pubId: '', sysId: 'http://www.w3.org/Math/DTD/mathml1/mathml.dtd' },
      { type: TokenType.Text, data: '\n' },
      { type: TokenType.Element, name: 'root', attributes: [], selfClosing: true }
    ]

    const lexerTokens = [...new $$.XMLStringLexer(xmlStr)]
    $$.deepEqual(lexerTokens, tokens)
  })

  $$.test('DTD with internal subset', () => {
    const xmlStr = $$.t`
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <!DOCTYPE root[ <!ELEMENT root (#PCDATA)> ]>
      <root/>
      `
    const tokens = [
      { type: TokenType.Declaration, version: '1.0', encoding: 'UTF-8', standalone: 'yes' },
      { type: TokenType.Text, data: '\n' }, // lexer preserves whitespace
      { type: TokenType.DocType, name: 'root', pubId: '', sysId: '' },
      { type: TokenType.Text, data: '\n' },
      { type: TokenType.Element, name: 'root', attributes: [], selfClosing: true }
    ]

    const lexerTokens = [...new $$.XMLStringLexer(xmlStr)]
    $$.deepEqual(lexerTokens, tokens)
  })

  $$.test('invalid DTD', () => {
    const xmlStr = $$.t`
      <!DOCK_TYPE root >
      <root/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('missing DTD closing bracket', () => {
    const xmlStr = $$.t`
      <!DOCTYPE root[ <!ELEMENT root (#PCDATA)>>
      <root/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('declaration attribute without quote', () => {
    const xmlStr = $$.t`
      <?xml version=1.0?>
      <root/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('declaration attribute without equals', () => {
    const xmlStr = $$.t`
      <?xml version 1.0?>
      <root/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('unknown declaration attribute', () => {
    const xmlStr = $$.t`
      <?xml venison='1.0'?>
      <root/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete declaration', () => {
    const xmlStr = $$.t`
      <?xml version='1.0'
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('doctype pubId without quote', () => {
    const xmlStr = $$.t`
      <!DOCTYPE root PUBLIC pubId>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('doctype sysId without quote', () => {
    const xmlStr = $$.t`
      <!DOCTYPE root PUBLIC 'pubId' sysId>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('doctype sysId without quote', () => {
    const xmlStr = $$.t`
      <!DOCTYPE root SYSTEM sysId>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete doctype', () => {
    const xmlStr = $$.t`
      <!DOCTYPE root
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete processing instruction', () => {
    const xmlStr = $$.t`
      <?target"
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete processing instruction', () => {
    const xmlStr = $$.t`
      <?target name="content"
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete comment', () => {
    const xmlStr = $$.t`
      <!-- comment
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete CDATA', () => {
    const xmlStr = $$.t`
      <![CDATA[here
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('element attribute without quote', () => {
    const xmlStr = $$.t`
      <root att=val/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('element attribute without equals sign', () => {
    const xmlStr = $$.t`
      <root att val/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('element attribute without end quote', () => {
    const xmlStr = $$.t`
      <root att="val/>
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete element', () => {
    const xmlStr = $$.t`
      <root
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    $$.throws(() => lexer.nextToken())
  })

  $$.test('incomplete closing element tag', () => {
    const xmlStr = $$.t`
      <root>hello</root
      `
    const lexer = new $$.XMLStringLexer(xmlStr)
    lexer.nextToken() // <root>
    lexer.nextToken() // hello
    $$.throws(() => lexer.nextToken())
  })

  $$.test('seek() beyond str', () => {
    const lexer = new $$.XMLStringLexer('a') as any
    lexer.seek(-10)
    $$.deepEqual(lexer._index, 0)
    lexer.seek(10)
    $$.deepEqual(lexer._index, 1)
  })

  $$.test('take()', () => {
    const lexer = new $$.XMLStringLexer('abc') as any
    $$.deepEqual(lexer._index, 0)
    $$.deepEqual(lexer.take(1), 'a')
    $$.deepEqual(lexer._index, 1)
    $$.deepEqual(lexer.take(5), 'bc')
    $$.deepEqual(lexer._index, 3)
  })

})