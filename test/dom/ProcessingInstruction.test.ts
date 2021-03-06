import $$ from "../TestHelpers"

describe('ProcessingInstruction', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createProcessingInstruction('program', 'instruction')
  doc.documentElement.appendChild(node)

  test('constructor()', () => {
    expect(node.nodeType).toBe(7)
    expect(node.nodeName).toBe('program')
    expect(node.target).toBe('program')
    expect(node.data).toBe('instruction')
  })

  test('cloneNode()', () => {
    const clonedNode = <any>node.cloneNode()
    expect(clonedNode).not.toBe(node)
    expect(clonedNode.nodeType).toBe(7)
    expect(clonedNode.nodeName).toBe('program')
    expect(clonedNode.target).toBe('program')
    expect(clonedNode.data).toBe('instruction')
  })

  test('isEqualNode()', () => {
    const node2 = doc.createProcessingInstruction('program', 'instruction')
    expect(node.isEqualNode(node2)).toBe(true)
    expect(node.isEqualNode()).toBe(false)
  })

  test('_create()', () => {
    const node1 = $$.ProcessingInstruction._create(doc as any, 'target', 'data')
    expect(node1.nodeType).toBe(7)
    expect(node1.nodeName).toBe('target')
    expect(node1.data).toBe('data')
  })

})