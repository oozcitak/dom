import $$ from "../TestHelpers"

$$.suite('CDATASection', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createCDATASection('data')
  doc.documentElement.appendChild(node)

  $$.test('constructor()', () => {
    $$.deepEqual(node.nodeType, 4)
    $$.deepEqual(node.nodeName, '#cdata-section')
    $$.deepEqual(node.data, 'data')
  })

  $$.test('cloneNode()', () => {
    const clonedNode = <any>node.cloneNode()
    $$.notDeepEqual(clonedNode, node)
    $$.deepEqual(clonedNode.nodeType, 4)
    $$.deepEqual(clonedNode.nodeName, '#cdata-section')
    $$.deepEqual(clonedNode.data, 'data')
  })


  $$.test('_create()', () => {
    const node1 = $$.CDATASection._create(doc as any, 'data')
    $$.deepEqual(node1.nodeType, 4)
    $$.deepEqual(node1.nodeName, '#cdata-section')
    $$.deepEqual(node1.data, 'data')
    const node2 = $$.CDATASection._create(doc as any)
    $$.deepEqual(node2.data, '')
  })

})