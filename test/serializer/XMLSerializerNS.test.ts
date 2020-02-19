import $$ from "../TestHelpers"

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

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
    const parser = new $$.DOMParser()
    expect(serializer.serializeToString(parser.parseFromString(xmlStr, "application/xml"))).toBe(xmlStr)
  })

  test('namespace declaration attribute', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'ns')
      doc.documentElement.appendChild(doc.createElement('foo'))
    }

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns="ns"><foo xmlns=""/></root>'
    )
    expect($$.printTree(doc)).toBe($$.t`
      root (ns:ns) xmlns="ns" (ns:http://www.w3.org/2000/xmlns/)
        foo
      `)
  })

  test('skip XML namespace declaration attribute', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:ns', 'http://www.w3.org/XML/1998/namespace')
    }

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns="ns"/>'
    )
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

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<xml:root><foo/><bar/></xml:root>'
    )
  })

  test('element with xmlns prefix (not well-formed)', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    const node = doc.createElementNS('http://www.w3.org/2000/xmlns/', 'xmlns:foo')

    const serializer = new $$.XMLSerializer()
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

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(frag)).toBe(
      '<node1 xmlns="uri:myns"/><node2 xmlns="uri:myns"/>'
    )
  })

  test('document type pubId, sysId', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', 'pubId', 'sysId')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root PUBLIC "pubId" "sysId"><root xmlns="uri:myns"/>'
    )
  })

  test('document type pubId', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', 'pubId', '')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root PUBLIC "pubId"><root xmlns="uri:myns"/>'
    )
  })

  test('document type sysId', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', '', 'sysId')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root SYSTEM "sysId"><root xmlns="uri:myns"/>'
    )
  })

  test('document type', () => {
    const ns = 'uri:myns'
    const doctype = $$.dom.createDocumentType('root', '', '')
    const doc = $$.dom.createDocument(ns, 'root', doctype)

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root><root xmlns="uri:myns"/>'
    )
  })

  test('invalid document type pubId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId\x09', 'sysId')
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doctype, true)).toThrow()
  })

  test('invalid document type sysId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId', 'sysId\x00')
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doctype, true)).toThrow()
  })

  test('invalid document type sysId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId', '"sysId\'')
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doctype, true)).toThrow()
  })

  test('invalid element name', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createElement('name')
    ele._localName = "invalid:name"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid element name', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    const ele = doc.createElementNS('otherNS', 'name')
    ele._namespacePrefix = "xmlns"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid element name', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createElement('name')
    ele._localName = "invalidname\0"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name')
    ele._data = "invalid\0"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name')
    ele._data = "comment--invalid"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name')
    ele._data = "comment-invalid-"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid text', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createTextNode('name')
    ele._data = "invalid\0"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._target = "invalid:target"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._target = "xml"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._data = "value\0"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value')
    ele._data = "value?>"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createCDATASection('name')
    ele._data = "value]]>"
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid attribute name', () => {
    const doc = $$.dom.createDocument(null, '')
    const node1 = doc.createElement('node')
    node1.setAttribute('att', 'val1')
    node1.attributes[0]._localName = 'att:name'
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node1, true)).toThrow()
    const node2 = doc.createElement('node')
    node2.setAttribute('att', 'val1')
    node2.attributes[0]._localName = 'att\0'
    expect(() => serializer._xmlSerialization(node2, true)).toThrow()
    const node3 = doc.createElement('node')
    node3.setAttribute('xmlns', 'val1')
    expect(() => serializer._xmlSerialization(node3, true)).toThrow()    
  })

  test('invalid attributes value', () => {
    const doc = $$.dom.createDocument(null, '')
    const node = doc.createElement('node')
    node.setAttribute('att', 'val')
    node.attributes[0]._value = 'val\0'
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node, true)).toThrow()
  })

  test('invalid attributes value - XMLNS', () => {
    const doc = $$.dom.createDocument(null, '')
    const node = doc.createElement('node')
    node.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:x', 'http://www.w3.org/2000/xmlns/')
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node, true)).toThrow()
  })

  test('invalid attributes value - undeclare namespace', () => {
    const doc = $$.dom.createDocument(null, '')
    const node = doc.createElement('node')
    node.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:x', '')
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node, true)).toThrow()
  })

  test('invalid node type', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const invalid = doc.createElement('node')
    if (doc.documentElement) {
      doc.documentElement.appendChild(invalid)
    }
    Object.defineProperty(invalid, "nodeType", { value: 0 })

    const serializer = new $$.XMLSerializer()
    expect(() => serializer.serializeToString(doc)).toThrow()
  })

  test('null document element', () => {
    const doc = $$.dom.createDocument(null, '')
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(doc, true)).toThrow()
  })

  test('escape text', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const txt = doc.createTextNode('abc&<>abc')
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(txt)).toBe('abc&amp;&lt;&gt;abc')
  })

  test('escape attribute value', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const node = doc.createElement('node')
    node.setAttribute('att', 'abc"&<>abc')
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(node)).toBe('<node att="abc&quot;&amp;&lt;&gt;abc"/>')
  })

  test('null attribute value', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const node = doc.createElement('node')
    node.setAttribute('att', null as unknown as string)
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(node)).toBe('<node att=""/>')
  })

  test('multiple attributes with same name', () => {
    const doc = $$.dom.createDocument(null, '')
    const node = doc.createElement('node')
    node.setAttribute('att', 'val1')
    node.setAttribute('att2', 'val1')
    node.attributes[1]._localName = 'att'
    const serializer = new $$.XMLSerializer() as any
    expect(() => serializer._xmlSerialization(node, true)).toThrow()
  })

  test('XML namespace', () => {
    const doc = $$.dom.createDocument('http://www.w3.org/XML/1998/namespace', 'root')
    if (doc.documentElement) {
      doc.documentElement.appendChild(doc.createElement('foo'))
      doc.documentElement.appendChild(doc.createElement('bar'))
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<xml:root>' +
      '<foo/>' +
      '<bar/>' +
      '</xml:root>'
    )
  })

  test('duplicate namespaces', () => {
    const doc = $$.dom.createDocument('ns1', 'd:root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:d', 'ns1')
      const e = doc.createElementNS('ns1', 'e:foo')
      e.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:e', 'ns1')
      doc.documentElement.appendChild(e)
      doc.documentElement.appendChild(doc.createElement('bar'))
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<d:root xmlns:d="ns1">' +
      '<e:foo xmlns:e="ns1"/>' +
      '<bar/>' +
      '</d:root>'
    )
  })

  test('attribute with namespace and no prefix', () => {
    const doc = $$.dom.createDocument(null, 'r')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', "xmlns:x0", "ns")
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', "xmlns:x2", "ns")
      const b = doc.createElement('b')
      b.setAttributeNS('http://www.w3.org/2000/xmlns/', "xmlns:x1", "ns")
      b.setAttributeNS("ns", "name", "v")
      doc.documentElement.appendChild(b)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<r xmlns:x0="ns" xmlns:x2="ns">' +
      '<b xmlns:x1="ns" x1:name="v"/>' +
      '</r>'
    )
  })

  test('nested default namespace declaration attributes with same namespace are ignored', () => {
    const doc = $$.dom.createDocument('ns', 'r')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'ns')
      const n = doc.createElementNS('ns', 'n')
      n.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'ns')
      doc.documentElement.appendChild(n)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<r xmlns="ns">' +
      '<n/>' +
      '</r>'
    )
  })

  test('prefix of an attribute is replaced with another existing prefix mapped to the same namespace URI', () => {
    const doc = $$.dom.createDocument(null, 'r')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xx', 'uri')
      doc.documentElement.setAttributeNS('uri', 'p:name', 'v')
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<r xmlns:xx="uri" xx:name="v"/>'
    )

    const doc2 = $$.dom.createDocument(null, 'r')
    if (doc2.documentElement) {
      doc2.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xx', 'uri')
      const b = doc2.createElement('b')
      b.setAttributeNS('uri', 'p:name', 'v')
      doc2.documentElement.appendChild(b)
    }
    expect(serializer.serializeToString(doc2)).toBe(
      '<r xmlns:xx="uri">' +
      '<b xx:name="v"/>' +
      '</r>'
    )
  })

  test('prefix of an attribute is NOT preserved if neither its prefix nor its namespace URI is not already used', () => {
    const doc = $$.dom.createDocument(null, 'r')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xx', 'uri')
      doc.documentElement.setAttributeNS('uri2', 'xx:name', 'value')
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<r xmlns:xx="uri" xmlns:ns1="uri2" ns1:name="value"/>'
    )
  })

  test('same prefix declared in an ancestor element', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:p', 'uri1')
      const child = doc.createElement('child')
      child.setAttributeNS('uri2', 'p:foobar', 'value')
      doc.documentElement.appendChild(child)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns:p="uri1">' +
      '<child xmlns:ns1="uri2" ns1:foobar="value"/>' +
      '</root>'
    )
  })

  test('drop element prefix if the namespace is same as inherited default namespace', () => {
    const doc = $$.dom.createDocument('uri', 'root')
    if (doc.documentElement) {
      const child = doc.createElementNS('uri', 'p:child')
      child.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:p', 'uri')
      doc.documentElement.appendChild(child)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns="uri">' +
      '<child xmlns:p="uri"/>' +
      '</root>'
    )
  })

  test('find an appropriate prefix', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:p1', 'u1')
      const child = doc.createElement('child')
      child.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:p2', 'u1')
      doc.documentElement.appendChild(child)
      const child2 = doc.createElementNS('u1', 'child2')
      child.appendChild(child2)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns:p1="u1">' +
      '<child xmlns:p2="u1">' +
      '<p2:child2/>' +
      '</child>' +
      '</root>'
    )
  })

  test('xmlns:* attributes', () => {
    const doc = $$.dom.createDocument('uri1', 'p:root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:p', 'uri2')
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<ns1:root xmlns:ns1="uri1" xmlns:p="uri2"/>'
    )
  })

  test('prefix re-declared in ancestor element', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:p', 'uri2')
      doc.documentElement.appendChild(doc.createElementNS('uri1', 'p:child'))
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns:p="uri2">' +
      '<p:child xmlns:p="uri1"/>' +
      '</root>'
    )
  })

  test('default namespace does not apply if was declared in an ancestor', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:x', 'uri1')
      const table = doc.createElementNS('uri1', 'table')
      table.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'uri1')
      doc.documentElement.appendChild(table)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns:x="uri1">' +
      '<x:table xmlns="uri1"/>' +
      '</root>'
    )
  })

  test('multiple generated prefixes', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      const child1 = doc.createElement('child1')
      child1.setAttributeNS('uri1', 'attr1', 'value1')
      child1.setAttributeNS('uri2', 'attr2', 'value2')
      doc.documentElement.appendChild(child1)
      const child2 = doc.createElement('child2')
      child2.setAttributeNS('uri3', 'attr3', 'value3')
      doc.documentElement.appendChild(child2)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root>' +
      '<child1 xmlns:ns1="uri1" ns1:attr1="value1" xmlns:ns2="uri2" ns2:attr2="value2"/>' +
      '<child2 xmlns:ns3="uri3" ns3:attr3="value3"/>' +
      '</root>'
    )
  })

  test('attributes in same namespace', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      const child1 = doc.createElement('child')
      child1.setAttributeNS('uri', 'attr', 'value')
      doc.documentElement.appendChild(child1)
      const child2 = doc.createElement('child')
      child2.setAttributeNS('uri', 'attr', 'value')
      doc.documentElement.appendChild(child2)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root>' +
      '<child xmlns:ns1="uri" ns1:attr="value"/>' +
      '<child xmlns:ns2="uri" ns2:attr="value"/>' +
      '</root>'
    )
  })

  test('attributes in same namespace in a single element', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('uri', 'attr1', 'value1')
      doc.documentElement.setAttributeNS('uri', 'attr2', 'value2')
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns:ns1="uri" ns1:attr1="value1" ns1:attr2="value2"/>'
    )
  })

  test('skip namespace definition attribute if it was already defined in an ancestor', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (doc.documentElement) {
      doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:x', 'v')
      const child = doc.createElement('child')
      child.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:x', 'v')
      doc.documentElement.appendChild(child)
    }
    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root xmlns:x="v">' +
      '<child/>' +
      '</root>'
    )
  })

  test('void element', () => {
    const doc = $$.dom.createHTMLDocument('title')
    const body = doc.getElementsByTagName('body')[0]
    if (body) {
      body.appendChild(doc.createElement('hr'))
    }

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE html>' +
      '<html xmlns="http://www.w3.org/1999/xhtml">' +
      '<head>' +
      '<title>title</title>' + 
      '</head>' +
      '<body>' +
      '<hr />' +
      '</body>' +
      '</html>'
    )
  })

  test('local default namespace attribute', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const de = doc.documentElement
    if (de) {
      const node = doc.createElementNS('ns1', 'x:node')
      node.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'ns2')
      de.appendChild(node)
    }

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root>' +
      '<x:node xmlns:x="ns1" xmlns="ns2"/>' + 
      '</root>'
    )
  })

  test('empty local default namespace attribute', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const de = doc.documentElement
    if (de) {
      const node = doc.createElementNS('ns1', 'x:node')
      node.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', '')
      de.appendChild(node)
    }

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<root>' +
      '<x:node xmlns:x="ns1" xmlns=""/>' + 
      '</root>'
    )
  })

})
