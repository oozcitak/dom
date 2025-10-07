import $$ from "../TestHelpers"

$$.suite('Document', () => {

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

  $$.test('constructor()', () => {
    $$.deepEqual($$.printTree(doc), $$.t`
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
    $$.deepEqual(doc.URL, 'about:blank')
    $$.deepEqual(doc.documentURI, 'about:blank')
    $$.deepEqual(doc.origin, 'null')
    $$.deepEqual(doc.compatMode, 'CSS1Compat')
    $$.deepEqual(doc.characterSet, 'UTF-8')
    $$.deepEqual(doc.charset, 'UTF-8')
    $$.deepEqual(doc.inputEncoding, 'UTF-8')
    $$.deepEqual(doc.contentType, 'application/xml')
    $$.deepEqual(doc.nodeType, 9)
    $$.deepEqual(doc.nodeName, '#document')
    $$.deepEqual(doc.doctype, doctype)
    $$.deepEqual(doc.documentElement && doc.documentElement.tagName, 'n:root')
    $$.throws(() => doc.createElement('invalid name'))
  })

  $$.test('doctype', () => {
    $$.deepEqual(doc.doctype, doctype)
    const emptyDoc = $$.dom.createDocument(null, 'root')
    $$.deepEqual(emptyDoc.doctype, null)
  })

  $$.test('getElementById()', () => {
    $$.deepEqual(doc.getElementById('uniq'), tele)
  })

  $$.test('getElementsByTagName()', () => {
    const list = doc.getElementsByTagName('tagged')
    $$.deepEqual(list.length, 2)
    $$.deepEqual(list.item(0), tele1)
    $$.deepEqual(list.item(1), tele2)
    const listAll = doc.getElementsByTagName('*')
    $$.deepEqual(listAll.length, 7)
  })

  $$.test('getElementsByTagNameNS()', () => {
    const list = doc.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'div')
    $$.deepEqual(list.length, 1)
    $$.deepEqual(list.item(0), nele1)
  })

  $$.test('getElementsByClassName()', () => {
    const list = doc.getElementsByClassName('para')
    $$.deepEqual(list.length, 1)
    $$.deepEqual(list.item(0), nele1)
    const list2 = doc.getElementsByClassName('PaRa')
    $$.deepEqual(list2.length, 0)
    // class names are not case-sensitive in quirks mode
    const mode = doc._mode
    doc._mode = "quirks"
    const list3 = doc.getElementsByClassName('PaRa')
    $$.deepEqual(list3.length, 1)
    $$.deepEqual(list3.item(0), nele1)
    doc._mode = mode
  })

  $$.test('createElement()', () => {
    $$.throws(() => { doc.createElement('invalid name') })
    const ele = doc.createElement('tagged')
    $$.deepEqual(ele.tagName, 'tagged')
  })

  $$.test('createElementNS()', () => {
    $$.throws(() => { doc.createElementNS('http://www.w3.org/1999/xhtml', 'invalid name') })
    const ele = doc.createElementNS('http://www.w3.org/1999/xhtml', 'n:div')
    $$.deepEqual(ele.tagName, 'n:div')
    $$.deepEqual(ele.namespaceURI, 'http://www.w3.org/1999/xhtml')
    $$.deepEqual(ele.prefix, 'n')
    $$.deepEqual(ele.localName, 'div')
    $$.throws(() => { doc.createElementNS(null, 'prefix:name') })
    $$.throws(() => { doc.createElementNS('some ns', 'xml:name') })
    $$.throws(() => { doc.createElementNS('some ns', 'xmlns:name') })
    $$.throws(() => { doc.createElementNS('some ns', 'xmlns') })
    $$.throws(() => { doc.createElementNS('http://www.w3.org/2000/xmlns/', 'some:name') })
    $$.throws(() => { doc.createElementNS('http://www.w3.org/2000/xmlns/', 'somename') })
    // is value
    const ele2 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'n:div', {is: 'my-div'})
    $$.deepEqual(ele2._is, 'my-div')
    const ele3 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'n:div', 'my-div')
    $$.deepEqual(ele3._is, 'my-div')
  })

  $$.test('createDocumentFragment()', () => {
    const ele = doc.createDocumentFragment()
    $$.deepEqual(ele.nodeType, 11)
    $$.deepEqual(ele.nodeName, '#document-fragment')
  })

  $$.test('createTextNode()', () => {
    const ele = doc.createTextNode('contents')
    $$.deepEqual(ele.nodeType, 3)
    $$.deepEqual(ele.nodeName, '#text')
    $$.deepEqual(ele.data, 'contents')
  })

  $$.test('createCDATASection()', () => {
    $$.throws(() => { doc.createCDATASection(']]>') })
    const ele = doc.createCDATASection('contents')
    $$.deepEqual(ele.nodeType, 4)
    $$.deepEqual(ele.nodeName, '#cdata-section')
    $$.deepEqual(ele.data, 'contents')
    $$.throws(() => htmlDoc.createCDATASection('data'))
  })

  $$.test('createComment()', () => {
    const ele = doc.createComment('contents')
    $$.deepEqual(ele.nodeType, 8)
    $$.deepEqual(ele.nodeName, '#comment')
    $$.deepEqual(ele.data, 'contents')
  })

  $$.test('createProcessingInstruction()', () => {
    $$.throws(() => { doc.createProcessingInstruction('invalid target', 'contents') })
    $$.throws(() => { doc.createProcessingInstruction('target', '?>') })
    const ele = doc.createProcessingInstruction('target', 'contents')
    $$.deepEqual(ele.nodeType, 7)
    $$.deepEqual(ele.nodeName, 'target')
    $$.deepEqual(ele.data, 'contents')
  })

  $$.test('createAttribute()', () => {
    $$.throws(() => { doc.createAttribute('invalid name') })
    const ele = doc.createAttribute('attr')
    $$.deepEqual(ele.name, 'attr')
    const att1 = htmlDoc.createAttribute('ATTR')
    $$.deepEqual(att1.name, 'attr')
  })

  $$.test('createAttributeNS()', () => {
    $$.throws(() => { doc.createAttributeNS('http://www.w3.org/1999/xhtml', 'invalid name') })
    const ele = doc.createAttributeNS('http://www.w3.org/1999/xhtml', 'n:div')
    $$.deepEqual(ele.name, 'n:div')
    $$.deepEqual(ele.namespaceURI, 'http://www.w3.org/1999/xhtml')
    $$.deepEqual(ele.prefix, 'n')
    $$.deepEqual(ele.localName, 'div')
  })

  $$.test('importNode()', () => {
    const ele1 = doc.createElement('tagged')
    ele1.setAttribute('att', 'val')
    const ele2 = doc.importNode(ele1)
    $$.notStrictEqual(ele1, ele2)
    $$.deepEqual(ele1.nodeType, ele2.nodeType)
    $$.deepEqual(ele1.nodeName, ele2.nodeName)
    $$.throws(() => doc.importNode($$.dom.createDocument('myns', 'root')))
    $$.throws(() => doc.importNode(shadow))
  })

  $$.test('adoptNode()', () => {
    const otherDoc = $$.dom.createDocument('myns', 'otherroot')
    const otherEle = otherDoc.createElement('othernode')
    otherEle.setAttribute('att', 'val')
    const anotherEle = otherDoc.createElement('anothernode')

    if (otherDoc.documentElement) {
      otherDoc.documentElement.appendChild(otherEle)
      otherEle.appendChild(anotherEle)
      $$.deepEqual(otherDoc.documentElement.firstChild, otherEle)
    }

    doc.adoptNode(otherEle)
    $$.deepEqual(otherEle.ownerDocument, doc)
    $$.deepEqual(otherEle.attributes[0].ownerDocument, doc)
    $$.deepEqual(anotherEle.ownerDocument, doc)
    if (otherDoc.documentElement) {
      $$.deepEqual(otherDoc.documentElement.firstChild, null)
    }

    $$.throws(() => doc.adoptNode($$.dom.createDocument('myns', 'root')))
    $$.throws(() => doc.adoptNode(shadow))
  })

  $$.test('cloneNode()', () => {
    const clonedDoc = <any>doc.cloneNode()
    $$.notDeepEqual(clonedDoc, doc)
    $$.deepEqual(clonedDoc.URL, 'about:blank')
    $$.deepEqual(clonedDoc.documentURI, 'about:blank')
    $$.deepEqual(clonedDoc.origin, 'null')
    $$.deepEqual(clonedDoc.compatMode, 'CSS1Compat')
    $$.deepEqual(clonedDoc.characterSet, 'UTF-8')
    $$.deepEqual(clonedDoc.charset, 'UTF-8')
    $$.deepEqual(clonedDoc.inputEncoding, 'UTF-8')
    $$.deepEqual(clonedDoc.contentType, 'application/xml')
    $$.deepEqual(clonedDoc.nodeType, 9)
    $$.deepEqual(clonedDoc.nodeName, '#document')
    $$.deepEqual(clonedDoc.doctype, null)
    $$.deepEqual(clonedDoc.documentElement, null)
  })

  $$.test('cloneNode(deep: true)', () => {
    const clonedDoc = <any>doc.cloneNode(true)
    $$.notDeepEqual(clonedDoc, doc)
    $$.deepEqual(clonedDoc.URL, 'about:blank')
    $$.deepEqual(clonedDoc.documentURI, 'about:blank')
    $$.deepEqual(clonedDoc.origin, 'null')
    $$.deepEqual(clonedDoc.compatMode, 'CSS1Compat')
    $$.deepEqual(clonedDoc.characterSet, 'UTF-8')
    $$.deepEqual(clonedDoc.charset, 'UTF-8')
    $$.deepEqual(clonedDoc.inputEncoding, 'UTF-8')
    $$.deepEqual(clonedDoc.contentType, 'application/xml')
    $$.deepEqual(clonedDoc.nodeType, 9)
    $$.deepEqual(clonedDoc.nodeName, '#document')
    $$.deepEqual(clonedDoc.doctype.name, 'qname')
    $$.deepEqual(clonedDoc.documentElement.tagName, 'n:root')
  })

  $$.test('lookupPrefix()', () => {
    $$.deepEqual(doc.lookupPrefix('myns'), 'n')
    $$.deepEqual(doc.lookupPrefix(null), null)
    const emptyDoc = $$.dom.createDocument(null, '')
    $$.deepEqual(emptyDoc.lookupPrefix('myns'), null)
  })

  $$.test('lookupNamespaceURI()', () => {
    $$.deepEqual(doc.lookupNamespaceURI('n'), 'myns')
    $$.deepEqual(doc.lookupNamespaceURI(null), null)
    const emptyDoc = $$.dom.createDocument(null, '')
    $$.deepEqual(emptyDoc.lookupNamespaceURI(null), null)
  })

  $$.test('Unsupported Methods', () => {
    $$.throws(() => { doc.createEvent('mouseevent') })
  })

  $$.test('createNodeIterator()', () => {
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
    $$.deepEqual(str, ':tagged:node_with_id:tagged:div:#text:shadow:my-custom-element')
  })

  $$.test('implementation', () => {
    const impl = doc.implementation
    $$.notDeepEqual(impl.createDocument, undefined)
  })

  $$.test('quirks mode', () => {
    const docImpl = doc as any
    docImpl._mode = "quirks"
    $$.deepEqual(doc.compatMode, 'BackCompat')
  })

  $$.test('createElement - HTML', () => {
    const ele = htmlDoc.createElement('H1')
    $$.deepEqual(ele.localName, 'h1')
    const customEle1 = htmlDoc.createElement('BUTTON', 'custom-button')
    $$.deepEqual(customEle1.localName, 'button')
    const customEle2 = htmlDoc.createElement('BUTTON', { is: 'custom-button' })
    $$.deepEqual(customEle2.localName, 'button')
  })

})