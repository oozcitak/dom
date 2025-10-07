import $$ from "../TestHelpers"

$$.suite('DocumentFragment', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createDocumentFragment()
  doc.documentElement.appendChild(node)
  node.appendChild(doc.createTextNode('this'))
  node.appendChild(doc.createCDATASection('is'))
  node.appendChild(doc.createTextNode('a'))
  node.appendChild(doc.createTextNode(''))
  node.appendChild(doc.createTextNode('test'))

  $$.test('constructor()', () => {
    $$.deepEqual(node.nodeType, 11)
    $$.deepEqual(node.nodeName, '#document-fragment')
  })

  $$.test('textContent', () => {
    $$.deepEqual(node.textContent, 'thisisatest')
    node.textContent = null
    $$.deepEqual(node.childNodes.length, 0)
    node.textContent = 'or is it?'
    $$.deepEqual(node.childNodes.length, 1)
    let text = <any>node.childNodes.item(0)
    $$.deepEqual(text.nodeType, 3)
    $$.deepEqual(text.data, 'or is it?')
  })

  $$.test('cloneNode()', () => {
    const clonedNode = node.cloneNode()
    $$.notDeepEqual(clonedNode, node)
    $$.deepEqual(clonedNode.nodeType, 11)
    $$.deepEqual(clonedNode.nodeName, '#document-fragment')
    $$.deepEqual(clonedNode.childNodes.length, 0)
  })

  $$.test('cloneNode(deep : true)', () => {
    const clonedNode = node.cloneNode(true)
    $$.notDeepEqual(clonedNode, node)
    $$.deepEqual(clonedNode.nodeType, 11)
    $$.deepEqual(clonedNode.nodeName, '#document-fragment')
    $$.deepEqual(clonedNode.childNodes.length, 1)
  })

  $$.test('lookupPrefix()', () => {
    $$.deepEqual(node.lookupPrefix('none'), null)
  })

  $$.test('lookupNamespaceURI()', () => {
    $$.deepEqual(node.lookupNamespaceURI('none'), null)
  })

})