import $$ from "../TestHelpers"

describe('TreeWalker', () => {

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

  expect($$.printTree(doc)).toBe($$.t`
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

  test('nextNode()', () => {
    const iter = doc.createTreeWalker(root)
    let str = ''
    let node = iter.nextNode()
    while (node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    expect(str).toBe(':node1:child1:#text:child2:#comment:node2:node3:child3_1:child3_1_1:child3_1_2:child3_2')
  })

  test('nextNode() with type filter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    let str = ''
    let node = iter.nextNode()
    while (node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    expect(str).toBe(':child1:child2')
  })

  test('nextNode() with user filter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.All, (node) =>
      node.nodeName.endsWith('1') ? $$.FilterResult.Accept : $$.FilterResult.Reject
    )

    let str = ''
    let node = iter.nextNode()
    while (node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    expect(str).toBe(':child1')
  })

  test('nextNode() null check', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.ProcessingInstruction)
    expect(iter.nextNode()).toBeNull()
  })

  test('previousNode()', () => {
    const iter = doc.createTreeWalker(root)
    let str = ''
    let node = iter.nextNode()
    while (node) {
      node = iter.nextNode()
    }
    node = iter.currentNode
    while (node) {
      str += ':' + node.nodeName
      node = iter.previousNode()
    }
    expect(str).toBe(':child3_2:child3_1_2:child3_1_1:child3_1:node3:node2:#comment:child2:#text:child1:node1:root')
  })

  test('previousNode() with type filter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    let str = ''
    let node = iter.nextNode()
    while (node) {
      node = iter.nextNode()
    }
    node = iter.currentNode
    while (node) {
      str += ':' + node.nodeName
      node = iter.previousNode()
    }
    expect(str).toBe(':child2:child1:node1')
  })

  test('previousNode() with user filter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.All, (node) =>
      node.nodeName.endsWith('1') ? $$.FilterResult.Accept : $$.FilterResult.Reject
    )

    let str = ''
    let node = iter.nextNode()
    while (node) {
      node = iter.nextNode()
    }
    node = iter.currentNode
    while (node) {
      str += ':' + node.nodeName
      node = iter.previousNode()
    }
    expect(str).toBe(':child1:node1')
  })

  test('previousNode() null check', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.ProcessingInstruction)
    iter.nextNode()
    expect(iter.previousNode()).toBeNull()
  })

  test('currentNode getter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    expect(iter.currentNode).toBe(node1)
  })

  test('currentNode setter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    const child1 = node1.firstElementChild
    if (!child1)
      throw new Error("firstElementChild is null")
    const child2 = child1.nextElementSibling
    if (!child2)
      throw new Error("nextElementSibling is null")

    iter.currentNode = child1
    iter.nextNode()
    expect(iter.currentNode).toBe(child2)
  })

  test('parentNode()', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    iter.nextNode()
    expect(iter.parentNode()).toBe(node1)
  })

  test('parentNode() null check', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    expect(iter.parentNode()).toBeNull()
  })

  test('firstChild()', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    const child1 = node1.firstElementChild
    if (!child1)
      throw new Error("firstElementChild is null")
    expect(iter.firstChild()).toBe(child1)
  })

  test('firstChild() with user filter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.All, (node) =>
      node.nodeName.endsWith('1') ? $$.FilterResult.Accept : $$.FilterResult.Reject
    )
    const child1 = node1.firstElementChild
    if (!child1)
      throw new Error("firstElementChild is null")
    expect(iter.firstChild()).toBe(child1)
  })

  test('lastChild()', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    const child1 = node1.firstElementChild
    if (!child1)
      throw new Error("firstElementChild is null")
    const child2 = child1.nextElementSibling
    if (!child2)
      throw new Error("nextElementSibling is null")

    expect(iter.lastChild()).toBe(child2)
  })

  test('lastChild() with user filter', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.All, (node) =>
      node.nodeName.endsWith('2') ? $$.FilterResult.Accept : $$.FilterResult.Reject
    )
    const child1 = node1.firstElementChild
    if (!child1)
      throw new Error("firstElementChild is null")
    const child2 = child1.nextElementSibling
    if (!child2)
      throw new Error("nextElementSibling is null")
    expect(iter.lastChild()).toBe(child2)
  })

  test('nextSibling()', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    const child1 = node1.firstElementChild
    if (!child1)
      throw new Error("firstElementChild is null")
    const child2 = child1.nextElementSibling
    if (!child2)
      throw new Error("nextElementSibling is null")

    iter.firstChild()
    expect(iter.nextSibling()).toBe(child2)
  })

  test('previousSibling()', () => {
    const iter = doc.createTreeWalker(node1, $$.WhatToShow.Element)
    const child1 = node1.firstElementChild
    if (!child1)
      throw new Error("firstElementChild is null")
    const child2 = child1.nextElementSibling
    if (!child2)
      throw new Error("nextElementSibling is null")

    iter.lastChild()
    expect(iter.previousSibling()).toBe(child1)
  })

})
