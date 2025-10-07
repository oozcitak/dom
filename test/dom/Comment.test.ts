import $$ from "../TestHelpers"

$$.suite('Comment', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createComment('data')
  doc.documentElement.appendChild(node)

  $$.test('constructor()', () => {
    $$.deepEqual(node.nodeType, 8)
    $$.deepEqual(node.nodeName, '#comment')
    $$.deepEqual(node.data, 'data')
  })

  $$.test('cloneNode()', () => {
    const clonedNode = <any>node.cloneNode()
    $$.notDeepEqual(clonedNode, node)
    $$.deepEqual(clonedNode.nodeType, 8)
    $$.deepEqual(clonedNode.nodeName, '#comment')
    $$.deepEqual(clonedNode.data, 'data')
  })

  $$.test('_create()', () => {
    const node1 = $$.Comment._create(doc as any, 'data')
    $$.deepEqual(node1.nodeType, 8)
    $$.deepEqual(node1.nodeName, '#comment')
    $$.deepEqual(node1.data, 'data')
    const node2 = $$.Comment._create(doc as any)
    $$.deepEqual(node2.data, '')
  })

})