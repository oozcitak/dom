import $$ from "../TestHelpers"

describe('Range', () => {

	test('constructor', () => {
		const doc = $$.window.document
		const range = new $$.Range()
		expect(range.startContainer).toBe(doc)
		expect(range.startOffset).toBe(0)
		expect(range.endContainer).toBe(doc)
		expect(range.endOffset).toBe(0)
	})

	test('commonAncestorContainer', () => {
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
		expect(range.commonAncestorContainer).toBe(root)
	})

	test('setStart(), setEnd()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		root.append(node1, node2)

		const range = new $$.Range()
		range.setStart(node1, 0)
		range.setEnd(node2, 0)
		expect(range.startContainer).toBe(node1)
		expect(range.endContainer).toBe(node2)
	})

  test('setStart(), setEnd() errors', () => {
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
		expect(() => range.setStart(dtd, 0)).toThrow()
		expect(() => range.setEnd(dtd, 0)).toThrow()
		expect(() => range.setStart(de, 100)).toThrow()
		expect(() => range.setEnd(de, 100)).toThrow()
  })
  
	test('setStartBefore(), setStartAfter()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setStartBefore(node2)
		expect(range.startContainer).toBe(root)
		expect(range.startOffset).toBe(1)

		range.setStartAfter(node2)
		expect(range.startContainer).toBe(root)
		expect(range.startOffset).toBe(2)

		const doc = $$.dom.createDocument('ns', 'root')
		expect(() => range.setStartBefore(doc)).toThrow()
		expect(() => range.setStartAfter(doc)).toThrow()
	})

	test('setEndBefore(), setEndAfter()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.setEndBefore(node3)
		expect(range.endContainer).toBe(root)
		expect(range.endOffset).toBe(2)

		range.setEndAfter(node3)
		expect(range.endContainer).toBe(root)
		expect(range.endOffset).toBe(3)

		const doc = $$.dom.createDocument('ns', 'root')
		expect(() => range.setEndBefore(doc)).toThrow()
		expect(() => range.setEndAfter(doc)).toThrow()
	})

	test('collapse()', () => {
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
		expect(range.startOffset).toBe(2)
		expect(range.endOffset).toBe(2)

		range.setStart(root, 1)
		range.setEnd(root, 2)
		range.collapse(true)
		expect(range.startOffset).toBe(1)
		expect(range.endOffset).toBe(1)
	})

	test('selectNode()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.selectNode(node2)
		expect(range.startOffset).toBe(1)
    expect(range.endOffset).toBe(2)
    
    const noParent = root._nodeDocument.createElement('ele')
		expect(() => range.selectNode(noParent)).toThrow()
	})

	test('selectNodeContents()', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createTextNode('text')
		const node3 = root._nodeDocument.createElement('node3')
		const node4 = root._nodeDocument.createElement('node4')
		root.append(node1, node2, node3, node4)

		const range = new $$.Range()
		range.selectNodeContents(node2)
		expect(range.startContainer).toBe(node2)
		expect(range.endContainer).toBe(node2)
		expect(range.startOffset).toBe(0)
		expect(range.endOffset).toBe(4)
	})

	test('selectNodeContents() docType node', () => {
		const docType = $$.dom.createDocumentType('name', 'pub', 'sys')
		$$.dom.createDocument('ns', 'name', docType)

		const range = new $$.Range()
		expect(() => range.selectNodeContents(docType)).toThrow()
	})

	test('compareBoundaryPoints()', () => {
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
		expect(range1.compareBoundaryPoints(0, range2)).toBe(-1) // START_TO_START
		expect(range1.compareBoundaryPoints(1, range2)).toBe(1) // START_TO_END
		expect(range1.compareBoundaryPoints(2, range2)).toBe(-1) // END_TO_END
		expect(range1.compareBoundaryPoints(3, range2)).toBe(-1) // END_TO_START
		expect(range2.compareBoundaryPoints(0, range1)).toBe(1) // START_TO_START
		expect(range2.compareBoundaryPoints(1, range1)).toBe(1) // START_TO_END
		expect(range2.compareBoundaryPoints(2, range1)).toBe(1) // END_TO_END
		expect(range2.compareBoundaryPoints(3, range1)).toBe(-1) // END_TO_START

		expect(range1.compareBoundaryPoints(0, range1)).toBe(0)
	})

	test('compareBoundaryPoints() - invalid compare type', () => {
		const range1 = new $$.Range()
		const range2 = new $$.Range()
		expect(() => range1.compareBoundaryPoints(1234, range2)).toThrow()
	})

	test('compareBoundaryPoints() - different documents', () => {
		const doc1 = $$.dom.createDocument('ns1', 'name1')
		const range1 = new $$.Range()
		range1.setStart(doc1, 0)
		const doc2 = $$.dom.createDocument('ns2', 'name2')
		const range2 = new $$.Range()
		range2.setStart(doc2, 0)

		expect(() => range1.compareBoundaryPoints(0, range2)).toThrow()
	})

	test('deleteContents() in a single node', () => {
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
		expect(node2.textContent).toBe('next')

		range.setStart(node2, 1)
		range.setEnd(node2, 3)
		range.deleteContents()
		expect(node2.textContent).toBe('nt')

		range.setStart(root, 1)
		range.setEnd(root, 3)
		range.deleteContents()
		expect(root.childNodes.length).toBe(2)
		expect(root.childNodes.item(0)).toBe(node1)
		expect(root.childNodes.item(1)).toBe(node4)
	})

	test('deleteContents() across multiple text nodes', () => {
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
		expect(root.childNodes.length).toBe(4)
		expect(root.childNodes.item(0)).toBe(node1)
		expect((root.childNodes.item(1) as any).textContent).toBe('n')
		expect((root.childNodes.item(2) as any).textContent).toBe('v')
		expect(root.childNodes.item(3)).toBe(node5)
	})

	test('deleteContents() across multiple nodes', () => {
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
		expect(root.childNodes.length).toBe(2)
		expect(root.childNodes.item(0)).toBe(node1)
		expect(root.childNodes.item(1)).toBe(node5)
		expect(node1.childNodes.length).toBe(1)
		expect(node1.childNodes.item(0)).toBe(child1)
	})

	test('deleteContents() across multiple nested nodes', () => {
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
		expect(root.childNodes.length).toBe(2)
		expect(root.childNodes.item(0)).toBe(node1)
		expect(root.childNodes.item(1)).toBe(node5)
		expect(node1.childNodes.length).toBe(1)
		expect(node1.childNodes.item(0)).toBe(child1)
		expect(child1.childNodes.length).toBe(1)
		expect(child1.childNodes.item(0)).toBe(grandChild1)
	})

	test('cloneContents() in a single node', () => {
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
		expect(frag1.childNodes.length).toBe(0)

		range.setStart(node2, 1)
		range.setEnd(node2, 3)
		const frag2 = range.cloneContents()
		expect(frag2.childNodes.length).toBe(1)
		expect((frag2.childNodes.item(0) as any).textContent).toBe('ex')

		range.setStart(root, 1)
		range.setEnd(root, 3)
		const frag3 = range.cloneContents()
		expect(frag3.childNodes.length).toBe(2)
		expect((frag3.childNodes.item(0) as any).textContent).toBe('next')
		expect((frag3.childNodes.item(1) as any).localName).toBe('node3')
	})

	test('cloneContents() across multiple text nodes', () => {
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
		expect(frag.childNodes.length).toBe(3)
		expect((frag.childNodes.item(0) as any).textContent).toBe('ext') 
		expect((frag.childNodes.item(1) as any).localName).toBe('node3')
		expect((frag.childNodes.item(2) as any).textContent).toBe('pre') 
	})

	test('cloneContents() across multiple nodes', () => {
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
		expect(frag.childNodes.length).toBe(4)
		expect((frag.childNodes.item(0) as any).localName).toBe('node1') 
		expect((frag.childNodes.item(1) as any).textContent).toBe('next')
		expect((frag.childNodes.item(2) as any).localName).toBe('node3')
		expect((frag.childNodes.item(3) as any).textContent).toBe('prev')
		expect((frag.childNodes.item(0) as any).childNodes.length).toBe(1) 
		expect(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('child2')
	})

	test('cloneContents() across multiple nested nodes', () => {
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
		expect(frag.childNodes.length).toBe(4)
		expect((frag.childNodes.item(0) as any).localName).toBe('node1') 
		expect((frag.childNodes.item(1) as any).textContent).toBe('next')
		expect((frag.childNodes.item(2) as any).localName).toBe('node3')
		expect((frag.childNodes.item(3) as any).textContent).toBe('prev')
		expect((frag.childNodes.item(0) as any).childNodes.length).toBe(2) 
		expect(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('child1')
		expect(((frag.childNodes.item(0) as any).childNodes.item(1) as any).localName).toBe('child2')
		expect(((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.length).toBe(1)
		expect((((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('grandChild2')
	})

	test('range is updated when the tree is mutated', () => {
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
		expect(range.startOffset).toBe(1)
		expect(range.endOffset).toBe(2)
	})

	test('intersectsNode()', () => {
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
		expect(range.intersectsNode(root._nodeDocument)).toBe(true)
		expect(range.intersectsNode(node3)).toBe(true)
		expect(range.intersectsNode(node5)).toBe(false)

		range.setStart(root, 1)
		range.setEnd(root, 3)
		expect(range.intersectsNode(child2)).toBe(false) 
	})

	test('insertNode()', () => {
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

		expect(() => range.insertNode(root)).toThrow()
		const newNode = root._nodeDocument.createElement('new')
		range.insertNode(newNode)
		expect(range.startOffset).toBe(1)
		expect(range.endOffset).toBe(4)
		expect(root.childNodes.length).toBe(6)
	})

	test('isPointInRange() guards', () => {
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

		expect(range.isPointInRange(root2, 0)).toBe(false)
		expect(() => range.isPointInRange(docType, 0)).toThrow()
		expect(() => range.isPointInRange(node1, 20)).toThrow()
	})

	test('isPointInRange()', () => {
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

		expect(range.isPointInRange(node1, 0)).toBe(false)
		expect(range.isPointInRange(node5, 0)).toBe(false)
		expect(range.isPointInRange(node3, 0)).toBe(true)
	})

	test('comparePoint() guards', () => {
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

		expect(() => range.comparePoint(root2, 0)).toThrow()
		expect(() => range.comparePoint(docType, 0)).toThrow()
		expect(() => range.comparePoint(node1, 20)).toThrow()
	})

	test('comparePoint()', () => {
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

		expect(range.comparePoint(node1, 0)).toBe(-1)
		expect(range.comparePoint(node5, 0)).toBe(1)
		expect(range.comparePoint(node3, 0)).toBe(0)
	})

	test('cloneRange()', () => {
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
		expect(clone).not.toBe(range)
		expect(clone.startOffset).toBe(1)
		expect(clone.endOffset).toBe(3)
	})

	test('detach() - range is updated when the tree is mutated', () => {
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
		expect(range.startOffset).toBe(1)
		expect(range.endOffset).toBe(2)
	})

	test('detach() - range is no longer updated when the tree is mutated', () => {
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
		expect(range.startOffset).toBe(1)
		expect(range.endOffset).toBe(3)
	})

	test('stringify', () => {
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
		expect(range.toString()).toBe('xt ?  ! pre')
	})

	test('extractContents() in a single node', () => {
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
		expect(frag1.childNodes.length).toBe(0)

		range.setStart(node2, 1)
		range.setEnd(node2, 3)
		const frag2 = range.extractContents()
		expect(frag2.childNodes.length).toBe(1)
		expect((frag2.childNodes.item(0) as any).textContent).toBe('ex')
		expect(node2.textContent).toBe('nt')

		range.setStart(root, 1)
		range.setEnd(root, 3)
		const frag3 = range.extractContents()
		expect(frag3.childNodes.length).toBe(2)
		expect((frag3.childNodes.item(0) as any).textContent).toBe('nt')
		expect((frag3.childNodes.item(1) as any).localName).toBe('node3')
		expect((frag3.childNodes.item(1) as any).childNodes.length).toBe(2)
		expect(((frag3.childNodes.item(1) as any).childNodes.item(0) as any).localName).toBe('child1')
    expect(((frag3.childNodes.item(1) as any).childNodes.item(1) as any).localName).toBe('child2')
    
		expect(root.childNodes.length).toBe(2)
		expect((root.childNodes.item(0) as any).localName).toBe('node1')
		expect((root.childNodes.item(1) as any).localName).toBe('node4')
	})

	test('extractContents() across multiple text nodes', () => {
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
		expect(frag.childNodes.length).toBe(3)
		expect((frag.childNodes.item(0) as any).textContent).toBe('ext') 
		expect((frag.childNodes.item(1) as any).localName).toBe('node3')
    expect((frag.childNodes.item(2) as any).textContent).toBe('pre')

		expect(root.childNodes.length).toBe(4)
		expect((root.childNodes.item(0) as any).localName).toBe('node1')
		expect((root.childNodes.item(1) as any).textContent).toBe('n')
		expect((root.childNodes.item(2) as any).textContent).toBe('v')
		expect((root.childNodes.item(3) as any).localName).toBe('node5')
	})

	test('extractContents() across multiple nodes', () => {
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
		expect(frag.childNodes.length).toBe(4)
		expect((frag.childNodes.item(0) as any).localName).toBe('node1') 
		expect((frag.childNodes.item(1) as any).textContent).toBe('next')
		expect((frag.childNodes.item(2) as any).localName).toBe('node3')
		expect((frag.childNodes.item(3) as any).textContent).toBe('prev')
		expect((frag.childNodes.item(0) as any).childNodes.length).toBe(1) 
    expect(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('child2')

		expect(root.childNodes.length).toBe(2)
		expect((root.childNodes.item(0) as any).localName).toBe('node1')
		expect((root.childNodes.item(1) as any).localName).toBe('node5')
		expect((root.childNodes.item(0) as any).childNodes.length).toBe(1)
		expect(((root.childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('child1')
  })

	test('extractContents() across multiple nested nodes', () => {
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
		expect(frag.childNodes.length).toBe(4)
		expect((frag.childNodes.item(0) as any).localName).toBe('node1') 
		expect((frag.childNodes.item(1) as any).textContent).toBe('next')
		expect((frag.childNodes.item(2) as any).localName).toBe('node3')
		expect((frag.childNodes.item(3) as any).textContent).toBe('prev')
		expect((frag.childNodes.item(0) as any).childNodes.length).toBe(2) 
		expect(((frag.childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('child1')
		expect(((frag.childNodes.item(0) as any).childNodes.item(1) as any).localName).toBe('child2')
		expect(((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.length).toBe(1)
    expect((((frag.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('grandChild2')
    
		expect(root.childNodes.length).toBe(2)
		expect((root.childNodes.item(0) as any).localName).toBe('node1')
		expect((root.childNodes.item(1) as any).localName).toBe('node5')
		expect((root.childNodes.item(0) as any).childNodes.length).toBe(1)
		expect(((root.childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('child1')
		expect(((root.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.length).toBe(1)
		expect((((root.childNodes.item(0) as any).childNodes.item(0) as any).childNodes.item(0) as any).localName).toBe('grandChild1')
  })
  
	test('surroundContents() guards', () => {
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
    expect(() => range.surroundContents(newParent)).toThrow()

    range.setStart(root, 1)
    range.setEnd(root, 3)
    expect(() => range.surroundContents(doc)).toThrow()
    expect(() => range.surroundContents(docType)).toThrow()
    expect(() => range.surroundContents(frag)).toThrow()
  })

	test('surroundContents()', () => {
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

		expect(root.childNodes.length).toBe(3)
    expect((root.childNodes.item(0) as any).localName).toBe('node1')
    expect((root.childNodes.item(1) as any).localName).toBe('parent')
    expect((root.childNodes.item(2) as any).localName).toBe('node4')
    expect((root.childNodes.item(1) as any).childNodes.length).toBe(2)
    expect(((root.childNodes.item(1) as any).childNodes.item(0) as any).localName).toBe('node2')
    expect(((root.childNodes.item(1) as any).childNodes.item(1) as any).localName).toBe('node3')
  })
  
	test('surroundContents() splits text node', () => {
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

		expect(root.childNodes.length).toBe(5)
    expect((root.childNodes.item(0) as any).localName).toBe('node1')
    expect((root.childNodes.item(1) as any).textContent).toBe('ne')
    expect((root.childNodes.item(2) as any).localName).toBe('parent')
    expect((root.childNodes.item(3) as any).textContent).toBe('ev')
    expect((root.childNodes.item(4) as any).localName).toBe('node5')
    expect((root.childNodes.item(2) as any).childNodes.length).toBe(3)
    expect(((root.childNodes.item(2) as any).childNodes.item(0) as any).textContent).toBe('xt')
    expect(((root.childNodes.item(2) as any).childNodes.item(1) as any).localName).toBe('node3')
    expect(((root.childNodes.item(2) as any).childNodes.item(2) as any).textContent).toBe('pr')
  })

	test('surroundContents() new parent with child nodes', () => {
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

		expect(root.childNodes.length).toBe(3)
    expect((root.childNodes.item(0) as any).localName).toBe('node1')
    expect((root.childNodes.item(1) as any).localName).toBe('parent')
    expect((root.childNodes.item(2) as any).localName).toBe('node4')
    expect((root.childNodes.item(1) as any).childNodes.length).toBe(2)
    expect(((root.childNodes.item(1) as any).childNodes.item(0) as any).localName).toBe('node2')
    expect(((root.childNodes.item(1) as any).childNodes.item(1) as any).localName).toBe('node3')
  })

  test('constants', () => {
		const range = new $$.Range()
    expect(range.START_TO_END).toBe(1)
    expect($$.Range.START_TO_END).toBe(1)
  })

})
