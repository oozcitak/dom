import $$ from './TestHelpers'

describe('Comment', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createComment('data')
  doc.documentElement.appendChild(node)

  test('constructor()', () => {
    expect(node.nodeType).toBe(8)
    expect(node.nodeName).toBe('#comment')
    expect(node.data).toBe('data')
  })

  test('cloneNode()', () => {
    const clonedNode = <any>node.cloneNode()
    expect(clonedNode).not.toBe(node)
    expect(clonedNode.nodeType).toBe(8)
    expect(clonedNode.nodeName).toBe('#comment')
    expect(clonedNode.data).toBe('data')
  })

  test('_create()', () => {
    const node1 = $$.Comment._create(doc as any, 'data')
    expect(node1.nodeType).toBe(8)
    expect(node1.nodeName).toBe('#comment')
    expect(node1.data).toBe('data')
    const node2 = $$.Comment._create(doc as any)
    expect(node2.data).toBe('')
  })

})