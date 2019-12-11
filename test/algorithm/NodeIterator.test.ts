import $$ from "../TestHelpers"
import { nodeIterator_traverse } from "../../src/algorithm"

describe('NodeIterator', () => {

  const doc = $$.dom.createDocument(null, 'root')
  const root = doc.documentElement
  if (!root)
    throw new Error("documentElement is null")

  const node1 = doc.createElement('node1')
  root.appendChild(node1)
  const child1 = doc.createElement('child1')
  node1.appendChild(child1)
  node1.appendChild(doc.createTextNode('text'))
  const child2 = doc.createElement('child2')
  node1.appendChild(child2)
  node1.appendChild(doc.createComment('comment'))
  const node2 = doc.createElement('node2')
  root.appendChild(node2)
  const node3 = doc.createElement('node3')
  root.appendChild(node3)
  const child31 = doc.createElement('child3_1')
  node3.appendChild(child31)
  child31.appendChild(doc.createElement('child3_1_1'))
  child31.appendChild(doc.createElement('child3_1_2'))
  const child32 = doc.createElement('child3_2')
  node3.appendChild(child32)

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

  test('traverse() forward', () => {
    const iter = doc.createNodeIterator(root, $$.WhatToShow.Element)

    iter.nextNode() // skip root
    const node = nodeIterator_traverse(iter as any, true)

    expect(node).toBe(node1)
    expect(iter.referenceNode).toBe(node1)
    expect(iter.pointerBeforeReferenceNode).toBe(false)
  })

  test('traverse() backward', () => {
    const iter = doc.createNodeIterator(root, $$.WhatToShow.Element)

    const node = nodeIterator_traverse(iter as any, false)

    expect(node).toBeNull()
    expect(iter.referenceNode).toBe(root)
    expect(iter.pointerBeforeReferenceNode).toBe(true)
  })

})