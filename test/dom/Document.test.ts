import $$ from "../TestHelpers"

describe('Document', () => {

  const doctype = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
  const doc = $$.dom.createDocument('myns', 'n:root', doctype)

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const tele = doc.createElement('node_with_id')
  const tele1 = doc.createElement('tagged')
  const tele2 = doc.createElement('tagged')
  const nele1 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'div')
  const text1 = doc.createTextNode('contents')
  doc.documentElement.appendChild(tele1)
  tele1.id = 'tele1'
  doc.documentElement.appendChild(tele)
  tele.id = 'uniq'
  doc.documentElement.appendChild(tele2)
  tele2.id = 'tele2'
  doc.documentElement.appendChild(nele1)
  nele1.id = 'div1'
  nele1.setAttribute('class', 'para')
  nele1.appendChild(text1)
  const sroot = doc.createElement('shadow')
  doc.documentElement.appendChild(sroot)
  const custom = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
  sroot.appendChild(custom)
  const shadow = custom.attachShadow({ mode: 'open' })

  const htmlDoc = $$.dom.createHTMLDocument('my title')

  if (!htmlDoc.documentElement)
    throw new Error("documentElement is null")

  test('constructor()', () => {
    expect($$.printTree(doc)).toBe($$.t`
      !DOCTYPE qname PUBLIC pubid sysid
      n:root (ns:myns)
        tagged id="tele1"
        node_with_id id="uniq"
        tagged id="tele2"
        div (ns:http://www.w3.org/1999/xhtml) id="div1" class="para"
          # contents
        shadow
          my-custom-element (ns:http://www.w3.org/1999/xhtml)
      `)
    expect(doc.URL).toBe('about:blank')
    expect(doc.documentURI).toBe('about:blank')
    expect(doc.origin).toBe('null')
    expect(doc.compatMode).toBe('CSS1Compat')
    expect(doc.characterSet).toBe('UTF-8')
    expect(doc.charset).toBe('UTF-8')
    expect(doc.inputEncoding).toBe('UTF-8')
    expect(doc.contentType).toBe('application/xml')
    expect(doc.nodeType).toBe(9)
    expect(doc.nodeName).toBe('#document')
    expect(doc.doctype).toBe(doctype)
    expect(doc.documentElement && doc.documentElement.tagName).toBe('n:root')
    expect(() => doc.createElement('invalid name')).toThrow()
  })

  test('doctype', () => {
    expect(doc.doctype).toBe(doctype)
    const emptyDoc = $$.dom.createDocument(null, 'root')
    expect(emptyDoc.doctype).toBe(null)
  })

  test('getElementById()', () => {
    expect(doc.getElementById('uniq')).toBe(tele)
  })

  test('getElementsByTagName()', () => {
    const list = doc.getElementsByTagName('tagged')
    expect(list.length).toBe(2)
    expect(list.item(0)).toBe(tele1)
    expect(list.item(1)).toBe(tele2)
    const listAll = doc.getElementsByTagName('*')
    expect(listAll.length).toBe(7)
  })

  test('getElementsByTagNameNS()', () => {
    const list = doc.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'div')
    expect(list.length).toBe(1)
    expect(list.item(0)).toBe(nele1)
  })

  test('getElementsByClassName()', () => {
    const list = doc.getElementsByClassName('para')
    expect(list.length).toBe(1)
    expect(list.item(0)).toBe(nele1)
    const list2 = doc.getElementsByClassName('PaRa')
    expect(list2.length).toBe(0)
    // class names are not case-sensitive in quirks mode
    const mode = doc._mode
    doc._mode = "quirks"
    const list3 = doc.getElementsByClassName('PaRa')
    expect(list3.length).toBe(1)
    expect(list3.item(0)).toBe(nele1)
    doc._mode = mode
  })

  test('createElement()', () => {
    expect(() => { doc.createElement('invalid name') }).toThrow()
    const ele = doc.createElement('tagged')
    expect(ele.tagName).toBe('tagged')
  })

  test('createElementNS()', () => {
    expect(() => { doc.createElementNS('http://www.w3.org/1999/xhtml', 'invalid name') }).toThrow()
    const ele = doc.createElementNS('http://www.w3.org/1999/xhtml', 'n:div')
    expect(ele.tagName).toBe('n:div')
    expect(ele.namespaceURI).toBe('http://www.w3.org/1999/xhtml')
    expect(ele.prefix).toBe('n')
    expect(ele.localName).toBe('div')
    expect(() => { doc.createElementNS(null, 'prefix:name') }).toThrow()
    expect(() => { doc.createElementNS('some ns', 'xml:name') }).toThrow()
    expect(() => { doc.createElementNS('some ns', 'xmlns:name') }).toThrow()
    expect(() => { doc.createElementNS('some ns', 'xmlns') }).toThrow()
    expect(() => { doc.createElementNS('http://www.w3.org/2000/xmlns/', 'some:name') }).toThrow()
    expect(() => { doc.createElementNS('http://www.w3.org/2000/xmlns/', 'somename') }).toThrow()
    // is value
    const ele2 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'n:div', {is: 'my-div'})
    expect(ele2._is).toBe('my-div')
    const ele3 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'n:div', 'my-div')
    expect(ele3._is).toBe('my-div')
  })

  test('createDocumentFragment()', () => {
    const ele = doc.createDocumentFragment()
    expect(ele.nodeType).toBe(11)
    expect(ele.nodeName).toBe('#document-fragment')
  })

  test('createTextNode()', () => {
    const ele = doc.createTextNode('contents')
    expect(ele.nodeType).toBe(3)
    expect(ele.nodeName).toBe('#text')
    expect(ele.data).toBe('contents')
  })

  test('createCDATASection()', () => {
    expect(() => { doc.createCDATASection(']]>') }).toThrow()
    const ele = doc.createCDATASection('contents')
    expect(ele.nodeType).toBe(4)
    expect(ele.nodeName).toBe('#cdata-section')
    expect(ele.data).toBe('contents')
    expect(() => htmlDoc.createCDATASection('data')).toThrow()
  })

  test('createComment()', () => {
    const ele = doc.createComment('contents')
    expect(ele.nodeType).toBe(8)
    expect(ele.nodeName).toBe('#comment')
    expect(ele.data).toBe('contents')
  })

  test('createProcessingInstruction()', () => {
    expect(() => { doc.createProcessingInstruction('invalid target', 'contents') }).toThrow()
    expect(() => { doc.createProcessingInstruction('target', '?>') }).toThrow()
    const ele = doc.createProcessingInstruction('target', 'contents')
    expect(ele.nodeType).toBe(7)
    expect(ele.nodeName).toBe('target')
    expect(ele.data).toBe('contents')
  })

  test('createAttribute()', () => {
    expect(() => { doc.createAttribute('invalid name') }).toThrow()
    const ele = doc.createAttribute('attr')
    expect(ele.name).toBe('attr')
    const att1 = htmlDoc.createAttribute('ATTR')
    expect(att1.name).toBe('attr')
  })

  test('createAttributeNS()', () => {
    expect(() => { doc.createAttributeNS('http://www.w3.org/1999/xhtml', 'invalid name') }).toThrow()
    const ele = doc.createAttributeNS('http://www.w3.org/1999/xhtml', 'n:div')
    expect(ele.name).toBe('n:div')
    expect(ele.namespaceURI).toBe('http://www.w3.org/1999/xhtml')
    expect(ele.prefix).toBe('n')
    expect(ele.localName).toBe('div')
  })

  test('importNode()', () => {
    const ele1 = doc.createElement('tagged')
    ele1.setAttribute('att', 'val')
    const ele2 = doc.importNode(ele1)
    expect(ele1).not.toBe(ele2)
    expect(ele1.nodeType).toBe(ele2.nodeType)
    expect(ele1.nodeName).toBe(ele2.nodeName)
    expect(() => doc.importNode($$.dom.createDocument('myns', 'root'))).toThrow()
    expect(() => doc.importNode(shadow)).toThrow()
  })

  test('adoptNode()', () => {
    const otherDoc = $$.dom.createDocument('myns', 'otherroot')
    const otherEle = otherDoc.createElement('othernode')
    otherEle.setAttribute('att', 'val')
    const anotherEle = otherDoc.createElement('anothernode')

    if (otherDoc.documentElement) {
      otherDoc.documentElement.appendChild(otherEle)
      otherEle.appendChild(anotherEle)
      expect(otherDoc.documentElement.firstChild).toBe(otherEle)
    }

    doc.adoptNode(otherEle)
    expect(otherEle.ownerDocument).toBe(doc)
    expect(otherEle.attributes[0].ownerDocument).toBe(doc)
    expect(anotherEle.ownerDocument).toBe(doc)
    if (otherDoc.documentElement) {
      expect(otherDoc.documentElement.firstChild).toBeNull()
    }

    expect(() => doc.adoptNode($$.dom.createDocument('myns', 'root'))).toThrow()
    expect(() => doc.adoptNode(shadow)).toThrow()
  })

  test('cloneNode()', () => {
    const clonedDoc = <any>doc.cloneNode()
    expect(clonedDoc).not.toBe(doc)
    expect(clonedDoc.URL).toBe('about:blank')
    expect(clonedDoc.documentURI).toBe('about:blank')
    expect(clonedDoc.origin).toBe('null')
    expect(clonedDoc.compatMode).toBe('CSS1Compat')
    expect(clonedDoc.characterSet).toBe('UTF-8')
    expect(clonedDoc.charset).toBe('UTF-8')
    expect(clonedDoc.inputEncoding).toBe('UTF-8')
    expect(clonedDoc.contentType).toBe('application/xml')
    expect(clonedDoc.nodeType).toBe(9)
    expect(clonedDoc.nodeName).toBe('#document')
    expect(clonedDoc.doctype).toBeNull()
    expect(clonedDoc.documentElement).toBeNull()
  })

  test('cloneNode(deep: true)', () => {
    const clonedDoc = <any>doc.cloneNode(true)
    expect(clonedDoc).not.toBe(doc)
    expect(clonedDoc.URL).toBe('about:blank')
    expect(clonedDoc.documentURI).toBe('about:blank')
    expect(clonedDoc.origin).toBe('null')
    expect(clonedDoc.compatMode).toBe('CSS1Compat')
    expect(clonedDoc.characterSet).toBe('UTF-8')
    expect(clonedDoc.charset).toBe('UTF-8')
    expect(clonedDoc.inputEncoding).toBe('UTF-8')
    expect(clonedDoc.contentType).toBe('application/xml')
    expect(clonedDoc.nodeType).toBe(9)
    expect(clonedDoc.nodeName).toBe('#document')
    expect(clonedDoc.doctype.name).toBe('qname')
    expect(clonedDoc.documentElement.tagName).toBe('n:root')
  })

  test('lookupPrefix()', () => {
    expect(doc.lookupPrefix('myns')).toBe('n')
    expect(doc.lookupPrefix(null)).toBeNull()
    const emptyDoc = $$.dom.createDocument(null, '')
    expect(emptyDoc.lookupPrefix('myns')).toBeNull()
  })

  test('lookupNamespaceURI()', () => {
    expect(doc.lookupNamespaceURI('n')).toBe('myns')
    expect(doc.lookupNamespaceURI(null)).toBeNull()
    const emptyDoc = $$.dom.createDocument(null, '')
    expect(emptyDoc.lookupNamespaceURI(null)).toBeNull()
  })

  test('Unsupported Methods', () => {
    expect(() => { doc.createEvent('mouseevent') }).toThrow()
  })

  test('createNodeIterator()', () => {
    const ele = doc.getElementById('tele1')
    if (!ele)
      throw new Error("element is null")

    const iter = doc.createNodeIterator(ele)
    let str = ''
    let node = iter.nextNode()
    while(node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    expect(str).toBe(':tagged:node_with_id:tagged:div:#text:shadow:my-custom-element')
  })

  test('implementation', () => {
    const impl = doc.implementation
    expect(impl.createDocument).not.toBeUndefined()
  })

  test('quirks mode', () => {
    const docImpl = doc as any
    docImpl._mode = "quirks"
    expect(doc.compatMode).toBe('BackCompat')
  })

  test('createElement - HTML', () => {
    const ele = htmlDoc.createElement('H1')
    expect(ele.localName).toBe('h1')
    const customEle1 = htmlDoc.createElement('BUTTON', 'custom-button')
    expect(customEle1.localName).toBe('button')
    const customEle2 = htmlDoc.createElement('BUTTON', { is: 'custom-button' })
    expect(customEle2.localName).toBe('button')
  })

})