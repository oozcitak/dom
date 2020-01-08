import $$ from "../TestHelpers"

describe('NodeFilter', () => {

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

  test('acceptNode()', () => {
    const filter = $$.NodeFilter._create()
    const iter = doc.createTreeWalker(root, $$.WhatToShow.All, filter)
    let str = ''
    let node = iter.nextNode()
    while(node) {
      str += ':' + node.nodeName
      node = iter.nextNode()
    }
    expect(str).toBe(':node1:child1:#text:child2:#comment:node2:node3:child3_1:child3_1_1:child3_1_2:child3_2')
  })

  test('constants', () => {
    const filter = $$.NodeFilter._create()
    expect(filter.FILTER_ACCEPT).toBe(1)
    expect($$.NodeFilter.FILTER_ACCEPT).toBe(1)
  })

})