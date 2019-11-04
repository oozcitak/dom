import $$ from '../TestHelpers'

describe('Tree', () => {

  test('getDescendantNodes()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)
    const shadowRoot = elewithshadow.attachShadow({ mode: 'open'})
    shadowRoot.appendChild(doc.createElement('sh1'))
    shadowRoot.appendChild(doc.createTextNode('shtext'))
    shadowRoot.appendChild(doc.createElement('sh2'))

    let str = ''
    for (const childNode of $$.algo.tree.getDescendantNodes(doc as any, true, true, (node) => { return (node.nodeType === 3) })) {
        str += childNode.nodeValue + ' '
    }
    expect(str).toBe('text shtext ')
  })

  test('getDescendantElements()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('sele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)
    const shadowRoot = elewithshadow.attachShadow({ mode: 'open'})
    shadowRoot.appendChild(doc.createElement('sh1'))
    shadowRoot.appendChild(doc.createTextNode('shtext'))
    shadowRoot.appendChild(doc.createElement('sh2'))

    let str = ''
    for (const childNode of $$.algo.tree.getDescendantElements(doc as any, true, true, (node) => { return node.nodeName.startsWith('s') })) {
        str += childNode.nodeName + ' '
    }
    expect(str).toBe('sele sh1 sh2 ')
  })

  test('getSiblingNodes()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const txt1 = doc.createTextNode('text1')
    const txt2 = doc.createTextNode('text2')
    const ele = [ doc.createElement('ele'),
      txt1,
      doc.createComment('comment'),
      txt2]
    de.append(...ele)

    let str = ''
    for (const childNode of $$.algo.tree.getSiblingNodes(txt1 as any, true, (node) => { return (node.nodeType === 3) })) {
      str += childNode.nodeValue + ' '
    }
    expect(str).toBe('text1 text2 ')
    str = ''
    for (const childNode of $$.algo.tree.getSiblingNodes(txt1 as any, false, (node) => { return (node.nodeType === 3) })) {
      str += childNode.nodeValue + ' '
    }
    expect(str).toBe('text2 ')
    let count = 0
    for (const _ of $$.algo.tree.getSiblingNodes(txt1 as any)) {
      count++
    }
    expect(count).toBe(3)
  })

  test('isConstrained()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pub', 'sys')
    const doc = $$.dom.createDocument('ns', '')
    
    doc.appendChild(doc.createComment('comment'))
    doc.appendChild(doc.createProcessingInstruction('target', 'data'))
    doc.appendChild(doctype)
    doc.appendChild(doc.createComment('comment'))
    doc.appendChild(doc.createProcessingInstruction('target', 'data'))
    doc.appendChild(doc.createElement('root'))
    doc.appendChild(doc.createComment('comment'))
    doc.appendChild(doc.createProcessingInstruction('target', 'data'))
    
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const ele = doc.createElement('ele')
    de.append(
      doc.createComment('comment'),
      doc.createProcessingInstruction('target', 'data'),
      doc.createCDATASection('cdata'),
      doc.createTextNode('text'),
      ele,
      doc.createComment('comment'),
      doc.createProcessingInstruction('target', 'data'),      
      doc.createCDATASection('cdata'),
      doc.createTextNode('text')
    )
    ele.append(
      doc.createComment('comment'),
      doc.createProcessingInstruction('target', 'data'),
      doc.createCDATASection('cdata'),
      doc.createTextNode('text'),
      doc.createComment('comment'),
      doc.createProcessingInstruction('target', 'data'),      
      doc.createCDATASection('cdata'),
      doc.createTextNode('text')
    )    

    expect($$.algo.tree.isConstrained(doc as any)).toBe(true)
  })

  test('isConstrained() - two doctypes', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const doctype1 = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    const doctype2 = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    doc._children.add(doctype1)
    doc._children.add(doctype2)
    doctype1._parent = doc
    doctype2._parent = doc
    expect($$.algo.tree.isConstrained(doc as any)).toBe(false)
  })

  test('isConstrained() - doctype after element', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const ele = doc.createElement('root') as any
    const doctype = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    doc._children.add(ele)
    doc._children.add(doctype)
    ele._parent = doc
    doctype._parent = doc
    expect($$.algo.tree.isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - two document elements', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const ele1 = doc.createElement('root') as any
    const ele2 = doc.createElement('root') as any
    doc._children.add(ele1)
    doc._children.add(ele2)
    ele1._parent = doc
    ele2._parent = doc
    expect($$.algo.tree.isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - text at root level', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const node = doc.createTextNode('root') as any
    doc._children.add(node)
    node._parent = doc
    expect($$.algo.tree.isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - CDATA at root level', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const node = doc.createCDATASection('root') as any
    doc._children.add(node)
    node._parent = doc
    expect($$.algo.tree.isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - doctype in fragment', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const frag = doc.createDocumentFragment() as any
    const doctype = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    frag._children.add(doctype)
    doctype._parent = frag
    expect($$.algo.tree.isConstrained(frag)).toBe(false)
  })

  test('isConstrained() - doctype inside element node', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const doctype = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    const de = doc.createElement('root') as any
    const ele = doc.createElement('root') as any
    doc.appendChild(de)
    de.appendChild(ele)
    de._children.add(doctype)
    doctype._parent = ele
    expect($$.algo.tree.isConstrained(doc)).toBe(false)
  })

  test('nodeLength()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const ele = [ doc.createElement('sele'),
      doc.createTextNode('text'),
      doc.createComment('comment')]
    de.append(...ele)

    expect($$.algo.tree.nodeLength(doctype as any)).toBe(0)
    expect($$.algo.tree.nodeLength(de as any)).toBe(3)
    expect($$.algo.tree.nodeLength(ele[1] as any)).toBe(4)
  })

  test('isEmpty()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const ele = [ doc.createElement('sele'),
      doc.createTextNode('text'),
      doc.createComment('comment')]
    de.append(...ele)

    expect($$.algo.tree.isEmpty(doctype as any)).toBe(true)
    expect($$.algo.tree.isEmpty(de as any)).toBe(false)
    expect($$.algo.tree.isEmpty(ele[1] as any)).toBe(false)
  })

  test('rootNode()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const ele = [ doc.createElement('sele'),
      doc.createTextNode('text'),
      doc.createComment('comment')]
    de.append(...ele)

    expect($$.algo.tree.rootNode(de as any)).toBe(doc)
  })

  test('isDescendantOf()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)
    const shadowRoot = elewithshadow.attachShadow({ mode: 'open'})
    const shtext = doc.createTextNode('shtext')
    shadowRoot.appendChild(doc.createElement('sh1'))
    shadowRoot.appendChild(shtext)
    shadowRoot.appendChild(doc.createElement('sh2'))

    expect($$.algo.tree.isDescendantOf(de as any, de as any)).toBe(false)
    expect($$.algo.tree.isDescendantOf(de as any, de as any, true)).toBe(true)
    expect($$.algo.tree.isDescendantOf(de as any, ele[0] as any)).toBe(true)
    expect($$.algo.tree.isDescendantOf(de as any, shtext as any)).toBe(false)
    expect($$.algo.tree.isDescendantOf(de as any, shtext as any, false, true)).toBe(true)
  })

  test('isAncestorOf()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)
    const shadowRoot = elewithshadow.attachShadow({ mode: 'open'})
    const shtext = doc.createTextNode('shtext')
    shadowRoot.appendChild(doc.createElement('sh1'))
    shadowRoot.appendChild(shtext)
    shadowRoot.appendChild(doc.createElement('sh2'))

    expect($$.algo.tree.isAncestorOf(de as any, de as any)).toBe(false)
    expect($$.algo.tree.isAncestorOf(de as any, de as any, true)).toBe(true)
    expect($$.algo.tree.isAncestorOf(ele[0] as any, de as any)).toBe(true)
    expect($$.algo.tree.isAncestorOf(shtext as any, de as any)).toBe(false)
    expect($$.algo.tree.isAncestorOf(shtext as any, de as any, false, true)).toBe(true)
  })

  test('isSiblingOf()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)
    const shadowRoot = elewithshadow.attachShadow({ mode: 'open'})
    const shele = doc.createElement('sh1')
    const shtext = doc.createTextNode('shtext')
    shadowRoot.appendChild(shele)
    shadowRoot.appendChild(shtext)
    shadowRoot.appendChild(doc.createElement('sh2'))

    expect($$.algo.tree.isSiblingOf(de as any, de as any)).toBe(false)
    expect($$.algo.tree.isSiblingOf(de as any, de as any, true)).toBe(true)
    expect($$.algo.tree.isSiblingOf(ele[0] as any, de as any)).toBe(false)
    expect($$.algo.tree.isSiblingOf(ele[0] as any, ele[1] as any)).toBe(true)
    expect($$.algo.tree.isSiblingOf(shtext as any, shele as any)).toBe(true)
  })

  test('isPreceding()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)

    expect($$.algo.tree.isPreceding(de as any, de as any)).toBe(false)
    expect($$.algo.tree.isPreceding(ele[0] as any, de as any)).toBe(true)
    expect($$.algo.tree.isPreceding(de as any, ele[0] as any)).toBe(false)
    expect($$.algo.tree.isPreceding(ele[1] as any, ele[0] as any)).toBe(true)
    // free node
    const freeEle = doc.createElement('free')
    expect($$.algo.tree.isPreceding(de as any, freeEle as any)).toBe(false)
    // from another doc
    const doc2 = $$.dom.createDocument('my ns', 'root2')
    if (!doc2.documentElement)
      throw new Error("documentElement is null")
    const de2 = doc2.documentElement
    expect($$.algo.tree.isPreceding(de as any, de2 as any)).toBe(false)
  })

  test('isFollowing()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)

    expect($$.algo.tree.isFollowing(de as any, de as any)).toBe(false)
    expect($$.algo.tree.isFollowing(ele[0] as any, de as any)).toBe(false)
    expect($$.algo.tree.isFollowing(de as any, ele[0] as any)).toBe(true)
    expect($$.algo.tree.isFollowing(ele[0] as any, ele[1] as any)).toBe(true)
    // free node
    const freeEle = doc.createElement('free')
    expect($$.algo.tree.isFollowing(de as any, freeEle as any)).toBe(false)
    // from another doc
    const doc2 = $$.dom.createDocument('my ns', 'root2')
    if (!doc2.documentElement)
      throw new Error("documentElement is null")
    const de2 = doc2.documentElement
    expect($$.algo.tree.isFollowing(de as any, de2 as any)).toBe(false)
  })

  test('firstChild()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)
    const shadowRoot = elewithshadow.attachShadow({ mode: 'open'})
    const shele = doc.createElement('sh1')
    const shtext = doc.createTextNode('shtext')
    shadowRoot.appendChild(shele)
    shadowRoot.appendChild(shtext)
    shadowRoot.appendChild(doc.createElement('sh2'))

    expect($$.algo.tree.firstChild(de as any)).toBe(ele[0])
    expect($$.algo.tree.firstChild(shadowRoot as any)).toBe(shele)
  })

  test('lastChild()', () => {
    const doctype = $$.dom.createDocumentType('name', 'pubId', 'sysId')
    const doc = $$.dom.createDocument('my ns', 'root', doctype)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const elewithshadow = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const ele = [ doc.createElement('ele'),
      doc.createTextNode('text'),
      elewithshadow,
      doc.createComment('comment')]
    de.append(...ele)
    const shadowRoot = elewithshadow.attachShadow({ mode: 'open'})
    const shele = doc.createElement('sh1')
    const shtext = doc.createTextNode('shtext')
    shadowRoot.appendChild(shele)
    shadowRoot.appendChild(shtext)

    expect($$.algo.tree.lastChild(de as any)).toBe(ele[3])
    expect($$.algo.tree.lastChild(shadowRoot as any)).toBe(shtext)
  })

})