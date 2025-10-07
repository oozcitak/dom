import $$ from "../TestHelpers"

$$.suite('DocumentType', () => {

  $$.test('constructor()', () => {
    const node = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    $$.deepEqual(node.nodeType, 10)
    $$.deepEqual(node.nodeName, 'qname')
    $$.deepEqual(node.name, 'qname')
    $$.deepEqual(node.publicId, 'pubid')
    $$.deepEqual(node.systemId, 'sysid')
  })

  $$.test('constructor() invalid name', () => {
    $$.throws(() => $$.dom.createDocumentType('not_a_qname:', 'pub', 'sys'))
    $$.throws(() => $$.dom.createDocumentType('not a name', 'pub', 'sys'))
  })

  $$.test('isEqualNode()', () => {
    const node = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    const otherNode = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    $$.notStrictEqual(node, otherNode)
    $$.deepEqual(node.isEqualNode(otherNode), true)

    const anotherNode = $$.dom.createDocumentType('qname1', 'pubid1', 'sysid1')
    $$.deepEqual(node.isEqualNode(anotherNode), false)

    $$.deepEqual(node.isEqualNode(), false)
    $$.deepEqual(node.isEqualNode($$.dom.createDocument('ns', 'name')), false)
  })

  $$.test('cloneNode()', () => {
    const node = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    const clonedNode = <any>node.cloneNode()
    $$.deepEqual(clonedNode.nodeType, 10)
    $$.deepEqual(clonedNode.nodeName, 'qname')
    $$.deepEqual(clonedNode.name, 'qname')
    $$.deepEqual(clonedNode.publicId, 'pubid')
    $$.deepEqual(clonedNode.systemId, 'sysid')
  })

  $$.test('_create()', () => {
    const doc = $$.dom.createDocument('ns', 'qname')
    const node1 = $$.DocumentType._create(doc as any, 'name', 'pub', 'sys')
    $$.deepEqual(node1.name, 'name')
    $$.deepEqual(node1.publicId, 'pub')
    $$.deepEqual(node1.systemId, 'sys')
    const node2 = $$.DocumentType._create(doc as any, 'name')
    $$.deepEqual(node2.name, 'name')
    $$.deepEqual(node2.publicId, '')
    $$.deepEqual(node2.systemId, '')
  })

})