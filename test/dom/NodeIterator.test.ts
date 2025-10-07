import $$ from "../TestHelpers"

$$.suite('NodeIterator', () => {

  const doc = $$.dom.createDocument(null, 'root')
  const root = doc.documentElement
  if (!root)
    throw new Error("documentElement is null")

  const node1 = doc.createElement('node1')
  root.appendChild(node1)
  node1.appendChild(doc.createElement('child1'))
  node1.appendChild(doc.createTextNode('text'))
  node1.appendChild(doc.createElement('child2'))
  node1.appendChild(doc.createComment('comment'))
  root.appendChild(doc.createElement('node2'))
  const node3 = doc.createElement('node3')
  root.appendChild(node3)
  const child31 = doc.createElement('child3_1')
  node3.appendChild(child31)
  child31.appendChild(doc.createElement('child3_1_1'))
  child31.appendChild(doc.createElement('child3_1_2'))
  node3.appendChild(doc.createElement('child3_2'))

  $$.deepEqual($$.printTree(doc), $$.t`
    root
      node1
        child1
        # text
        child2
        ! comment
      node2
      node3
        child3_1
          child3_1_1
          child3_1_2
        child3_2
    `)

  $$.test('nextNode()', () => {
    const iter = doc.createNodeIterator(root)
    let str = ''
    let node = iter.nextNode()
    while (node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    $$.deepEqual(str, ':root:node1:child1:#text:child2:#comment:node2:node3:child3_1:child3_1_1:child3_1_2:child3_2')
  })

  $$.test('nextNode() with type filter', () => {
    const iter = doc.createNodeIterator(node1, $$.WhatToShow.Element)
    let str = ''
    let node = iter.nextNode()
    while (node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    $$.deepEqual(str, ':node1:child1:child2')
  })

  $$.test('nextNode() with user filter', () => {
    const iter = doc.createNodeIterator(node1, $$.WhatToShow.Element, (node) =>
      node.nodeName.startsWith('c') ? $$.FilterResult.Accept : $$.FilterResult.Reject
    )


    let str = ''
    let node = iter.nextNode()
    while (node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    $$.deepEqual(str, ':child1:child2')
  })

  $$.test('previousNode()', () => {
    const iter = doc.createNodeIterator(root)
    let str = ''
    let node = iter.nextNode()
    while (node) {
      node = iter.nextNode()
    }
    node = iter.previousNode()
    while (node) {
      str += ':' + node.nodeName
      node = iter.previousNode()
    }
    $$.deepEqual(str, ':child3_2:child3_1_2:child3_1_1:child3_1:node3:node2:#comment:child2:#text:child1:node1:root')
  })

})