import $$ from "../TestHelpers"
import {
  treeWalker_traverseChildren, treeWalker_traverseSiblings
} from "../../src/algorithm"

$$.suite('TreeWalker', () => {

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

  $$.test('traverseChildren() first child', () => {
    const iter = doc.createTreeWalker(root, $$.WhatToShow.Element, (node) =>
      node.nodeName.startsWith('c') ? $$.FilterResult.Accept : $$.FilterResult.Skip
    )

    const node = treeWalker_traverseChildren(iter as any, true)

    $$.deepEqual(node, child1)
  })

  $$.test('traverseChildren() sibling of first child', () => {
    const iter = doc.createTreeWalker(root, $$.WhatToShow.Element, (node) =>
      node.nodeName.startsWith('c') && node.nodeName.endsWith('2') ? $$.FilterResult.Accept : $$.FilterResult.Skip
    )

    const node = treeWalker_traverseChildren(iter as any, true)

    $$.deepEqual(node, child2)
  })

  $$.test('traverseChildren() without matching children null', () => {
    const iter = doc.createTreeWalker(root, $$.WhatToShow.Element, (node) =>
      node.nodeName.startsWith('x') ? $$.FilterResult.Accept : $$.FilterResult.Skip
    )

    const node = treeWalker_traverseChildren(iter as any, true)

    $$.deepEqual(node, null)
  })

  $$.test('traverseChildren() without children returns null', () => {
    const iter = doc.createTreeWalker(child2)

    const node = treeWalker_traverseChildren(iter as any, true)

    $$.deepEqual(node, null)
  })

  $$.test('traverseSiblings() next sibling', () => {
    const iter = doc.createTreeWalker(root, $$.WhatToShow.Element)

    iter.currentNode = node1
    const node = treeWalker_traverseSiblings(iter as any, true)

    $$.deepEqual(node, node2)
  })

  $$.test('traverseSiblings() previous sibling', () => {
    const iter = doc.createTreeWalker(root, $$.WhatToShow.Element)

    iter.currentNode = node2
    const node = treeWalker_traverseSiblings(iter as any, false)

    $$.deepEqual(node, node1)
  })

  $$.test('traverseSiblings() at root returns null', () => {
    const iter = doc.createTreeWalker(root)

    const node = treeWalker_traverseSiblings(iter as any, true)

    $$.deepEqual(node, null)
  })

  $$.test('traverseSiblings() without siblings returns null', () => {
    const iter = doc.createTreeWalker(root)

    iter.currentNode = child32
    const node = treeWalker_traverseSiblings(iter as any, true)

    $$.deepEqual(node, null)
  })

  $$.test('traverseSiblings() without siblings returns null', () => {
    const iter = doc.createTreeWalker(root)

    iter.currentNode = node3
    const node = treeWalker_traverseSiblings(iter as any, true)

    $$.deepEqual(node, null)
  })

})