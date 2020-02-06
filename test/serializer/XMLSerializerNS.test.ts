import $$ from "../TestHelpers"
import { XMLSerializerNSImpl as XMLSerializer } from "../../src/serializer/XMLSerializerNSImpl"

describe('XMLSerializer', () => {

  test('basic', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    const de = doc.documentElement
    if (de) {
      const node1 = doc.createElement('node')
      node1.setAttribute('att', 'val')
      de.appendChild(node1)
      de.appendChild(doc.createComment('same node below'))
      const node2 = doc.createElement('node')
      node2.setAttribute('att', 'val')
      node2.setAttribute('att2', 'val2')
      de.appendChild(node2)
      de.appendChild(doc.createProcessingInstruction('kidding', 'itwas="different"'))
      de.appendChild(doc.createProcessingInstruction('for', 'real'))
      de.appendChild(doc.createCDATASection('<greeting>Hello, world!</greeting>'))
      const node3 = doc.createElement('text')
      node3.appendChild(doc.createTextNode('alien\'s pinky toe'))
      de.appendChild(node3)
    }

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns="ns">' +
      '<node xmlns="" att="val"/>' +
      '<!--same node below-->' +
      '<node xmlns="" att="val" att2="val2"/>' +
      '<?kidding itwas="different"?>' +
      '<?for real?>' +
      '<![CDATA[<greeting>Hello, world!</greeting>]]>' +
      '<text xmlns="">alien\'s pinky toe</text>' +
      '</root>'
    )
  })

  test('serializer + parser', () => {
    const xmlStr =
      '<section xmlns="http://www.ibm.com/events"' +
      ' xmlns:bk="urn:loc.gov:books"' +
      ' xmlns:pi="urn:personalInformation"' +
      ' xmlns:isbn="urn:ISBN:0-395-36341-6">' +
      '<title>Book-Signing Event</title>' +
      '<signing>' +
      '<bk:author pi:title="Mr" pi:name="Jim Ross"/>' +
      '<book bk:title="Writing COBOL for Fun and Profit" isbn:number="0426070806"/>' +
      '<comment xmlns="">What a great issue!</comment>' +
      '</signing>' +
      '</section>'

      const serializer = new XMLSerializer()
      const parser = new $$.DOMParser()
      expect(serializer.serializeToString(parser.parseFromString(xmlStr, "application/xml"))).toBe(xmlStr)
  })

  test('namespace declaration attribute', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'ns')
      doc.documentElement.appendChild(doc.createElement('foo'))
    }

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns="ns"><foo xmlns=""/></root>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      root (ns:ns) xmlns="ns" (ns:http://www.w3.org/2000/xmlns/)
        foo
      `)
  })

  test('default namespace', () => {
    const ns = 'uri:myns'
    const doc = $$.dom.createDocument(ns, 'root')
    const node1 = doc.createElementNS(ns, 'node1')
    if (doc.documentElement) {
      doc.documentElement.appendChild(node1)
    }
    const node2 = doc.createElementNS(ns, 'node2')
    node1.appendChild(node2)
    node2.appendChild(doc.createTextNode('text'))

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns="uri:myns"><node1><node2>text</node2></node1></root>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      root (ns:uri:myns)
        node1 (ns:uri:myns)
          node2 (ns:uri:myns)
            # text
      `)
  })

  test('namespace prefix', () => {
    const ns = 'uri:myns'
    const doc = $$.dom.createDocument(ns, 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'xsi:schemaLocation', 'uri:myschema.xsd')
    }

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns="uri:myns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="uri:myschema.xsd"/>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      root (ns:uri:myns) xsi:schemaLocation="uri:myschema.xsd" (ns:http://www.w3.org/2001/XMLSchema-instance)
      `)
  })

  test('explicit namespace declaration', () => {
    const svgNs = 'http://www.w3.org/2000/svg'
    const xlinkNs = 'http://www.w3.org/1999/xlink'

    const doc = $$.dom.createDocument(svgNs, 'svg')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', xlinkNs)

      const script = doc.createElementNS(svgNs, 'script')
      script.setAttributeNS(null, 'type', 'text/ecmascript')
      script.setAttributeNS(xlinkNs, 'xlink:href', 'foo.js')

      doc.documentElement.appendChild(script)
    }

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<script type="text/ecmascript" xlink:href="foo.js"/>' +
      '</svg>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      svg (ns:http://www.w3.org/2000/svg) xmlns:xlink="http://www.w3.org/1999/xlink" (ns:http://www.w3.org/2000/xmlns/)
        script (ns:http://www.w3.org/2000/svg) type="text/ecmascript" xlink:href="foo.js" (ns:http://www.w3.org/1999/xlink)
      `)
  })

  test('empty default namespace', () => {
    const svgNs = 'http://www.w3.org/2000/svg'

    const doc = $$.dom.createDocument(svgNs, 'svg')
    if (doc.documentElement) {
      const script = doc.createElementNS(null, 'script')
      doc.documentElement.appendChild(script)
    }

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<script xmlns=""/>' +
      '</svg>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      svg (ns:http://www.w3.org/2000/svg)
        script
      `)
  })

  test('default namespace override', () => {
    const svgNs = 'http://www.w3.org/2000/svg'
    const xlinkNs = 'http://www.w3.org/1999/xlink'

    const doc = $$.dom.createDocument(svgNs, 'svg')
    if (doc.documentElement) {
      const script = doc.createElementNS(xlinkNs, 'script')
      doc.documentElement.appendChild(script)
    }

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<script xmlns="http://www.w3.org/1999/xlink"/>' +
      '</svg>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      svg (ns:http://www.w3.org/2000/svg)
        script (ns:http://www.w3.org/1999/xlink)
      `)
  })

  test('prefixed namespace override', () => {
    const ns1 = 'uri:my ns1'
    const ns2 = 'uri:my ns2'

    const doc = $$.dom.createDocument(ns1, 'p:root')
    if (doc.documentElement) {
      const node1 = doc.createElementNS(ns1, 'p:node')
      doc.documentElement.appendChild(node1)
      node1.appendChild(doc.createElementNS(ns1, 'p:child'))
      const node2 = doc.createElementNS(ns2, 'p:node')
      doc.documentElement.appendChild(node2)
      node2.appendChild(doc.createElementNS(ns2, 'p:child'))
      const node3 = doc.createElementNS(ns1, 'p:node')
      doc.documentElement.appendChild(node3)
      node3.appendChild(doc.createElementNS(ns1, 'p:child'))
    }

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<p:root xmlns:p="uri:my ns1">' +
      '<p:node><p:child/></p:node>' +
      '<p:node xmlns:p="uri:my ns2"><p:child/></p:node>' +
      '<p:node><p:child/></p:node>' +
      '</p:root>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      p:root (ns:uri:my ns1)
        p:node (ns:uri:my ns1)
          p:child (ns:uri:my ns1)
        p:node (ns:uri:my ns2)
          p:child (ns:uri:my ns2)
        p:node (ns:uri:my ns1)
          p:child (ns:uri:my ns1)
      `)
  })

  test('xml namespace', () => {
    const ns = 'http://www.w3.org/XML/1998/namespace'
    const doc = $$.dom.createDocument(ns, 'root')
    if (!doc.documentElement) throw new Error("Document element is null.")
    doc.documentElement.append(doc.createElement('foo'), doc.createElement('bar'))

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<xml:root><foo/><bar/></xml:root>'
    )
  })

  test('element with xmlns prefix (not well-formed)', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    const node = doc.createElementNS('http://www.w3.org/2000/xmlns/', 'xmlns:foo')

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(node)).toBe(
      '<xmlns:foo/>'
    )
  })

  test('fragment', () => {
    const ns = 'uri:myns'
    const doc = $$.dom.createDocument(ns, 'root')
    const frag = doc.createDocumentFragment()
    frag.appendChild(doc.createElementNS(ns, 'node1'))
    frag.appendChild(doc.createElementNS(ns, 'node2'))

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(frag)).toBe(
      '<node1 xmlns="uri:myns"/><node2 xmlns="uri:myns"/>'
    )
  })

  test('document type pubId, sysId', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', 'pubId', 'sysId')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root PUBLIC "pubId" "sysId"><root xmlns="uri:myns"/>'
    )
  })

  test('document type pubId', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', 'pubId', '')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root PUBLIC "pubId"><root xmlns="uri:myns"/>'
    )
  })

  test('document type sysId', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', '', 'sysId')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root SYSTEM "sysId"><root xmlns="uri:myns"/>'
    )
  })

  test('document type', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', '', '')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root><root xmlns="uri:myns"/>'
    )
  })

  test('invalid document type pubId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId\x09', 'sysId')
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doctype, true)).toThrow()
  })

  test('invalid document type sysId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId', 'sysId\x00')
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doctype, true)).toThrow()
  })

  test('invalid document type sysId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId', '"sysId\'')
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doctype, true)).toThrow()
  })

  test('invalid element name', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createElement('name')
    ele._localName = "invalid:name"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid element name', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    const ele = doc.createElementNS('otherNS', 'name')
    ele._namespacePrefix = "xmlns"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid element name', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createElement('name')
    ele._localName = "invalidname\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name')
    ele._data = "invalid\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name')
    ele._data = "comment--invalid"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name')
    ele._data = "comment-invalid-"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid text', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createTextNode('name')
    ele._data = "invalid\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._target = "invalid:target"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._target = "xml"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._data = "value\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._data = "value?>"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createCDATASection('name')
    ele._data = "value]]>"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid attribute name', () => {
    const doc = $$.dom.createDocument(null, '')
    const node1 = doc.createElement('node')
    node1.setAttribute('att', 'val1')
    node1.attributes[0]._localName = 'att:name'
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node1, true)).toThrow()
    const node2 = doc.createElement('node')
    node2.setAttribute('att', 'val1')
    node2.attributes[0]._localName = 'att\0'
    expect(() => serializer._xmlSerialization(node2, true)).toThrow()
  })

  test('invalid attributes value', () => {
    const doc = $$.dom.createDocument(null, '')
    const node = doc.createElement('node')
    node.setAttribute('att', 'val')
    node.attributes[0]._value = 'val\0'
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node, true)).toThrow()
  })

  test('invalid node type', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const invalid = doc.createElement('node')
    if (doc.documentElement) {
      doc.documentElement.appendChild(invalid)
    }
    Object.defineProperty(invalid, "nodeType", { value: 0 })

    const serializer = new XMLSerializer()
    expect(() => serializer.serializeToString(doc)).toThrow()
  })

  test('null document element', () => {
    const doc = $$.dom.createDocument(null, '')
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doc, true)).toThrow()
  })

  test('escape text', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const txt = doc.createTextNode('abc&<>abc')
    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(txt)).toBe('abc&amp;&lt;&gt;abc')
  })

  test('escape attribute value', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const node = doc.createElement('node')
    node.setAttribute('att', 'abc"&<>abc')
    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(node)).toBe('<node att="abc&quot;&amp;&lt;&gt;abc"/>')
  })

  test('null attribute value', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const node = doc.createElement('node')
    node.setAttribute('att', null as unknown as string)
    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(node)).toBe('<node att=""/>')
  })

  test('multiple attributes with same name', () => {
    const doc = $$.dom.createDocument(null, '')
    const node = doc.createElement('node')
    node.setAttribute('att', 'val1')
    node.setAttribute('att2', 'val1')
    node.attributes[1]._localName = 'att'
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node, true)).toThrow()
  })

})
