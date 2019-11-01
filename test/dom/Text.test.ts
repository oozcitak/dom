import $$ from '../TestHelpers'

describe('Text', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node = doc.createTextNode('peaceathome')
  const comment = doc.createComment('++++')
  const node1 = doc.createTextNode('peace')
  const node2 = doc.createTextNode('in')
  const node3 = doc.createTextNode('the')
  const node4 = doc.createTextNode('world')
  doc.documentElement.appendChild(node)
  doc.documentElement.appendChild(comment)
  doc.documentElement.appendChild(node1)
  doc.documentElement.appendChild(node2)
  doc.documentElement.appendChild(node3)
  doc.documentElement.appendChild(node4)

  test('constructor()', () => {
    expect(node1.nodeType).toBe(3)
    expect(node1.nodeName).toBe('#text')
    expect(node1.data).toBe('peace')
  })

  test('wholeText', () => {
    expect(node1.wholeText).toBe('peaceintheworld')
    expect(node2.wholeText).toBe('peaceintheworld')
    expect(node3.wholeText).toBe('peaceintheworld')
    expect(node4.wholeText).toBe('peaceintheworld')
    expect(node.wholeText).toBe('peaceathome')
  })

  test('splitText()', () => {
    const node5 = node.splitText(5)
    const node6 = node5.splitText(2)
    expect(node.data).toBe('peace')
    expect(node5.data).toBe('at')
    expect(node6.data).toBe('home')
    expect(node.wholeText).toBe('peaceathome')
    expect(() => node.splitText(1001)).toThrow()

    node.textContent = 'peaceathome'
    node5.remove()
    node6.remove()

    const node7 = node.splitText(5)
    node7.remove()
    const node8 = node7.splitText(2)
    expect(node.data).toBe('peace')
    expect(node7.data).toBe('at')
    expect(node8.data).toBe('home')
    expect(node.wholeText).toBe('peace')
  })

  test('cloneNode()', () => {
    const clonedNode = <any>node1.cloneNode()
    expect(clonedNode).not.toBe(node)
    expect(clonedNode.nodeType).toBe(3)
    expect(clonedNode.nodeName).toBe('#text')
    expect(clonedNode.data).toBe('peace')
  })

  test('_create()', () => {
    const node1 = $$.Text._create(doc as any, 'data')
    expect(node1.nodeType).toBe(3)
    expect(node1.nodeName).toBe('#text')
    expect(node1.data).toBe('data')
    const node2 = $$.Text._create(doc as any)
    expect(node2.data).toBe('')
  })

})