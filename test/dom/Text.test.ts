import $$ from "../TestHelpers"

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

  test('splitText() updates live ranges', () => {
    const ele = $$.newDoc
    const txt = new $$.Text("hello beautiful world")
    ele.appendChild(txt)
    const range = new $$.Range()
    range.setStart(txt, 6)
    range.setEnd(txt, 15)
    expect(range.cloneContents().textContent).toBe("beautiful")
    
    const txt2 = txt.splitText(10)
    expect(range.startContainer).toBe(txt)
    expect(range.startOffset).toBe(6)
    expect(range.endContainer).toBe(txt2)
    expect(range.endOffset).toBe(5)
    expect(range.cloneContents().textContent).toBe("beautiful")

    txt.data = "aaxxxaa"
    range.setStart(txt, 5)
    range.setEnd(txt, 7)
    const txt3 = txt.splitText(2)
    expect(range.startContainer).toBe(txt3)
    expect(range.startOffset).toBe(3)
    expect(range.endContainer).toBe(txt3)
    expect(range.endOffset).toBe(5)
  })

  test('splitText() live range moves', () => {
    const ele = $$.newDoc
    const txt1 = new $$.Text("aa")
    const txt2 = new $$.Text("bb")
    ele.append(txt1, txt2)
    const range = new $$.Range()
    range.setStart(ele, 1)
    range.setEnd(ele, 2)
    
    txt1.splitText(1)
    expect(range.startContainer).toBe(ele)
    expect(range.startOffset).toBe(2)
    expect(range.endContainer).toBe(ele)
    expect(range.endOffset).toBe(3)
  })

  test('splitText() live range grows to include new node', () => {
    const ele = $$.newDoc
    const txt1 = new $$.Text("aa")
    const txt2 = new $$.Text("bb")
    ele.append(txt1, txt2)
    const range = new $$.Range()
    range.setStart(ele, 0)
    range.setEnd(ele, 1)
    
    txt1.splitText(1)
    expect(range.startContainer).toBe(ele)
    expect(range.startOffset).toBe(0)
    expect(range.endContainer).toBe(ele)
    expect(range.endOffset).toBe(2)
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