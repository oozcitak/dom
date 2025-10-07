import $$ from "../TestHelpers"

$$.suite('Node', () => {

  const doctype = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
  const doc = $$.dom.createDocument('myns', 'n:root', doctype)

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  const ele1 = doc.createElement('ele')
  de.appendChild(ele1)
  const attr = doc.createAttribute('att')
  ele1.setAttributeNode(attr)
  const child1 = doc.createElement('child1')
  const child2 = doc.createElement('child2')
  const child3 = doc.createElement('child3')
  const child4 = doc.createElement('child4')
  ele1.appendChild(child1)
  ele1.appendChild(child2)
  ele1.appendChild(child3)
  ele1.appendChild(child4)
  child4.appendChild(doc.createTextNode('master'))
  child4.appendChild(doc.createTextNode('of'))
  child4.appendChild(doc.createComment('puppity'))
  child4.appendChild(doc.createTextNode('puppets'))

  $$.test('baseURI', () => {
    $$.deepEqual(ele1.baseURI, 'about:blank')
  })

  $$.test('isConnected', () => {
    $$.deepEqual(ele1.isConnected, true)
    const newEle = doc.createElement('child4')
    $$.deepEqual(newEle.isConnected, false)
    de.appendChild(newEle)
    $$.deepEqual(newEle.isConnected, true)
    newEle.remove()
    $$.deepEqual(newEle.isConnected, false)
  })

  $$.test('ownerDocument', () => {
    $$.deepEqual(ele1.ownerDocument, doc)
    $$.deepEqual(doc.ownerDocument, null)
  })

  $$.test('getRootNode()', () => {
    $$.deepEqual(ele1.getRootNode(), doc)
  })

  $$.test('getRootNode() shadow', () => {
    const sdoc = $$.dom.createHTMLDocument('my doc')
    const sbody = sdoc.getElementsByTagName('body')[0]
    if (!sbody)
      throw new Error("body element is null")
    const sele = sdoc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    sbody.appendChild(sele)
    const shadowRoot = sele.attachShadow({mode: "open"})
    const snode = doc.createElement('node')
    shadowRoot.appendChild(snode)

    $$.deepEqual(snode.getRootNode(), shadowRoot)
    $$.deepEqual(snode.getRootNode({composed: false}), shadowRoot)
    $$.deepEqual(snode.getRootNode({composed: true}), sdoc)
  })

  $$.test('parentNode', () => {
    $$.deepEqual(ele1.parentNode, de)
    $$.deepEqual(doc.parentElement, null)
    $$.deepEqual(attr.parentNode, null)
  })

  $$.test('parentElement', () => {
    $$.deepEqual(ele1.parentElement, de)
    $$.deepEqual(doc.parentElement, null)
  })

  $$.test('hasChildNodes()', () => {
    $$.deepEqual(ele1.hasChildNodes(), true)
  })

  $$.test('childNodes', () => {
    $$.deepEqual(ele1.childNodes.length, 4)
  })

  $$.test('firstChild', () => {
    $$.deepEqual(ele1.firstChild, child1)
  })

  $$.test('lastChild', () => {
    $$.deepEqual(ele1.lastChild, child4)
  })

  $$.test('previousSibling', () => {
    $$.deepEqual(child3.previousSibling, child2)
  })

  $$.test('nextSibling', () => {
    $$.deepEqual(child3.nextSibling, child4)
  })

  $$.test('nodeValue', () => {
    const charNode = child4.firstChild
    if (!charNode)
      throw new Error("charNode is null")

    $$.deepEqual(charNode.nodeValue, 'master')
    charNode.nodeValue = 'maestro'
    $$.deepEqual(charNode.nodeValue, 'maestro')
    charNode.nodeValue = 'master'

    doctype.nodeValue = 'N/A'
    $$.deepEqual(doctype.nodeValue, null)
  })

  $$.test('textContent', () => {
    $$.deepEqual(child4.textContent, 'masterofpuppets')
    child4.textContent = 'masterofbobbitts'
    $$.deepEqual(child4.childNodes.length, 1)

    const charNode = child4.firstChild
    if (!charNode)
      throw new Error("charNode is null")
    $$.deepEqual(charNode.textContent, 'masterofbobbitts')

    doctype.textContent = 'N/A'
    $$.deepEqual(doctype.textContent, null)
  })

  $$.test('normalize()', () => {
    const newEle = doc.createElement('child')
    de.appendChild(newEle)
    newEle.appendChild(doc.createTextNode(''))
    newEle.appendChild(doc.createTextNode('part 1 '))
    newEle.appendChild(doc.createTextNode('part 2 '))
    newEle.appendChild(doc.createTextNode(''))
    newEle.appendChild(doc.createComment('separator'))
    newEle.appendChild(doc.createTextNode('part 3 '))
    $$.deepEqual(newEle.childNodes.length, 6)
    newEle.normalize()
    $$.deepEqual(newEle.childNodes.length, 3)

    const charNode = newEle.firstChild
    if (!charNode)
      throw new Error("charNode is null")

    $$.deepEqual(charNode.textContent, 'part 1 part 2 ')
  })

  $$.test('normalize() text nodes updates live range', () => {
    const newEle = doc.createElement('child')
    de.appendChild(newEle)
    const nodes = [
      doc.createTextNode('AAA'),
      doc.createTextNode('BBB'),
      doc.createTextNode('CCC'),
      doc.createTextNode('DDD'),
      doc.createTextNode('EEE')
    ]
    newEle.append(...nodes)

    const range1 = doc.createRange()
    range1.setStart(nodes[0], 1)
    range1.setEnd(nodes[4], 1)
    const range2 = doc.createRange()
    range2.setStart(nodes[1], 0)
    range2.setEnd(nodes[3], 3)
    const range3 = doc.createRange()
    range3.setStart(nodes[2], 0)
    range3.setEnd(nodes[2], 3)
    const range4 = doc.createRange()
    range4.setStart(nodes[2], 1)
    range4.setEnd(nodes[2], 2)
    const range5 = doc.createRange()
    range5.setStart(nodes[2], 1)
    range5.setEnd(nodes[2], 1)

    newEle.normalize()

    $$.deepEqual(range1.toString(), 'AABBBCCCDDDE')
    $$.deepEqual(range2.toString(), 'BBBCCCDDD')
    $$.deepEqual(range3.toString(), 'CCC')
    $$.deepEqual(range4.toString(), 'C')
    $$.deepEqual(range5.toString(), '')
  })

  $$.test('normalize() updates live range', () => {
    const newEle = doc.createElement('child')
    de.appendChild(newEle)
    const nodes = [
      doc.createTextNode('AAA'),
      doc.createTextNode('BBB'),
      doc.createTextNode('CCC'),
      doc.createTextNode('DDD'),
      doc.createTextNode('EEE')
    ]
    newEle.append(...nodes)

    const range1 = doc.createRange()
    range1.setStart(newEle, 0)
    range1.setEnd(newEle, 5)
    const range2 = doc.createRange()
    range2.setStart(newEle, 1)
    range2.setEnd(newEle, 4)
    const range3 = doc.createRange()
    range3.setStart(newEle, 2)
    range3.setEnd(newEle, 3)
    const range4 = doc.createRange()
    range4.setStart(newEle, 2)
    range4.setEnd(newEle, 2)

    newEle.normalize()

    $$.deepEqual(range1.toString(), 'AAABBBCCCDDDEEE')
    $$.deepEqual(range2.toString(), 'BBBCCCDDD')
    $$.deepEqual(range3.toString(), 'CCC')
    $$.deepEqual(range4.toString(), '')
  })

  $$.test('cloneNode() shadow', () => {
    const sdoc = $$.dom.createHTMLDocument('my doc')
    const sbody = sdoc.getElementsByTagName('body')[0]
    if (!sbody)
      throw new Error("body element is null")
    const sele = sdoc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    sbody.appendChild(sele)
    const shadowRoot = sele.attachShadow({mode: "open"})
    const snode = doc.createElement('node')
    shadowRoot.appendChild(snode)

    $$.throws(() => shadowRoot.cloneNode())
  })

  $$.test('isEqualNode()', () => {
    const newEle1 = doc.createElement('child')
    newEle1.setAttribute('att1', 'val1')
    newEle1.setAttribute('att2', 'val2')
    de.appendChild(newEle1)
    newEle1.appendChild(doc.createTextNode('part 1 '))
    newEle1.appendChild(doc.createTextNode('part 2 '))

    const newEle2 = doc.createElement('child')
    newEle2.setAttribute('att1', 'val1')
    newEle2.setAttribute('att2', 'val2')
    de.appendChild(newEle2)
    newEle2.appendChild(doc.createTextNode('part 1 '))
    newEle2.appendChild(doc.createTextNode('part 2 '))

    const newEle3 = doc.createElement('child')
    newEle3.setAttribute('att1', 'val1')
    newEle3.setAttribute('att2', 'val2')
    de.appendChild(newEle3)
    newEle3.appendChild(doc.createTextNode('part 1 '))
    newEle3.appendChild(doc.createTextNode('part 4 '))

    $$.deepEqual(newEle1.isEqualNode(newEle2), true)
    $$.deepEqual(newEle1.isEqualNode(newEle3), false)
    $$.deepEqual(newEle1.isEqualNode(), false)

    const pi1 = doc.createProcessingInstruction('t1', 'v1')
    const pi2 = doc.createProcessingInstruction('t1', 'v2')
    const pi3 = doc.createProcessingInstruction('t2', 'v1')
    const pi4 = doc.createProcessingInstruction('t1', 'v1')
    $$.deepEqual(pi1.isEqualNode(pi2), false)
    $$.deepEqual(pi1.isEqualNode(pi3), false)
    $$.deepEqual(pi2.isEqualNode(pi3), false)
    $$.deepEqual(pi1.isEqualNode(pi4), true)

    const t1 = doc.createTextNode('t1')
    const t2 = doc.createTextNode('t2')
    const t3 = doc.createTextNode('t1')
    $$.deepEqual(t1.isEqualNode(t2), false)
    $$.deepEqual(t1.isEqualNode(t3), true)

    const e1 = doc.createElement('ele')
    e1.setAttribute('a1', 'v1')
    const e2 = doc.createElement('ele')
    e2.setAttribute('a1', 'v1')
    e2.setAttribute('a1', 'v2')
    $$.deepEqual(e1.isEqualNode(e2), false)
    e1.setAttribute('a2', 'vx')
    $$.deepEqual(e1.isEqualNode(e2), false)

    const f1 = doc.createDocumentFragment()
    const f2 = doc.createDocumentFragment()
    f1.appendChild(doc.createTextNode('t1'))
    f2.appendChild(doc.createTextNode('t1'))
    f2.appendChild(doc.createTextNode('t2'))
    $$.deepEqual(f1.isEqualNode(f2), false)
  })

  $$.test('isSameNode()', () => {
    const sameEle1 = de.firstChild
    if (!sameEle1)
      throw new Error("charNode is null")

    $$.deepEqual(ele1.isSameNode(sameEle1), true)
    $$.deepEqual(ele1.isSameNode(null), false)
    $$.deepEqual(ele1.isSameNode(), false)
  })

  $$.test('compareDocumentPosition()', () => {
    $$.deepEqual(child1.compareDocumentPosition(child1), 0)
    $$.deepEqual(child1.compareDocumentPosition(child2), 0x04)
    $$.deepEqual(child2.compareDocumentPosition(child1), 0x02)
    $$.deepEqual(child4.compareDocumentPosition(de), 0x08 + 0x02)
  })

  $$.test('compareDocumentPosition() null node', () => {
    const attr1_1 = doc.createAttribute('attr') // null owner
    const attr1_2 = doc.createAttribute('attr') // null owner
    if (attr1_1.compareDocumentPosition(attr1_2) === 0x20 + 0x01 + 0x02)
      $$.deepEqual(attr1_2.compareDocumentPosition(attr1_1), 0x20 + 0x01 + 0x04)
    else
      $$.deepEqual(attr1_2.compareDocumentPosition(attr1_1), 0x20 + 0x01 + 0x02)
    const attr2_1 = doc.createAttribute('attr') // null owner
    const attr2_2 = doc.createAttribute('attr') // non-null owner
    ele1.setAttributeNode(attr2_2)
    if(attr2_1.compareDocumentPosition(attr2_2) === 0x20 + 0x01 + 0x02)
      $$.deepEqual(attr2_2.compareDocumentPosition(attr2_1), 0x20 + 0x01 + 0x04)
    else
      $$.deepEqual(attr2_2.compareDocumentPosition(attr2_1), 0x20 + 0x01 + 0x02)
  })

  $$.test('compareDocumentPosition() attribute', () => {
    const att11 = doc.createAttribute('att11')
    child1.setAttributeNode(att11)
    const att12 = doc.createAttribute('att12')
    child1.setAttributeNode(att12)
    const att13 = doc.createAttribute('att13')
    child1.setAttributeNode(att13)

    $$.deepEqual(att12.compareDocumentPosition(att13), 0x20 + 0x04)
    $$.deepEqual(att12.compareDocumentPosition(att11), 0x20 + 0x02)

    $$.deepEqual(child1.compareDocumentPosition(att11), 0x10 + 0x04)
    $$.deepEqual(att11.compareDocumentPosition(child1), 0x08 + 0x02)
  })

  $$.test('compareDocumentPosition() disconnected', () => {
    const otherdoc = $$.dom.createDocument('ns', 'otherdoc')
    if (!otherdoc.documentElement)
      throw new Error("documentElement is null")
    const otherde = otherdoc.documentElement
    const otherele = otherdoc.createElement('otherele')
    otherde.appendChild(otherele)

    // disconnected nodes. If one returns Position.Preceding the other should
    // return Position.Following for consistency
    const pos1 = child1.compareDocumentPosition(otherele)
    const pos2 = otherele.compareDocumentPosition(child1)
    if (pos1 === 0x20 + 0x01 + 0x02)
      $$.deepEqual(pos2, 0x20 + 0x01 + 0x04)
    else
      $$.deepEqual(pos2, 0x20 + 0x01 + 0x02)
  })

  $$.test('contains()', () => {
    $$.deepEqual(de.contains(child2), true)
    $$.deepEqual(de.contains(null), false)
  })


  $$.test('lookupPrefix()', () => {
    const newText = doc.createTextNode('txt')
    child4.appendChild(newText)
    $$.deepEqual(newText.lookupPrefix('myns'), 'n')
    $$.deepEqual(newText.lookupPrefix(null), null)
    newText.remove()
    $$.deepEqual(newText.lookupPrefix('myns'), null)
  })

  $$.test('lookupNamespaceURI()', () => {
    const newText = doc.createTextNode('txt')
    child4.appendChild(newText)
    $$.deepEqual(newText.lookupNamespaceURI('n'), 'myns')
    newText.remove()
    $$.deepEqual(newText.lookupNamespaceURI('n'), null)
  })

  $$.test('isDefaultNamespace()', () => {
    const htmlDoc = $$.dom.createHTMLDocument()
    if (!htmlDoc.documentElement)
      throw new Error("documentElement is null")

    const html = htmlDoc.documentElement
    const newText = htmlDoc.createTextNode('txt')
    html.appendChild(newText)
    $$.deepEqual(newText.isDefaultNamespace('http://www.w3.org/1999/xhtml'), true)
    $$.deepEqual(newText.isDefaultNamespace('none'), false)
    $$.deepEqual(newText.isDefaultNamespace(''), false)
  })

  $$.test('insertBefore()', () => {
    const newText = doc.createTextNode('txt')
    let count = ele1.childNodes.length
    ele1.insertBefore(newText, child4)
    $$.deepEqual(ele1.childNodes.length, count + 1)
    $$.deepEqual(child4.previousSibling, newText)
    $$.deepEqual(newText.previousSibling, child3)
    $$.deepEqual(newText.nextSibling, child4)
    // duplicates nodes are not allowed
    count = ele1.childNodes.length
    ele1.insertBefore(newText, child4)
    $$.deepEqual(ele1.childNodes.length, count)
  })

  $$.test('appendChild()', () => {
    const aadoc = $$.dom.createDocument('ns', 'doc')
    if (!aadoc.documentElement)
      throw new Error("documentElement is null")
    const aae = aadoc.documentElement
    const node1 = aadoc.createElement('node1')
    const node2 = aadoc.createElement('node2')
    const node3 = aadoc.createElement('node3')
    const node4 = aadoc.createElement('node4')
    aae.appendChild(node1)
    aae.appendChild(node2)
    aae.appendChild(node3)
    aae.appendChild(node4)

    $$.deepEqual(aae.childNodes.length, 4)
    const newText = aadoc.createTextNode('newtxt')
    aae.appendChild(newText)
    $$.deepEqual(aae.childNodes.length, 5)
    $$.deepEqual(aae.childNodes.item(0), node1)
    $$.deepEqual(aae.childNodes.item(1), node2)
    $$.deepEqual(aae.childNodes.item(2), node3)
    $$.deepEqual(aae.childNodes.item(3), node4)
    $$.deepEqual(aae.childNodes.item(4), newText)
    $$.deepEqual(aae.lastChild, newText)

    $$.deepEqual($$.printTree(aadoc), $$.t`
      doc (ns:ns)
        node1
        node2
        node3
        node4
        # newtxt
        `)

    // adding existing node. no-op
    $$.deepEqual(aae.childNodes.length, 5)
    aae.appendChild(newText)
    $$.deepEqual(aae.childNodes.length, 5)

    $$.deepEqual($$.printTree(aadoc), $$.t`
      doc (ns:ns)
        node1
        node2
        node3
        node4
        # newtxt
        `)
  })

  $$.test('replaceChild()', () => {
    const newText = doc.createTextNode('txt')
    ele1.replaceChild(newText, child2)
    $$.deepEqual(newText.previousSibling, child1)
    $$.deepEqual(newText.nextSibling, child3)
  })

  $$.test('removeChild()', () => {
    const node1 = doc.createElement('child1')
    const node2 = doc.createElement('child2')
    const node3 = doc.createElement('child3')
    ele1.appendChild(node1)
    ele1.appendChild(node2)
    ele1.appendChild(node3)

    ele1.removeChild(node2)
    $$.deepEqual(node3.previousSibling, node1)
    $$.deepEqual(node1.nextSibling, node3)
  })

  $$.test('constants', () => {
    $$.deepEqual(doc.ELEMENT_NODE, 1)
    $$.deepEqual($$.Node.ELEMENT_NODE, 1)
  })

})