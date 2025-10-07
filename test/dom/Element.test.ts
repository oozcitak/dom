import $$ from "../TestHelpers"

$$.suite('Element', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  const ele1 = doc.createElementNS('myns', 'n:root')
  de.appendChild(ele1)
  ele1.id = 'uniq'
  ele1.setAttribute('att1', 'value1')
  ele1.setAttribute('att2', 'value2')
  ele1.setAttributeNS('http://www.w3.org/1999/xhtml', 'ns:name', 'value')
  const ele2 = doc.createElement('withclass')
  de.appendChild(ele2)
  ele2.setAttribute('class', 'a b c')
  const ele3 = doc.createElement('withslot')
  de.appendChild(ele3)
  ele3.setAttribute('slot', 'x')
  const ele4 = doc.createElement('withtext')
  de.appendChild(ele4)
  ele4.appendChild(doc.createTextNode('master'))
  ele4.appendChild(doc.createTextNode('of'))
  ele4.appendChild(doc.createComment('puppity'))
  ele4.appendChild(doc.createTextNode('puppets'))
  const ele5 = doc.createElement('tag')
  de.appendChild(ele5)
  ele5.setAttribute('att1', 'value1')
  ele5.setAttribute('att2', 'value2')
  ele5.appendChild(doc.createTextNode('has'))
  ele5.appendChild(doc.createTextNode('text'))
  ele5.appendChild(doc.createProcessingInstruction('this', 'one'))
  const ele6 = doc.createElement('tag')
  de.appendChild(ele6)
  ele6.setAttribute('att1', 'value1')
  ele6.setAttribute('att2', 'value2')
  ele6.appendChild(doc.createTextNode('has'))
  ele6.appendChild(doc.createTextNode('text'))
  ele6.appendChild(doc.createProcessingInstruction('this', 'one'))
  const ele7 = doc.createElement('tag')
  de.appendChild(ele7)

  const htmlDoc = $$.dom.createHTMLDocument('title')

  if (!htmlDoc.documentElement)
    throw new Error("documentElement is null")
  const htmlEle7 = htmlDoc.createElement('ele')
  htmlDoc.documentElement.appendChild(htmlEle7)

  $$.test('constructor()', () => {
    $$.deepEqual(ele1.nodeType, 1)
    $$.deepEqual(ele1.nodeName, 'n:root')
    $$.deepEqual(ele1.tagName, 'n:root')
    $$.deepEqual(ele1.namespaceURI, 'myns')
    $$.deepEqual(ele1.prefix, 'n')
    $$.deepEqual(ele1.localName, 'root')
  })

  $$.test('id', () => {
    const uniqEle = doc.createElement('tag')
    de.appendChild(uniqEle)
    uniqEle.setAttribute('id', 'uniq1')
    $$.deepEqual(uniqEle.id, 'uniq1')
    uniqEle.removeAttribute('id')
    $$.deepEqual(uniqEle.id, '')
  })

  $$.test('className', () => {
    $$.deepEqual(ele2.className, 'a b c')
    ele2.className = 'd e f'
    $$.deepEqual(ele2.className, 'd e f')
    $$.deepEqual(ele1.className, '')
    $$.deepEqual(ele1.slot, '')
  })

  $$.test('classList', () => {
    $$.deepEqual(ele2.classList.length, 3)
  })

  $$.test('slot', () => {
    $$.deepEqual(ele3.slot, 'x')
    ele3.slot = 'z'
    $$.deepEqual(ele3.slot, 'z')
  })

  $$.test('attributes', () => {
    $$.deepEqual(ele1.attributes.length, 4)
  })

  $$.test('hasAttributes()', () => {
    $$.deepEqual(ele1.hasAttributes(), true)
    $$.deepEqual(ele4.hasAttributes(), false)
  })

  $$.test('toggleAttribute()', () => {
    $$.throws(() => ele7.toggleAttribute('invalid name'))
    ele7.setAttribute('someAtt1', 'val1')
    ele7.setAttribute('someAtt2', 'val2')
    ele7.setAttribute('toggleAtt', '')
    ele7.toggleAttribute('toggleAtt')
    $$.deepEqual(ele7.hasAttribute('toggleAtt'), false)
    ele7.toggleAttribute('toggleAtt')
    $$.deepEqual(ele7.hasAttribute('toggleAtt'), true)
    ele7.toggleAttribute('toggleAtt', true)
    $$.deepEqual(ele7.hasAttribute('toggleAtt'), true)
    ele7.toggleAttribute('toggleAtt', false)
    $$.deepEqual(ele7.hasAttribute('toggleAtt'), false)
    ele7.toggleAttribute('toggleAtt', false)
    $$.deepEqual(ele7.hasAttribute('toggleAtt'), false)
    ele7.toggleAttribute('toggleAtt', true)
    $$.deepEqual(ele7.hasAttribute('toggleAtt'), true)

    // HTML
    htmlEle7.setAttribute('toggleAtt', '')
    htmlEle7.toggleAttribute('toggleAtt')
    $$.deepEqual(htmlEle7.hasAttribute('toggleAtt'), false)
    htmlEle7.toggleAttribute('toggleAtt')
    $$.deepEqual(htmlEle7.hasAttribute('toggleAtt'), true)
  })

  $$.test('getAttributeNames()', () => {
    $$.deepEqual(ele1.getAttributeNames(), ['id', 'att1', 'att2', 'ns:name'])
  })

  $$.test('getAttribute()', () => {
    $$.deepEqual(ele1.getAttribute('att1'), 'value1')
    $$.deepEqual(ele1.getAttribute('non-existing'), null)
  })

  $$.test('getAttributeNS()', () => {
    $$.deepEqual(ele1.getAttributeNS('http://www.w3.org/1999/xhtml', 'name'), 'value')
    $$.deepEqual(ele1.getAttributeNS('my ns', 'non'), null)
  })

  $$.test('setAttribute()', () => {
    ele1.setAttribute('att1', 'newvalue1')
    $$.deepEqual(ele1.getAttribute('att1'), 'newvalue1')
    ele1.setAttribute('att100', 'newvalue100')
    $$.deepEqual(ele1.attributes.length, 5)
    $$.deepEqual(ele1.getAttribute('att100'), 'newvalue100')
    $$.throws(() => ele1.setAttribute('invalid name', 'val'))

    htmlEle7.setAttribute('NAME', 'val')
    $$.deepEqual(htmlEle7.getAttribute('name'), 'val')
  })

  $$.test('setAttributeNS()', () => {
    ele1.setAttributeNS('http://www.w3.org/1999/xhtml', 'name', 'newvalue')
    $$.deepEqual(ele1.getAttributeNS('http://www.w3.org/1999/xhtml', 'name'), 'newvalue')
    ele1.setAttributeNS('http://www.w3.org/1999/xhtml', 'name101', 'newvalue101')
    $$.deepEqual(ele1.attributes.length, 6)
    $$.deepEqual(ele1.getAttributeNS('http://www.w3.org/1999/xhtml', 'name101'), 'newvalue101')
  })

  $$.test('removeAttribute()', () => {
    ele1.removeAttribute('att100')
    $$.deepEqual(ele1.attributes.length, 5)
  })

  $$.test('removeAttributeNS()', () => {
    ele1.removeAttributeNS('http://www.w3.org/1999/xhtml', 'name101')
    $$.deepEqual(ele1.attributes.length, 4)
  })

  $$.test('hasAttribute()', () => {
    $$.deepEqual(ele1.hasAttribute('att1'), true)
    $$.deepEqual(ele1.hasAttribute('nope'), false)

    htmlEle7.setAttribute('NAME', 'val')
    $$.deepEqual(htmlEle7.hasAttribute('name'), true)
  })

  $$.test('hasAttributeNS()', () => {
    $$.deepEqual(ele1.hasAttributeNS('http://www.w3.org/1999/xhtml', 'name'), true)
    $$.deepEqual(ele1.hasAttributeNS('http://www.w3.org/1999/xhtml', 'nope'), false)
    $$.deepEqual(ele1.hasAttributeNS('', 'name'), false)
  })

  $$.test('getAttributeNode()', () => {
    const attr = ele1.getAttributeNode('att1')
    $$.notDeepEqual(attr, null)
    if (attr) {
      $$.deepEqual(attr.value, 'newvalue1')
    }
    $$.deepEqual(ele1.getAttributeNode('none'), null)
  })

  $$.test('getAttributeNodeNS()', () => {
    const attr = ele1.getAttributeNodeNS('http://www.w3.org/1999/xhtml', 'name')
    $$.notDeepEqual(attr, null)
    if (attr) {
      $$.deepEqual(attr.value, 'newvalue')
    }
    $$.deepEqual(ele1.getAttributeNodeNS('http://www.w3.org/1999/xhtml', 'none'), null)
  })

  $$.test('setAttributeNode()', () => {
    const newAttr = doc.createAttribute('att1')
    newAttr.value = 'newold'
    ele1.setAttributeNode(newAttr)
    $$.deepEqual(ele1.getAttribute('att1'), 'newold')
    const newAttr2 = doc.createAttribute('newatt')
    newAttr2.value = 'brandnew'
    ele1.setAttributeNode(newAttr2)
    $$.deepEqual(ele1.attributes.length, 5)
    $$.deepEqual(ele1.getAttribute('newatt'), 'brandnew')
  })

  $$.test('setAttributeNS()', () => {
    const newAttr = doc.createAttributeNS('http://www.w3.org/1999/xhtml', 'name')
    newAttr.value = 'newold'
    ele1.setAttributeNodeNS(newAttr)
    $$.deepEqual(ele1.getAttributeNS('http://www.w3.org/1999/xhtml', 'name'), 'newold')
    const newAttr2 = doc.createAttributeNS('http://www.w3.org/1999/xhtml', 'newatt')
    newAttr2.value = 'brandnew'
    ele1.setAttributeNodeNS(newAttr2)
    $$.deepEqual(ele1.attributes.length, 6)
    $$.deepEqual(ele1.getAttributeNS('http://www.w3.org/1999/xhtml', 'newatt'), 'brandnew')
  })

  $$.test('removeAttributeNode()', () => {
    const newAttr = ele1.getAttributeNode('newatt')
    if (newAttr) {
      ele1.removeAttributeNode(newAttr)
    }
    $$.deepEqual(ele1.attributes.length, 5)
    const newAttr2 = ele1.getAttributeNodeNS('http://www.w3.org/1999/xhtml', 'newatt')
    if (newAttr2) {
      ele1.removeAttributeNode(newAttr2)
    }
    $$.deepEqual(ele1.attributes.length, 4)

    const nonAttr = doc.createAttribute('attr')
    $$.throws(() => ele1.removeAttributeNode(nonAttr))
  })

  $$.test('textContent', () => {
    $$.deepEqual(ele4.textContent, 'masterofpuppets')
    ele4.textContent = 'masterofbobbitts'
    $$.deepEqual(ele4.childNodes.length, 1)
    const txt = ele4.firstChild
    if(!txt)
      throw new Error("Text node  empty")
    $$.deepEqual(txt.textContent, 'masterofbobbitts')
  })

  $$.test('textContent with empty child', () => {
    const doct = $$.dom.createDocument('myns', 'root')

    if (!doct.documentElement)
      throw new Error("documentElement is null")

    const node = doct.createProcessingInstruction('program', 'instruction')
    doct.documentElement.appendChild(doc.createTextNode('a'))
    doct.documentElement.appendChild(doc.createTextNode(''))
    doct.documentElement.appendChild(doc.createTextNode('b'))
    doct.documentElement.appendChild(doc.createComment('comment'))
    doct.documentElement.appendChild(doc.createTextNode('c'))

    $$.deepEqual(doct.documentElement.textContent, 'abc')
  })

  $$.test('textContent with empty content', () => {
    const doct = $$.dom.createDocument('myns', 'root')

    if (!doct.documentElement)
      throw new Error("documentElement is null")

    const node = doct.createProcessingInstruction('program', 'instruction')
    doct.documentElement.appendChild(doc.createTextNode('a'))
    doct.documentElement.appendChild(doc.createTextNode(''))
    doct.documentElement.appendChild(doc.createTextNode('b'))
    doct.documentElement.appendChild(doc.createComment('comment'))
    doct.documentElement.appendChild(doc.createTextNode('c'))
    doct.documentElement.textContent = null
    $$.deepEqual(doct.documentElement.textContent, '')
  })

  $$.test('closest()', () => {
    $$.throws(() => ele1.closest('*'))
  })

  $$.test('matches()', () => {
    $$.throws(() => ele1.matches('*'))
  })

  $$.test('cloneNode()', () => {
    const clonedNode = <any>ele5.cloneNode()
    $$.deepEqual(clonedNode.attributes.length, 2)
    $$.deepEqual(clonedNode.childNodes.length, 0)
    const clonedNodeDeep = <any>ele5.cloneNode(true)
    $$.deepEqual(clonedNodeDeep.attributes.length, 2)
    $$.deepEqual(clonedNodeDeep.childNodes.length, 3)
  })

  $$.test('isEqualNode()', () => {
    $$.deepEqual(ele5.isEqualNode(ele6), true)
    $$.deepEqual(ele5.isEqualNode(ele1), false)

    const en_ele1 = doc.createElementNS('ns1', 'p1:name1')
    const en_ele2 = doc.createElementNS('ns2', 'p2:name2')
    $$.deepEqual(en_ele1.isEqualNode(en_ele2), false)

    const en_ele3 = doc.createElementNS('ns1', 'p1:name1')
    en_ele3.setAttributeNS('ns1', 'n1:name1', 'val1')
    const en_ele4 = doc.createElementNS('ns1', 'p1:name1')
    en_ele4.setAttributeNS('ns2', 'n2:name2', 'val2')
    $$.deepEqual(en_ele3.isEqualNode(en_ele4), false)
  })

  $$.test('getElementsByTagName()', () => {
    $$.deepEqual(de.getElementsByTagName('withtext')[0], ele4)
  })

  $$.test('getElementsByTagName()', () => {
    const sdoc = $$.dom.createHTMLDocument('my doc')
    const sbody = sdoc.getElementsByTagName('body')[0]
    if (!sbody)
      throw new Error("body element is null")
    const sele1 = sdoc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    const sele2 = sdoc.createElementNS('ns', 'my-custom-element')
    sbody.append(sele1, sele2)

    $$.deepEqual(Array.from(sbody.getElementsByTagName('MY-custom-element')), [sele1])
    $$.deepEqual(Array.from(sbody.getElementsByTagName('my-custom-element')), [sele1, sele2])
  })

  $$.test('getElementsByTagNameNS()', () => {
    $$.deepEqual(de.getElementsByTagNameNS('myns', 'root')[0], ele1)
  })

  $$.test('getElementsByTagNameNS()', () => {
    const doc1 = $$.dom.createDocument(null, 'doc')
    const de1 = doc1.documentElement
    if (!de1)
      throw new Error("document element is null")
    const e = doc1.createElement('tag1')
    const e11 = doc1.createElementNS('ns1', 'tag1')
    const e12 = doc1.createElementNS('ns1', 'tag2')
    const e21 = doc1.createElementNS('ns2', 'tag1')
    const e22 = doc1.createElementNS('ns2', 'tag2')
    de1.append(e, e11, e12, e21, e22)

    $$.deepEqual(Array.from(de1.getElementsByTagNameNS('*', '*')), [e, e11, e12, e21, e22])
    $$.deepEqual(Array.from(de1.getElementsByTagNameNS('', '*')), [e])
    $$.deepEqual(Array.from(de1.getElementsByTagNameNS('*', 'tag1')), [e, e11, e21])
    $$.deepEqual(Array.from(de1.getElementsByTagNameNS('ns2', '*')), [e21, e22])
  })

  $$.test('getElementsByClassName()', () => {
    $$.deepEqual(de.getElementsByClassName('').length, 0)
    $$.deepEqual(de.getElementsByClassName('d e f')[0], ele2)
  })

  $$.test('insertAdjacentElement()', () => {
    const iaedoc = $$.dom.createDocument(null, 'root')

    if (!iaedoc.documentElement)
      throw new Error("documentElement is null")

    const iaede = iaedoc.documentElement
    const ele = doc.createElement('node')
    iaede.appendChild(ele)
    ele.insertAdjacentElement('beforebegin', iaedoc.createElement('one'))
    iaede.insertAdjacentElement('afterbegin', iaedoc.createElement('two'))
    iaede.insertAdjacentElement('beforeend', iaedoc.createElement('three'))
    ele.insertAdjacentElement('afterend', iaedoc.createElement('four'))

    $$.deepEqual($$.printTree(iaedoc), $$.t`
      root
        two
        one
        node
        four
        three
      `)
  })

  $$.test('insertAdjacentElement() with null parent', () => {
    const iaedoc = $$.dom.createDocument(null, 'root')

    if (!iaedoc.documentElement)
      throw new Error("documentElement is null")

    const iaede = iaedoc.documentElement
    const ele = doc.createElement('node')
    iaede.appendChild(ele)
    ele.remove()
    const cn1 = iaedoc.createElement('one')
    const cn2 = iaedoc.createElement('two')

    $$.deepEqual(ele.insertAdjacentElement('beforebegin', cn1), null)
    $$.deepEqual(ele.insertAdjacentElement('afterend', cn2), null)

    $$.deepEqual($$.printTree(iaedoc), $$.t`
      root
      `)
  })

  $$.test('insertAdjacentText()', () => {
    const iaedoc = $$.dom.createDocument(null, 'root')

    if (!iaedoc.documentElement)
      throw new Error("documentElement is null")

    const iaede = iaedoc.documentElement
    const ele = doc.createElement('node')
    iaede.appendChild(ele)
    ele.insertAdjacentText('beforebegin', 'one')
    iaede.insertAdjacentText('afterbegin', 'two')
    iaede.insertAdjacentText('beforeend', 'three')
    ele.insertAdjacentText('afterend', 'four')

    $$.deepEqual($$.printTree(iaedoc), $$.t`
      root
        # two
        # one
        node
        # four
        # three
      `)
  })

  $$.test('insertAdjacentText() with null parent', () => {
    const iaedoc = $$.dom.createDocument(null, 'root')

    if (!iaedoc.documentElement)
      throw new Error("documentElement is null")

    const iaede = iaedoc.documentElement
    const ele = doc.createElement('node')
    iaede.appendChild(ele)
    ele.remove()

    $$.deepEqual(ele.insertAdjacentText('beforebegin', 'one'), undefined)
    $$.deepEqual(ele.insertAdjacentText('afterend', 'two'), undefined)

    $$.deepEqual($$.printTree(iaedoc), $$.t`
      root
      `)
  })

  $$.test('lookupPrefix()', () => {
    $$.deepEqual(ele1.lookupPrefix('myns'), 'n')
    $$.deepEqual(ele1.lookupPrefix('none'), null)

    const nsdoc = $$.dom.createDocument('myns', 'root')
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const ele = doc.createElementNS('myns', 'n:root')
    de.appendChild(ele)
    ele.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'ns1')
    ele.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:name', 'ns2')
    $$.deepEqual(ele.lookupPrefix('ns2'), 'name')
    $$.deepEqual(ele.lookupPrefix(''), null)
  })

  $$.test('lookupNamespaceURI()', () => {
    $$.deepEqual(ele1.lookupNamespaceURI('n'), 'myns')
    $$.deepEqual(ele1.lookupNamespaceURI('none'), null)

    const nsdoc = $$.dom.createDocument('myns', 'root')
    if (!doc.documentElement)
      throw new Error("documentElement is null")
    const de = doc.documentElement
    const ele = doc.createElementNS('myns', 'n:root')
    de.appendChild(ele)
    ele.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'ns1')
    ele.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:name', 'ns2')
    ele.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:namez', '')
    $$.deepEqual(ele.lookupNamespaceURI(null), 'ns1')
    $$.deepEqual(ele.lookupNamespaceURI('name'), 'ns2')
    $$.deepEqual(ele.lookupNamespaceURI('namez'), null)
  })

  $$.test('attachShadow()', () => {
    const doc = $$.dom.createHTMLDocument('my doc')
    const body = doc.getElementsByTagName('body')[0]
    if (!body)
      throw new Error("body element is null")
    const custom = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    body.appendChild(custom)
    const shadow = custom.attachShadow({ mode: 'open' })
    $$.deepEqual(shadow.mode, 'open')
    $$.deepEqual(shadow.host, custom)
    $$.throws(() => custom.attachShadow({ mode: 'open' }))
  })

  $$.test('attachShadow() non-html namespace', () => {
    const xmldoc = $$.dom.createDocument('ns', 'root')
    if (!xmldoc.documentElement)
      throw new Error("documentElement is null")
    const xmlde = xmldoc.documentElement
    const custom2 = xmldoc.createElementNS('somens', 'my-custom-element')
    xmlde.appendChild(custom2)
    $$.throws(() => custom2.attachShadow({ mode: 'open' }))
  })

  $$.test('attachShadow() invalid element name', () => {
    const doc = $$.dom.createHTMLDocument('my doc')
    const body = doc.getElementsByTagName('body')[0]
    if (!body)
      throw new Error("body element is null")
    const custom = doc.createElementNS('http://www.w3.org/1999/xhtml', 'nonono')
    body.appendChild(custom)
    $$.throws(() => custom.attachShadow({ mode: 'open' }))
  })

  $$.test('attachShadow() reserved element name', () => {
    const doc = $$.dom.createHTMLDocument('my doc')
    const body = doc.getElementsByTagName('body')[0]
    if (!body)
      throw new Error("body element is null")
    const custom = doc.createElementNS('http://www.w3.org/1999/xhtml', 'font-face')
    body.appendChild(custom)
    $$.throws(() => custom.attachShadow({ mode: 'open' }))
  })

  $$.test('shadowRoot', () => {
    const doc = $$.dom.createHTMLDocument('my doc')
    const body = doc.getElementsByTagName('body')[0]
    if (!body)
      throw new Error("body element is null")
    const custom = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    body.appendChild(custom)
    custom.attachShadow({ mode: 'open' })
    const shadow = custom.shadowRoot
    if (!shadow)
      throw new Error("shadow root is null")
    $$.deepEqual(shadow.mode, 'open')
    $$.deepEqual(shadow.host, custom)
  })

  $$.test('update slot name', () => {
    const doc = $$.dom.createHTMLDocument('my doc')
    const body = doc.getElementsByTagName('body')[0]
    if (!body)
      throw new Error("body element is null")
    const custom = doc.createElementNS('http://www.w3.org/1999/xhtml', 'my-custom-element')
    body.appendChild(custom)
    custom.attachShadow({ mode: 'open' })
    const shadow = custom.shadowRoot
    if (!shadow)
      throw new Error("shadow root is null")
    const slotEle = doc.createElementNS('http://www.w3.org/1999/xhtml', 'slot')
    const htmlSlotEle = slotEle as any
    htmlSlotEle._name = "slot"
    htmlSlotEle._assignedNodes = []
    shadow.appendChild(slotEle)
    slotEle.setAttribute("name", "new name")
    $$.deepEqual(htmlSlotEle._name, "new name")
    slotEle.setAttribute("name", "new name")
    $$.deepEqual(htmlSlotEle._name, "new name")
    slotEle.setAttribute("name", "")
    $$.deepEqual(htmlSlotEle._name, "")
    slotEle.removeAttribute("name")
    $$.deepEqual(htmlSlotEle._name, "")
    slotEle.setAttribute("name", "")
    $$.deepEqual(htmlSlotEle._name, "")
  })

  $$.test('update slotable name', () => {
    const doc = $$.dom.createHTMLDocument('doc')
    const shadowHost = doc.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    const childElement = doc.createElementNS('http://www.w3.org/1999/xhtml', 'b')
    shadowHost.appendChild(childElement)
    const slotableEle = childElement as any
    var shadowRoot = shadowHost.attachShadow({mode: 'open'})
    var slot = doc.createElementNS('http://www.w3.org/1999/xhtml', 'slot')
    const htmlSlot = slot as any
    htmlSlot._name = ''
    htmlSlot._assignedNodes = []
    shadowRoot.appendChild(slot)

    childElement.setAttribute("slot", "new name")
    $$.deepEqual(slotableEle._name, "new name")
    childElement.setAttribute("slot", "new name")
    $$.deepEqual(slotableEle._name, "new name")
    childElement.setAttribute("slot", "")
    $$.deepEqual(slotableEle._name, "")
    childElement.removeAttribute("slot")
    $$.deepEqual(slotableEle._name, "")
    childElement.setAttribute("slot", "")
    $$.deepEqual(slotableEle._name, "")
  })

  $$.test('_create', () => {
    const ele1 = $$.Element._create(doc as any, 'tag', 'ns', 'prefix')
    $$.deepEqual(ele1.localName, 'tag')
    $$.deepEqual(ele1.namespaceURI, 'ns')
    $$.deepEqual(ele1.prefix, 'prefix')
    const ele2 = $$.Element._create(doc as any, 'tag')
    $$.deepEqual(ele2.localName, 'tag')
    $$.deepEqual(ele2.namespaceURI, null)
    $$.deepEqual(ele2.prefix, null)
  })

})