import $$ from "../TestHelpers"

describe('Attr', () => {

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

  test('constructor()', () => {
    expect(attr.nodeType).toBe(2)
    expect(attr.nodeName).toBe('ns:name')
    expect(attr.ownerElement).toBe(ele)
    expect(attr.namespaceURI).toBe('http://www.w3.org/1999/xhtml')
    expect(attr.prefix).toBe('ns')
    expect(attr.localName).toBe('name')
    expect(attr.value).toBe('value')
  })

  test('value', () => {
    expect(attr.value).toBe('value')
    attr.value = 'modified'
    expect(attr.value).toBe('modified')
    attr.value = 'value'
  })

  test('nodeValue', () => {
    attr.nodeValue = 'modified'
    expect(attr.nodeValue).toBe('modified')
    attr.nodeValue = 'value'
  })

  test('textContent', () => {
    attr.textContent = 'modified'
    expect(attr.textContent).toBe('modified')
    attr.textContent = 'value'
  })

  test('nodeValue with null', () => {
    attr.nodeValue = null
    expect(attr.nodeValue).toBe('')
    attr.nodeValue = 'value'
  })

  test('textContent with null', () => {
    attr.textContent = null
    expect(attr.textContent).toBe('')
    attr.textContent = 'value'
  })

  test('cloneNode()', () => {
    const clonedAttr = attr.cloneNode() as any
    expect(clonedAttr).not.toBe(attr)
    expect(clonedAttr.nodeType).toBe(2)
    expect(clonedAttr.nodeName).toBe('ns:name')
    expect(clonedAttr.ownerElement).toBeNull()
    expect(clonedAttr.namespaceURI).toBe('http://www.w3.org/1999/xhtml')
    expect(clonedAttr.prefix).toBe('ns')
    expect(clonedAttr.localName).toBe('name')
    expect(clonedAttr.value).toBe('value')
  })

  test('lookupPrefix()', () => {
    expect(attr.lookupPrefix('myns')).toBe('n')
    expect(attr.lookupPrefix(null)).toBeNull()
    const cloned = attr.cloneNode() as any
    expect(cloned.lookupPrefix('none')).toBeNull()
  })

  test('lookupNamespaceURI()', () => {
    expect(attr.lookupNamespaceURI('n')).toBe('myns')
    expect(attr.lookupNamespaceURI(null)).toBe('mydefaultns')
    const cloned = attr.cloneNode() as any
    expect(cloned.lookupNamespaceURI('none')).toBeNull()
  })

  test('isEqualNode()', () => {
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
    expect(attr1.isEqualNode(attr2)).toBe(true)
    expect(attr1.isEqualNode(attr3)).toBe(false)
    expect(attr1.isEqualNode(attr4)).toBe(false)
    expect(attr1.isEqualNode(attr5)).toBe(false)
    expect(attr1.isEqualNode(null)).toBe(false)
    expect(attr1.isEqualNode()).toBe(false)
  })

})