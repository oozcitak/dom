import $$ from "../TestHelpers"

$$.suite('ProcessingInstruction', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createProcessingInstruction('program', 'instruction')
  doc.documentElement.appendChild(node)

  $$.test('constructor()', () => {
    $$.deepEqual(node.nodeType, 7)
    $$.deepEqual(node.nodeName, 'program')
    $$.deepEqual(node.target, 'program')
    $$.deepEqual(node.data, 'instruction')
  })

  $$.test('cloneNode()', () => {
    const clonedNode = <any>node.cloneNode()
    $$.notDeepEqual(clonedNode, node)
    $$.deepEqual(clonedNode.nodeType, 7)
    $$.deepEqual(clonedNode.nodeName, 'program')
    $$.deepEqual(clonedNode.target, 'program')
    $$.deepEqual(clonedNode.data, 'instruction')
  })

  $$.test('isEqualNode()', () => {
    const node2 = doc.createProcessingInstruction('program', 'instruction')
    $$.deepEqual(node.isEqualNode(node2), true)
    $$.deepEqual(node.isEqualNode(), false)
  })

  $$.test('_create()', () => {
    const node1 = $$.ProcessingInstruction._create(doc as any, 'target', 'data')
    $$.deepEqual(node1.nodeType, 7)
    $$.deepEqual(node1.nodeName, 'target')
    $$.deepEqual(node1.data, 'data')
  })

})