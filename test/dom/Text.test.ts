import $$ from "../TestHelpers"

$$.suite('Text', () => {

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

  $$.test('constructor()', () => {
    $$.deepEqual(node1.nodeType, 3)
    $$.deepEqual(node1.nodeName, '#text')
    $$.deepEqual(node1.data, 'peace')
  })

  $$.test('wholeText', () => {
    $$.deepEqual(node1.wholeText, 'peaceintheworld')
    $$.deepEqual(node2.wholeText, 'peaceintheworld')
    $$.deepEqual(node3.wholeText, 'peaceintheworld')
    $$.deepEqual(node4.wholeText, 'peaceintheworld')
    $$.deepEqual(node.wholeText, 'peaceathome')
  })

  $$.test('splitText()', () => {
    const node5 = node.splitText(5)
    const node6 = node5.splitText(2)
    $$.deepEqual(node.data, 'peace')
    $$.deepEqual(node5.data, 'at')
    $$.deepEqual(node6.data, 'home')
    $$.deepEqual(node.wholeText, 'peaceathome')
    $$.throws(() => node.splitText(1001))

    node.textContent = 'peaceathome'
    node5.remove()
    node6.remove()

    const node7 = node.splitText(5)
    node7.remove()
    const node8 = node7.splitText(2)
    $$.deepEqual(node.data, 'peace')
    $$.deepEqual(node7.data, 'at')
    $$.deepEqual(node8.data, 'home')
    $$.deepEqual(node.wholeText, 'peace')
  })

  $$.test('splitText() updates live ranges', () => {
    const ele = $$.newDoc
    const txt = new $$.Text("hello beautiful world")
    ele.appendChild(txt)
    const range = new $$.Range()
    range.setStart(txt, 6)
    range.setEnd(txt, 15)
    $$.deepEqual(range.cloneContents().textContent, "beautiful")

    const txt2 = txt.splitText(10)
    $$.deepEqual(range.startContainer, txt)
    $$.deepEqual(range.startOffset, 6)
    $$.deepEqual(range.endContainer, txt2)
    $$.deepEqual(range.endOffset, 5)
    $$.deepEqual(range.cloneContents().textContent, "beautiful")

    txt.data = "aaxxxaa"
    range.setStart(txt, 5)
    range.setEnd(txt, 7)
    const txt3 = txt.splitText(2)
    $$.deepEqual(range.startContainer, txt3)
    $$.deepEqual(range.startOffset, 3)
    $$.deepEqual(range.endContainer, txt3)
    $$.deepEqual(range.endOffset, 5)
  })

  $$.test('splitText() live range moves', () => {
    const ele = $$.newDoc
    const txt1 = new $$.Text("aa")
    const txt2 = new $$.Text("bb")
    ele.append(txt1, txt2)
    const range = new $$.Range()
    range.setStart(ele, 1)
    range.setEnd(ele, 2)

    txt1.splitText(1)
    $$.deepEqual(range.startContainer, ele)
    $$.deepEqual(range.startOffset, 2)
    $$.deepEqual(range.endContainer, ele)
    $$.deepEqual(range.endOffset, 3)
  })

  $$.test('splitText() live range grows to include new node', () => {
    const ele = $$.newDoc
    const txt1 = new $$.Text("aa")
    const txt2 = new $$.Text("bb")
    ele.append(txt1, txt2)
    const range = new $$.Range()
    range.setStart(ele, 0)
    range.setEnd(ele, 1)

    txt1.splitText(1)
    $$.deepEqual(range.startContainer, ele)
    $$.deepEqual(range.startOffset, 0)
    $$.deepEqual(range.endContainer, ele)
    $$.deepEqual(range.endOffset, 2)
  })

  $$.test('cloneNode()', () => {
    const clonedNode = <any>node1.cloneNode()
    $$.notDeepEqual(clonedNode, node)
    $$.deepEqual(clonedNode.nodeType, 3)
    $$.deepEqual(clonedNode.nodeName, '#text')
    $$.deepEqual(clonedNode.data, 'peace')
  })

  $$.test('_create()', () => {
    const node1 = $$.Text._create(doc as any, 'data')
    $$.deepEqual(node1.nodeType, 3)
    $$.deepEqual(node1.nodeName, '#text')
    $$.deepEqual(node1.data, 'data')
    const node2 = $$.Text._create(doc as any)
    $$.deepEqual(node2.data, '')
  })

})