import $$ from "../TestHelpers"

$$.suite('Attr', () => {

  const doc = $$.dom.createDocument('mydefaultns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const ele = doc.createElementNS('myns', 'n:root')
  doc.documentElement.appendChild(ele)
  ele.id = 'uniq'
  ele.setAttributeNS('http://www.w3.org/1999/xhtml', 'ns:name', 'value')
  const attr = ele.getAttributeNode('ns:name')
  if (attr === null)
    throw new Error("attr is null")

  $$.test('constructor()', () => {
    $$.deepEqual(attr.nodeType, 2)
    $$.deepEqual(attr.nodeName, 'ns:name')
    $$.deepEqual(attr.ownerElement, ele)
    $$.deepEqual(attr.namespaceURI, 'http://www.w3.org/1999/xhtml')
    $$.deepEqual(attr.prefix, 'ns')
    $$.deepEqual(attr.localName, 'name')
    $$.deepEqual(attr.value, 'value')
  })

  $$.test('value', () => {
    $$.deepEqual(attr.value, 'value')
    attr.value = 'modified'
    $$.deepEqual(attr.value, 'modified')
    attr.value = 'value'
  })

  $$.test('nodeValue', () => {
    attr.nodeValue = 'modified'
    $$.deepEqual(attr.nodeValue, 'modified')
    attr.nodeValue = 'value'
  })

  $$.test('textContent', () => {
    attr.textContent = 'modified'
    $$.deepEqual(attr.textContent, 'modified')
    attr.textContent = 'value'
  })

  $$.test('nodeValue with null', () => {
    attr.nodeValue = null
    $$.deepEqual(attr.nodeValue, '')
    attr.nodeValue = 'value'
  })

  $$.test('textContent with null', () => {
    attr.textContent = null
    $$.deepEqual(attr.textContent, '')
    attr.textContent = 'value'
  })

  $$.test('cloneNode()', () => {
    const clonedAttr = attr.cloneNode() as any
    $$.notDeepEqual(clonedAttr, attr)
    $$.deepEqual(clonedAttr.nodeType, 2)
    $$.deepEqual(clonedAttr.nodeName, 'ns:name')
    $$.deepEqual(clonedAttr.ownerElement, null)
    $$.deepEqual(clonedAttr.namespaceURI, 'http://www.w3.org/1999/xhtml')
    $$.deepEqual(clonedAttr.prefix, 'ns')
    $$.deepEqual(clonedAttr.localName, 'name')
    $$.deepEqual(clonedAttr.value, 'value')
  })

  $$.test('lookupPrefix()', () => {
    $$.deepEqual(attr.lookupPrefix('myns'), 'n')
    $$.deepEqual(attr.lookupPrefix(null), null)
    const cloned = attr.cloneNode() as any
    $$.deepEqual(cloned.lookupPrefix('none'), null)
  })

  $$.test('lookupNamespaceURI()', () => {
    $$.deepEqual(attr.lookupNamespaceURI('n'), 'myns')
    $$.deepEqual(attr.lookupNamespaceURI(null), 'mydefaultns')
    const cloned = attr.cloneNode() as any
    $$.deepEqual(cloned.lookupNamespaceURI('none'), null)
  })

  $$.test('isEqualNode()', () => {
    const attr1 = doc.createAttributeNS('my ns', 'att')
    attr1.value = 'val'
    const attr2 = doc.createAttributeNS('my ns', 'att')
    attr2.value = 'val'
    const attr3 = doc.createAttributeNS('my other ns', 'att')
    attr3.value = 'val'
    const attr4 = doc.createAttributeNS('my ns', 'other_att')
    attr4.value = 'val'
    const attr5 = doc.createAttributeNS('my ns', 'att')
    attr5.value = 'other val'
    $$.deepEqual(attr1.isEqualNode(attr2), true)
    $$.deepEqual(attr1.isEqualNode(attr3), false)
    $$.deepEqual(attr1.isEqualNode(attr4), false)
    $$.deepEqual(attr1.isEqualNode(attr5), false)
    $$.deepEqual(attr1.isEqualNode(null), false)
    $$.deepEqual(attr1.isEqualNode(), false)
  })

})