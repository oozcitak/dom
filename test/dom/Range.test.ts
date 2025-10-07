import $$ from "../TestHelpers"

$$.suite('Range', () => {

	$$.test('constructor', () => {
		const doc = $$.window.document
		const range = new $$.Range()
		$$.deepEqual(range.startContainer, doc)
		$$.deepEqual(range.startOffset, 0)
		$$.deepEqual(range.endContainer, doc)
		$$.deepEqual(range.endOffset, 0)
	})

	$$.test('commonAncestorContainer', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		root.append(node1, node2)
		node1.append(child1, child2)

		const range = new $$.Range()
		range.setStart(child1, 0)
		range.setEnd(node2, 0)
		$$.deepEqual(range.commonAncestorContainer, root)
	})

	$$.test('setStart(), setEnd()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		root.append(node1, node2)

		const range = new $$.Range()
		range.setStart(node1, 0)
		range.setEnd(node2, 0)
		$$.deepEqual(range.startContainer, node1)
		$$.deepEqual(range.endContainer, node2)
	})

  $$.test('setStart(), setEnd() errors', () => {
    const dtd = $$.dom.createDocumentType('root', 'pub', 'sys')
    const doc = $$.dom.createDocument(null, 'root', dtd)
    const de = doc.documentElement
    if (!de)
      throw new Error("Document element is null")
    const com1 = doc.createComment('comment')
    const com2 = doc.createComment('comment')
    doc.insertBefore(com1, dtd)
    doc.insertBefore(com2, de)

		const range = new $$.Range()
		$$.throws(() => range.setStart(dtd, 0))
		$$.throws(() => range.setEnd(dtd, 0))
		$$.throws(() => range.setStart(de, 100))
		$$.throws(() => range.setEnd(de, 100))
  })

	$$.test('setStartBefore(), setStartAfter()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setStartBefore(node2)
		$$.deepEqual(range.startContainer, root)
		$$.deepEqual(range.startOffset, 1)

		range.setStartAfter(node2)
		$$.deepEqual(range.startContainer, root)
		$$.deepEqual(range.startOffset, 2)

		const doc = $$.dom.createDocument('ns', 'root')
		$$.throws(() => range.setStartBefore(doc))
		$$.throws(() => range.setStartAfter(doc))
	})

	$$.test('setEndBefore(), setEndAfter()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setEndBefore(node3)
		$$.deepEqual(range.endContainer, root)
		$$.deepEqual(range.endOffset, 2)

		range.setEndAfter(node3)
		$$.deepEqual(range.endContainer, root)
		$$.deepEqual(range.endOffset, 3)

		const doc = $$.dom.createDocument('ns', 'root')
		$$.throws(() => range.setEndBefore(doc))
		$$.throws(() => range.setEndAfter(doc))
	})

	$$.test('collapse()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setStart(root, 1)
		range.setEnd(root, 2)
		range.collapse()
		$$.deepEqual(range.startOffset, 2)
		$$.deepEqual(range.endOffset, 2)

		range.setStart(root, 1)
		range.setEnd(root, 2)
		range.collapse(true)
		$$.deepEqual(range.startOffset, 1)
		$$.deepEqual(range.endOffset, 1)
	})

	$$.test('selectNode()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.selectNode(node2)
		$$.deepEqual(range.startOffset, 1)
    $$.deepEqual(range.endOffset, 2)

    const noParent = root._nodeDocument.createElement('ele')
		$$.throws(() => range.selectNode(noParent))
	})

	$$.test('selectNodeContents()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('text')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.selectNodeContents(node2)
		$$.deepEqual(range.startContainer, node2)
		$$.deepEqual(range.endContainer, node2)
		$$.deepEqual(range.startOffset, 0)
		$$.deepEqual(range.endOffset, 4)
	})

	$$.test('selectNodeContents() docType node', () => {
		const docType = $$.dom.createDocumentType('name', 'pub', 'sys')
		$$.dom.createDocument('ns', 'name', docType)

		const range = new $$.Range()
		$$.throws(() => range.selectNodeContents(docType))
	})

	$$.test('compareBoundaryPoints()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range1 = new $$.Range()
		range1.setStartBefore(node1)
		range1.setEndAfter(node3)
		const range2 = new $$.Range()
		range2.setStartBefore(node2)
		range2.setEndAfter(node4)
		$$.deepEqual(range1.compareBoundaryPoints(0, range2), -1) // START_TO_START
		$$.deepEqual(range1.compareBoundaryPoints(1, range2), 1) // START_TO_END
		$$.deepEqual(range1.compareBoundaryPoints(2, range2), -1) // END_TO_END
		$$.deepEqual(range1.compareBoundaryPoints(3, range2), -1) // END_TO_START
		$$.deepEqual(range2.compareBoundaryPoints(0, range1), 1) // START_TO_START
		$$.deepEqual(range2.compareBoundaryPoints(1, range1), 1) // START_TO_END
		$$.deepEqual(range2.compareBoundaryPoints(2, range1), 1) // END_TO_END
		$$.deepEqual(range2.compareBoundaryPoints(3, range1), -1) // END_TO_START

		$$.deepEqual(range1.compareBoundaryPoints(0, range1), 0)
	})

	$$.test('compareBoundaryPoints() - invalid compare type', () => {
		const range1 = new $$.Range()
		const range2 = new $$.Range()
		$$.throws(() => range1.compareBoundaryPoints(1234 as unknown as any, range2))
	})

	$$.test('compareBoundaryPoints() - different documents', () => {
		const doc1 = $$.dom.createDocument('ns1', 'name1')
		const range1 = new $$.Range()
		range1.setStart(doc1, 0)
		const doc2 = $$.dom.createDocument('ns2', 'name2')
		const range2 = new $$.Range()
		range2.setStart(doc2, 0)

		$$.throws(() => range1.compareBoundaryPoints(0, range2))
	})

	$$.test('deleteContents() in a single node', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node3.append(child1, child2)

		const range = new $$.Range()

		range.selectNodeContents(node2)
		range.collapse()
		range.deleteContents()
		$$.deepEqual(node2.textContent, 'next')

		range.setStart(node2, 1)
		range.setEnd(node2, 3)
		range.deleteContents()
		$$.deepEqual(node2.textContent, 'nt')

		range.setStart(root, 1)
		range.setEnd(root, 3)
		range.deleteContents()
		$$.deepEqual(root.childNodes.length, 2)
		$$.deepEqual(root.childNodes.item(0), node1)
		$$.deepEqual(root.childNodes.item(1), node4)
	})

	$$.test('deleteContents() across multiple text nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const range = new $$.Range()

		range.setStart(node2, 1)
		range.setEnd(node4, 3)
		range.deleteContents()
		$$.deepEqual(root.childNodes.length, 4)
		$$.deepEqual(root.childNodes.item(0), node1)
		$$.deepEqual((root.childNodes.item(1) as any).textContent, 'n')
		$$.deepEqual((root.childNodes.item(2) as any).textContent, 'v')
		$$.deepEqual(root.childNodes.item(3), node5)
	})

	$$.test('deleteContents() across multiple nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node1.append(child1, child2)

		const range = new $$.Range()

		range.setStart(node1, 1)
		range.setEndAfter(node4)
		range.deleteContents()
		$$.deepEqual(root.childNodes.length, 2)
		$$.deepEqual(root.childNodes.item(0), node1)
		$$.deepEqual(root.childNodes.item(1), node5)
		$$.deepEqual(node1.childNodes.length, 1)
		$$.deepEqual(node1.childNodes.item(0), child1)
	})

	$$.test('deleteContents() across multiple nested nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node1.append(child1, child2)
		const grandChild1 = root._nodeDocument.createElement('grandChild1')
		const grandChild2 = root._nodeDocument.createElement('grandChild2')
		child1.append(grandChild1, grandChild2)

		const range = new $$.Range()

		range.setStart(child1, 1)
		range.setEndAfter(node4)
		range.deleteContents()
		$$.deepEqual(root.childNodes.length, 2)
		$$.deepEqual(root.childNodes.item(0), node1)
		$$.deepEqual(root.childNodes.item(1), node5)
		$$.deepEqual(node1.childNodes.length, 1)
		$$.deepEqual(node1.childNodes.item(0), child1)
		$$.deepEqual(child1.childNodes.length, 1)
		$$.deepEqual(child1.childNodes.item(0), grandChild1)
	})

	$$.test('cloneContents() in a single node', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node3.append(child1, child2)

		const range = new $$.Range()

		range.selectNodeContents(node2)
		range.collapse()
		const frag1 = range.cloneContents()
		$$.deepEqual(frag1.childNodes.length, 0)

		range.setStart(node2, 1)
		range.setEnd(node2, 3)
		const frag2 = range.cloneContents()
		$$.deepEqual(frag2.childNodes.length, 1)
		$$.deepEqual((frag2.childNodes.item(0) as any).textContent, 'ex')

		range.setStart(root, 1)
		range.setEnd(root, 3)
		const frag3 = range.cloneContents()
		$$.deepEqual(frag3.childNodes.length, 2)
		$$.deepEqual((frag3.childNodes.item(0) as any).textContent, 'next')
		$$.deepEqual((frag3.childNodes.item(1) as any).localName, 'node3')
	})

	$$.test('cloneContents() across multiple text nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const range = new $$.Range()

		range.setStart(node2, 1)
		range.setEnd(node4, 3)
		const frag = range.cloneContents()
		$$.deepEqual(frag.childNodes.length, 3)
		$$.deepEqual((frag.childNodes.item(0) as any).textContent, 'ext')
		$$.deepEqual((frag.childNodes.item(1) as any).localName, 'node3')
		$$.deepEqual((frag.childNodes.item(2) as any).textContent, 'pre')
	})

	$$.test('cloneContents() across multiple nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node1.append(child1, child2)

		const range = new $$.Range()

		range.setStart(node1, 1)
		range.setEndAfter(node4)
		const frag = range.cloneContents()
		$$.deepEqual(frag.childNodes.length, 4)
		$$.deepEqual((frag.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((frag.childNodes.item(1) as any).textContent, 'next')
		$$.deepEqual((frag.childNodes.item(2) as any).localName, 'node3')
		$$.deepEqual((frag.childNodes.item(3) as any).textContent, 'prev')
		$$.deepEqual((frag.childNodes.item(0) as any).childNodes.length, 1)
		$$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName, 'child2')
	})

	$$.test('cloneContents() across multiple nested nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node1.append(child1, child2)
		const grandChild1 = root._nodeDocument.createElement('grandChild1')
		const grandChild2 = root._nodeDocument.createElement('grandChild2')
		child1.append(grandChild1, grandChild2)

		const range = new $$.Range()

		range.setStart(child1, 1)
		range.setEndAfter(node4)
		const frag = range.cloneContents()
		$$.deepEqual(frag.childNodes.length, 4)
		$$.deepEqual((frag.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((frag.childNodes.item(1) as any).textContent, 'next')
		$$.deepEqual((frag.childNodes.item(2) as any).localName, 'node3')
		$$.deepEqual((frag.childNodes.item(3) as any).textContent, 'prev')
		$$.deepEqual((frag.childNodes.item(0) as any).childNodes.length, 2)
		$$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName, 'child1')
		$$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(1) as any).localName, 'child2')
		$$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.length, 1)
		$$.deepEqual((((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.item(0) as any).localName, 'grandChild2')
	})

	$$.test('range is updated when the tree is mutated', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()

		range.setStart(root, 1)
		range.setEnd(root, 3)
		root.removeChild(node3)
		$$.deepEqual(range.startOffset, 1)
		$$.deepEqual(range.endOffset, 2)
	})

	$$.test('intersectsNode()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const root2 = $$.newDoc
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		root2.append(child1, child2)

		const range = new $$.Range()

		range.setStart(node2, 2)
		range.setEnd(node4, 3)
		$$.deepEqual(range.intersectsNode(root._nodeDocument), true)
		$$.deepEqual(range.intersectsNode(node3), true)
		$$.deepEqual(range.intersectsNode(node5), false)

		range.setStart(root, 1)
		range.setEnd(root, 3)
		$$.deepEqual(range.intersectsNode(child2), false)
	})

	$$.test('insertNode()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const range = new $$.Range()
		range.setStart(root, 1)
		range.setEnd(root, 3)

		$$.throws(() => range.insertNode(root))
		const newNode = root._nodeDocument.createElement('new')
		range.insertNode(newNode)
		$$.deepEqual(range.startOffset, 1)
		$$.deepEqual(range.endOffset, 4)
		$$.deepEqual(root.childNodes.length, 6)
	})

	$$.test('isPointInRange() guards', () => {
		const root = $$.newDoc
		const docType = $$.dom.createDocumentType('name', 'pub', 'sys')
		root._nodeDocument.insertBefore(docType, root)
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const root2 = $$.newDoc

		const range = new $$.Range()
		range.setStart(node2, 2)
		range.setEnd(node4, 3)

		$$.deepEqual(range.isPointInRange(root2, 0), false)
		$$.throws(() => range.isPointInRange(docType, 0))
		$$.throws(() => range.isPointInRange(node1, 20))
	})

	$$.test('isPointInRange()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const range = new $$.Range()
		range.setStart(node2, 2)
		range.setEnd(node4, 3)

		$$.deepEqual(range.isPointInRange(node1, 0), false)
		$$.deepEqual(range.isPointInRange(node5, 0), false)
		$$.deepEqual(range.isPointInRange(node3, 0), true)
	})

	$$.test('comparePoint() guards', () => {
		const root = $$.newDoc
		const docType = $$.dom.createDocumentType('name', 'pub', 'sys')
		root._nodeDocument.insertBefore(docType, root)
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const root2 = $$.newDoc

		const range = new $$.Range()
		range.setStart(node2, 2)
		range.setEnd(node4, 3)

		$$.throws(() => range.comparePoint(root2, 0))
		$$.throws(() => range.comparePoint(docType, 0))
		$$.throws(() => range.comparePoint(node1, 20))
	})

	$$.test('comparePoint()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const range = new $$.Range()
		range.setStart(node2, 2)
		range.setEnd(node4, 3)

		$$.deepEqual(range.comparePoint(node1, 0), -1)
		$$.deepEqual(range.comparePoint(node5, 0), 1)
		$$.deepEqual(range.comparePoint(node3, 0), 0)
	})

	$$.test('cloneRange()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setStart(root, 1)
		range.setEnd(root, 3)
		const clone = range.cloneRange()
		$$.notStrictEqual(clone, range)
		$$.deepEqual(clone.startOffset, 1)
		$$.deepEqual(clone.endOffset, 3)
	})

	$$.test('detach() - range is updated when the tree is mutated', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()

		range.setStart(root, 1)
		range.setEnd(root, 3)
		root.removeChild(node3)
		$$.deepEqual(range.startOffset, 1)
		$$.deepEqual(range.endOffset, 2)
	})

	$$.test('detach() - range is no longer updated when the tree is mutated', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()

		range.setStart(root, 1)
		range.setEnd(root, 3)
		range.detach()
		root.removeChild(node3)
		$$.deepEqual(range.startOffset, 1)
		$$.deepEqual(range.endOffset, 3)
	})

	$$.test('stringify', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)
		const child1 = root._nodeDocument.createTextNode(' ? ')
		const child2 = root._nodeDocument.createTextNode(' ! ')
		node3.append(child1, child2)
		const range = new $$.Range()

		range.setStart(node2, 2)
		range.setEnd(node4, 3)
		$$.deepEqual(range.toString(), 'xt ?  ! pre')
	})

	$$.test('extractContents() in a single node', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node3.append(child1, child2)

		const range = new $$.Range()

		range.selectNodeContents(node2)
		range.collapse()
		const frag1 = range.extractContents()
		$$.deepEqual(frag1.childNodes.length, 0)

		range.setStart(node2, 1)
		range.setEnd(node2, 3)
		const frag2 = range.extractContents()
		$$.deepEqual(frag2.childNodes.length, 1)
		$$.deepEqual((frag2.childNodes.item(0) as any).textContent, 'ex')
		$$.deepEqual(node2.textContent, 'nt')

		range.setStart(root, 1)
		range.setEnd(root, 3)
		const frag3 = range.extractContents()
		$$.deepEqual(frag3.childNodes.length, 2)
		$$.deepEqual((frag3.childNodes.item(0) as any).textContent, 'nt')
		$$.deepEqual((frag3.childNodes.item(1) as any).localName, 'node3')
		$$.deepEqual((frag3.childNodes.item(1) as any).childNodes.length, 2)
		$$.deepEqual(((frag3.childNodes.item(1) as any).childNodes.item(0) as any).localName, 'child1')
    $$.deepEqual(((frag3.childNodes.item(1) as any).childNodes.item(1) as any).localName, 'child2')

		$$.deepEqual(root.childNodes.length, 2)
		$$.deepEqual((root.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((root.childNodes.item(1) as any).localName, 'node4')
	})

	$$.test('extractContents() across multiple text nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)

		const range = new $$.Range()

		range.setStart(node2, 1)
		range.setEnd(node4, 3)
		const frag = range.extractContents()
		$$.deepEqual(frag.childNodes.length, 3)
		$$.deepEqual((frag.childNodes.item(0) as any).textContent, 'ext')
		$$.deepEqual((frag.childNodes.item(1) as any).localName, 'node3')
    $$.deepEqual((frag.childNodes.item(2) as any).textContent, 'pre')

		$$.deepEqual(root.childNodes.length, 4)
		$$.deepEqual((root.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((root.childNodes.item(1) as any).textContent, 'n')
		$$.deepEqual((root.childNodes.item(2) as any).textContent, 'v')
		$$.deepEqual((root.childNodes.item(3) as any).localName, 'node5')
	})

	$$.test('extractContents() across multiple nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node1.append(child1, child2)

		const range = new $$.Range()

		range.setStart(node1, 1)
		range.setEndAfter(node4)
		const frag = range.extractContents()
		$$.deepEqual(frag.childNodes.length, 4)
		$$.deepEqual((frag.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((frag.childNodes.item(1) as any).textContent, 'next')
		$$.deepEqual((frag.childNodes.item(2) as any).localName, 'node3')
		$$.deepEqual((frag.childNodes.item(3) as any).textContent, 'prev')
		$$.deepEqual((frag.childNodes.item(0) as any).childNodes.length, 1)
    $$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName, 'child2')

		$$.deepEqual(root.childNodes.length, 2)
		$$.deepEqual((root.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((root.childNodes.item(1) as any).localName, 'node5')
		$$.deepEqual((root.childNodes.item(0) as any).childNodes.length, 1)
		$$.deepEqual(((root.childNodes.item(0) as any).childNodes.item(0) as any).localName, 'child1')
  })

	$$.test('extractContents() across multiple nested nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
		root.append(node1, node2, node3, node4, node5)
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		node1.append(child1, child2)
		const grandChild1 = root._nodeDocument.createElement('grandChild1')
		const grandChild2 = root._nodeDocument.createElement('grandChild2')
		child1.append(grandChild1, grandChild2)

		const range = new $$.Range()

		range.setStart(child1, 1)
		range.setEndAfter(node4)
		const frag = range.extractContents()
		$$.deepEqual(frag.childNodes.length, 4)
		$$.deepEqual((frag.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((frag.childNodes.item(1) as any).textContent, 'next')
		$$.deepEqual((frag.childNodes.item(2) as any).localName, 'node3')
		$$.deepEqual((frag.childNodes.item(3) as any).textContent, 'prev')
		$$.deepEqual((frag.childNodes.item(0) as any).childNodes.length, 2)
		$$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName, 'child1')
		$$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(1) as any).localName, 'child2')
		$$.deepEqual(((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.length, 1)
    $$.deepEqual((((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.item(0) as any).localName, 'grandChild2')

		$$.deepEqual(root.childNodes.length, 2)
		$$.deepEqual((root.childNodes.item(0) as any).localName, 'node1')
		$$.deepEqual((root.childNodes.item(1) as any).localName, 'node5')
		$$.deepEqual((root.childNodes.item(0) as any).childNodes.length, 1)
		$$.deepEqual(((root.childNodes.item(0) as any).childNodes.item(0) as any).localName, 'child1')
		$$.deepEqual(((root.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.length, 1)
		$$.deepEqual((((root.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.item(0) as any).localName, 'grandChild1')
  })

	$$.test('surroundContents() guards', () => {
		const docType = $$.dom.createDocumentType('name', 'pub', 'sys')
    const doc = $$.dom.createDocument('ns', 'name', docType)
    const frag = new $$.DocumentFragment()

    const root = doc.documentElement
    if (!root) {
      throw new Error("Document element is null")
    }

		const node1 = doc.createElement('node1')
		const node2 = doc.createTextNode('next')
		const node3 = doc.createElement('node3')
		const node4 = doc.createTextNode('prev')
    const node5 = doc.createElement('node5')
    root.append(node1, node2, node3, node4, node5)
		const child1 = doc.createElement('child1')
		const child2 = doc.createElement('child2')
    node1.append(child1, child2)

    const newParent = doc.createElement('parent')

		const range = new $$.Range()
		range.setStart(node1, 1)
    range.setEnd(root, 3)

    // splits a non-Text node with only one of its boundary points
    $$.throws(() => range.surroundContents(newParent))

    range.setStart(root, 1)
    range.setEnd(root, 3)
    $$.throws(() => range.surroundContents(doc))
    $$.throws(() => range.surroundContents(docType))
    $$.throws(() => range.surroundContents(frag))
  })

	$$.test('surroundContents()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
    root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setStart(root, 1)
    range.setEnd(root, 3)

    const newParent = root._nodeDocument.createElement('parent')

    range.surroundContents(newParent)

		$$.deepEqual(root.childNodes.length, 3)
    $$.deepEqual((root.childNodes.item(0) as any).localName, 'node1')
    $$.deepEqual((root.childNodes.item(1) as any).localName, 'parent')
    $$.deepEqual((root.childNodes.item(2) as any).localName, 'node4')
    $$.deepEqual((root.childNodes.item(1) as any).childNodes.length, 2)
    $$.deepEqual(((root.childNodes.item(1) as any).childNodes.item(0) as any).localName, 'node2')
    $$.deepEqual(((root.childNodes.item(1) as any).childNodes.item(1) as any).localName, 'node3')
  })

	$$.test('surroundContents() splits text node', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('next')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createTextNode('prev')
		const node5 = root._nodeDocument.createElement('node5')
    root.append(node1, node2, node3, node4, node5)

		const range = new $$.Range()
		range.setStart(node2, 2)
    range.setEnd(node4, 2)

    const newParent = root._nodeDocument.createElement('parent')

    range.surroundContents(newParent)

		$$.deepEqual(root.childNodes.length, 5)
    $$.deepEqual((root.childNodes.item(0) as any).localName, 'node1')
    $$.deepEqual((root.childNodes.item(1) as any).textContent, 'ne')
    $$.deepEqual((root.childNodes.item(2) as any).localName, 'parent')
    $$.deepEqual((root.childNodes.item(3) as any).textContent, 'ev')
    $$.deepEqual((root.childNodes.item(4) as any).localName, 'node5')
    $$.deepEqual((root.childNodes.item(2) as any).childNodes.length, 3)
    $$.deepEqual(((root.childNodes.item(2) as any).childNodes.item(0) as any).textContent, 'xt')
    $$.deepEqual(((root.childNodes.item(2) as any).childNodes.item(1) as any).localName, 'node3')
    $$.deepEqual(((root.childNodes.item(2) as any).childNodes.item(2) as any).textContent, 'pr')
  })

	$$.test('surroundContents() new parent with child nodes', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
    root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setStart(root, 1)
    range.setEnd(root, 3)

    const newParent = root._nodeDocument.createElement('parent')
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
    newParent.append(child1, child2)

    range.surroundContents(newParent)

		$$.deepEqual(root.childNodes.length, 3)
    $$.deepEqual((root.childNodes.item(0) as any).localName, 'node1')
    $$.deepEqual((root.childNodes.item(1) as any).localName, 'parent')
    $$.deepEqual((root.childNodes.item(2) as any).localName, 'node4')
    $$.deepEqual((root.childNodes.item(1) as any).childNodes.length, 2)
    $$.deepEqual(((root.childNodes.item(1) as any).childNodes.item(0) as any).localName, 'node2')
    $$.deepEqual(((root.childNodes.item(1) as any).childNodes.item(1) as any).localName, 'node3')
  })

  $$.test('constants', () => {
		const range = new $$.Range()
    $$.deepEqual(range.START_TO_END, 1)
    $$.deepEqual($$.Range.START_TO_END, 1)
  })

})
