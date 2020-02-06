import $$ from "../TestHelpers"
import { XMLSerializerNoNSImpl as XMLSerializer } from "../../src/serializer/XMLSerializerNoNSImpl"

describe('XMLSerializer', () => {

  test('basic', () => {
    const doc = $$.dom.createDocument(null, 'root')
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
      '<root>' +
      '<node att="val"/>' +
      '<!--same node below-->' +
      '<node att="val" att2="val2"/>' +
      '<?kidding itwas="different"?>' +
      '<?for real?>' +
      '<![CDATA[<greeting>Hello, world!</greeting>]]>' +
      '<text>alien\'s pinky toe</text>' +
      '</root>'
    )
  })

  test('serializer + parser', () => {
    const xmlStr =
      '<section>' +
      '<title>Book-Signing Event</title>' +
      '<signing>' +
      '<author title="Mr" name="Jim Ross"/>' +
      '<book title="Writing COBOL for Fun and Profit" number="0426070806"/>' +
      '<comment>What a great issue!</comment>' +
      '</signing>' +
      '</section>'

      const serializer = new XMLSerializer()
      const parser = new $$.DOMParser()
      expect(serializer.serializeToString(parser.parseFromString(xmlStr, "application/xml"))).toBe(xmlStr)
  })

  test('fragment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const frag = doc.createDocumentFragment()
    frag.appendChild(doc.createElement('node1'))
    frag.appendChild(doc.createElement('node2'))

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(frag)).toBe(
      '<node1/><node2/>'
    )
  })

  test('document type pubId, sysId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId', 'sysId')
    const doc = $$.dom.createDocument(null, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root PUBLIC "pubId" "sysId"><root/>'
    )
  })

  test('document type pubId', () => {
    const doctype = $$.dom.createDocumentType('root', 'pubId', '')
    const doc = $$.dom.createDocument(null, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root PUBLIC "pubId"><root/>'
    )
  })

  test('document type sysId', () => {
    const doctype = $$.dom.createDocumentType('root', '', 'sysId')
    const doc = $$.dom.createDocument(null, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root SYSTEM "sysId"><root/>'
    )
  })

  test('document type', () => {
    const doctype = $$.dom.createDocumentType('root', '', '')
    const doc = $$.dom.createDocument(null, 'root', doctype)

    const serializer = new XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe(
      '<!DOCTYPE root><root/>'
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
    const ele = doc.createElement('name') as any
    ele._localName = "invalid:name"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid element name', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createElement('name') as any
    ele._localName = "invalidname\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name') as any
    ele._data = "invalid\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name') as any
    ele._data = "comment--invalid"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid comment', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createComment('name') as any
    ele._data = "comment-invalid-"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid text', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createTextNode('name') as any
    ele._data = "invalid\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value') as any
    ele._target = "invalid:target"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value') as any
    ele._target = "xml"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value') as any
    ele._data = "value\0"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createProcessingInstruction('name', 'value') as any
    ele._data = "value?>"
    const serializer = new XMLSerializer() as any
    expect(() => serializer._xmlSerialization(ele, true)).toThrow()
  })

  test('invalid processing instruction', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const ele = doc.createCDATASection('name') as any
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
