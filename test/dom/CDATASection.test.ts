import $$ from './TestHelpers'

describe('CDATASection', function () {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createCDATASection('data')
  doc.documentElement.appendChild(node)

  test('constructor()', function () {
    expect(node.nodeType).toBe(4)
    expect(node.nodeName).toBe('#cdata-section')
    expect(node.data).toBe('data')
  })

  test('cloneNode()', function () {
    const clonedNode = <any>node.cloneNode()
    expect(clonedNode).not.toBe(node)
    expect(clonedNode.nodeType).toBe(4)
    expect(clonedNode.nodeName).toBe('#cdata-section')
    expect(clonedNode.data).toBe('data')
  })


  test('_create()', function () {
    const node1 = $$.CDATASection._create(doc as any, 'data')
    expect(node1.nodeType).toBe(4)
    expect(node1.nodeName).toBe('#cdata-section')
    expect(node1.data).toBe('data')
    const node2 = $$.CDATASection._create(doc as any)
    expect(node2.data).toBe('')
  })

})