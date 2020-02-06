import $$ from "../TestHelpers"
import { 
  tree_getDescendantNodes, tree_getDescendantElements, tree_getSiblingNodes, 
  tree_isConstrained, tree_nodeLength, tree_isEmpty, tree_rootNode, 
  tree_isDescendantOf, tree_isAncestorOf, tree_isSiblingOf, tree_isPreceding,
  tree_isFollowing, tree_firstChild, tree_lastChild, tree_getAncestorNodes, 
  tree_getCommonAncestor
} from "../../src/algorithm"

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
    for (const childNode of tree_getDescendantNodes(doc as any, true, true, (node) => { return (node.nodeType === 3) })) {
        str += childNode.nodeValue + ' '
    }
    expect(str).toBe('text shtext ')
  })

  test('getDescendantNodes() with no descendants', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement

    let str = ''
    for (const childNode of tree_getDescendantNodes(de)) {
        str += childNode.nodeValue + ' '
    }
    expect(str).toBe('')
  })

  test('getDescendantNodes() with self=true', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    de.appendChild(doc.createElement('node'))
    de.appendChild(doc.createElement('node'))

    let str = ''
    for (const childNode of tree_getDescendantNodes(de, true)) {
        str += childNode.nodeName + ' '
    }
    expect(str).toBe('root node node ')
  })

  test('getDescendantNodes() with self=false', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    de.appendChild(doc.createElement('node'))
    de.appendChild(doc.createElement('node'))

    let str = ''
    for (const childNode of tree_getDescendantNodes(de)) {
        str += childNode.nodeName + ' '
    }
    expect(str).toBe('node node ')
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
    for (const childNode of tree_getDescendantElements(doc, true, true, (node) => { return node.nodeName.startsWith('s') })) {
        str += childNode.nodeName + ' '
    }
    expect(str).toBe('sele sh1 sh2 ')
  })

  test('getDescendantElements() with no descendants', () => {
    const doc = $$.dom.createDocument(null, 'root')
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement

    let str = ''
    for (const childNode of tree_getDescendantElements(de)) {
        str += childNode.nodeValue + ' '
    }
    expect(str).toBe('')
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
    for (const childNode of tree_getSiblingNodes(txt1 as any, true, (node) => { return (node.nodeType === 3) })) {
      str += childNode.nodeValue + ' '
    }
    expect(str).toBe('text1 text2 ')
    str = ''
    for (const childNode of tree_getSiblingNodes(txt1 as any, false, (node) => { return (node.nodeType === 3) })) {
      str += childNode.nodeValue + ' '
    }
    expect(str).toBe('text2 ')
    let count = 0
    for (const _ of tree_getSiblingNodes(txt1 as any)) {
      count++
    }
    expect(count).toBe(3)
  })

  test('getSiblingNodes() with no siblings', () => {
    const doc = $$.dom.createDocument(null, 'root')
    const node = doc.createElement('node')

    let str = ''
    for (const childNode of tree_getSiblingNodes(node)) {
        str += childNode.nodeValue + ' '
    }
    expect(str).toBe('')
  })

  test('getAncestorNodes()', () => {
    const doc = $$.dom.createDocument('my ns', 'root', null)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const node1 = doc.createElement('node1')
    const node2 = doc.createElement('node2')
    const node3 = doc.createElement('node3')
    const node4 = doc.createElement('node4')
    de.appendChild(node1)
    node1.appendChild(node2)
    node2.appendChild(node3)
    node3.appendChild(node4)

    let str = ''
    for (const childNode of tree_getAncestorNodes(node4)) {
      str += childNode.nodeName + ' '
    }
    expect(str).toBe('node3 node2 node1 root #document ')
  })

  test('getAncestorNodes() with self=true', () => {
    const doc = $$.dom.createDocument('my ns', 'root', null)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const node1 = doc.createElement('node1')
    const node2 = doc.createElement('bode2')
    const node3 = doc.createElement('node3')
    const node4 = doc.createElement('bode4')
    de.appendChild(node1)
    node1.appendChild(node2)
    node2.appendChild(node3)
    node3.appendChild(node4)

    let str = ''
    for (const childNode of tree_getAncestorNodes(node4, true, (node) => { return (node.nodeName.startsWith('n')) })) {
      str += childNode.nodeName + ' '
    }
    expect(str).toBe('node3 node1 ')
  })

  test('getAncestorNodes() with self=false', () => {
    const doc = $$.dom.createDocument('my ns', 'root', null)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const node1 = doc.createElement('node1')
    const node2 = doc.createElement('bode2')
    const node3 = doc.createElement('node3')
    const node4 = doc.createElement('node4')
    de.appendChild(node1)
    node1.appendChild(node2)
    node2.appendChild(node3)
    node3.appendChild(node4)

    let str = ''
    for (const childNode of tree_getAncestorNodes(node4, false, (node) => { return (node.nodeName.startsWith('n')) })) {
      str += childNode.nodeName + ' '
    }
    expect(str).toBe('node3 node1 ')
  })

  test('getAncestorNodes() without ancestors', () => {
    const doc = $$.dom.createDocument('my ns', 'root', null)
    const node = doc.createElement('node')

    let str = ''
    for (const childNode of tree_getAncestorNodes(node)) {
      str += childNode.nodeName + ' '
    }
    expect(str).toBe('')
  })

  test('getCommonAncestor()', () => {
    const doc = $$.dom.createDocument('my ns', 'root', null)
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const node11 = doc.createElement('node1-1')
    const node12 = doc.createElement('node1-2')
    const node13 = doc.createElement('node1-3')
    const node14 = doc.createElement('node1-4')
    de.appendChild(node11)
    node11.appendChild(node12)
    node12.appendChild(node13)
    node13.appendChild(node14)
    const node21 = doc.createElement('node2-1')
    const node22 = doc.createElement('node2-2')
    const node23 = doc.createElement('node2-3')
    const node24 = doc.createElement('node2-4')
    de.appendChild(node21)
    node21.appendChild(node22)
    node22.appendChild(node23)
    node23.appendChild(node24)

    expect(tree_getCommonAncestor(node11, node11)).toBe(de)
    expect(tree_getCommonAncestor(node24, node13)).toBe(de)
    expect(tree_getCommonAncestor(node11, node13)).toBe(node11)

    const node3 = doc.createElement('node3')
    expect(tree_getCommonAncestor(node11, node3)).toBeNull()
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

    expect(tree_isConstrained(doc as any)).toBe(true)
  })

  test('isConstrained() - two doctypes', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const doctype1 = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    const doctype2 = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    doc._children.add(doctype1)
    doc._children.add(doctype2)
    doctype1._parent = doc
    doctype2._parent = doc
    expect(tree_isConstrained(doc as any)).toBe(false)
  })

  test('isConstrained() - doctype after element', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const ele = doc.createElement('root') as any
    const doctype = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    doc._children.add(ele)
    doc._children.add(doctype)
    ele._parent = doc
    doctype._parent = doc
    expect(tree_isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - two document elements', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const ele1 = doc.createElement('root') as any
    const ele2 = doc.createElement('root') as any
    doc._children.add(ele1)
    doc._children.add(ele2)
    ele1._parent = doc
    ele2._parent = doc
    expect(tree_isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - text at root level', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const node = doc.createTextNode('root') as any
    doc._children.add(node)
    node._parent = doc
    expect(tree_isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - CDATA at root level', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const node = doc.createCDATASection('root') as any
    doc._children.add(node)
    node._parent = doc
    expect(tree_isConstrained(doc)).toBe(false)
  })

  test('isConstrained() - doctype in fragment', () => {
    const doc = $$.dom.createDocument('ns', '') as any
    const frag = doc.createDocumentFragment() as any
    const doctype = $$.dom.createDocumentType('root', 'pub', 'sys') as any
    frag._children.add(doctype)
    doctype._parent = frag
    expect(tree_isConstrained(frag)).toBe(false)
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
    expect(tree_isConstrained(doc)).toBe(false)
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

    expect(tree_nodeLength(doctype as any)).toBe(0)
    expect(tree_nodeLength(de as any)).toBe(3)
    expect(tree_nodeLength(ele[1] as any)).toBe(4)
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

    expect(tree_isEmpty(doctype as any)).toBe(true)
    expect(tree_isEmpty(de as any)).toBe(false)
    expect(tree_isEmpty(ele[1] as any)).toBe(false)
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

    expect(tree_rootNode(de as any)).toBe(doc)
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

    expect(tree_isDescendantOf(de as any, de as any)).toBe(false)
    expect(tree_isDescendantOf(de as any, de as any, true)).toBe(true)
    expect(tree_isDescendantOf(de as any, ele[0] as any)).toBe(true)
    expect(tree_isDescendantOf(de as any, shtext as any)).toBe(false)
    expect(tree_isDescendantOf(de as any, shtext as any, false, true)).toBe(true)
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

    expect(tree_isAncestorOf(de as any, de as any)).toBe(false)
    expect(tree_isAncestorOf(de as any, de as any, true)).toBe(true)
    expect(tree_isAncestorOf(ele[0] as any, de as any)).toBe(true)
    expect(tree_isAncestorOf(shtext as any, de as any)).toBe(false)
    expect(tree_isAncestorOf(shtext as any, de as any, false, true)).toBe(true)
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

    expect(tree_isSiblingOf(de as any, de as any)).toBe(false)
    expect(tree_isSiblingOf(de as any, de as any, true)).toBe(true)
    expect(tree_isSiblingOf(ele[0] as any, de as any)).toBe(false)
    expect(tree_isSiblingOf(ele[0] as any, ele[1] as any)).toBe(true)
    expect(tree_isSiblingOf(shtext as any, shele as any)).toBe(true)
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

    expect(tree_isPreceding(de as any, de as any)).toBe(false)
    expect(tree_isPreceding(ele[0] as any, de as any)).toBe(true)
    expect(tree_isPreceding(de as any, ele[0] as any)).toBe(false)
    expect(tree_isPreceding(ele[1] as any, ele[0] as any)).toBe(true)
    // free node
    const freeEle = doc.createElement('free')
    expect(tree_isPreceding(de as any, freeEle as any)).toBe(false)
    // from another doc
    const doc2 = $$.dom.createDocument('my ns', 'root2')
    if (!doc2.documentElement)
      throw new Error("documentElement is null")
    const de2 = doc2.documentElement
    expect(tree_isPreceding(de as any, de2 as any)).toBe(false)
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

    expect(tree_isFollowing(de as any, de as any)).toBe(false)
    expect(tree_isFollowing(ele[0] as any, de as any)).toBe(false)
    expect(tree_isFollowing(de as any, ele[0] as any)).toBe(true)
    expect(tree_isFollowing(ele[0] as any, ele[1] as any)).toBe(true)
    // free node
    const freeEle = doc.createElement('free')
    expect(tree_isFollowing(de as any, freeEle as any)).toBe(false)
    // from another doc
    const doc2 = $$.dom.createDocument('my ns', 'root2')
    if (!doc2.documentElement)
      throw new Error("documentElement is null")
    const de2 = doc2.documentElement
    expect(tree_isFollowing(de as any, de2 as any)).toBe(false)
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

    expect(tree_firstChild(de as any)).toBe(ele[0])
    expect(tree_firstChild(shadowRoot as any)).toBe(shele)
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

    expect(tree_lastChild(de as any)).toBe(ele[3])
    expect(tree_lastChild(shadowRoot as any)).toBe(shtext)
  })

})