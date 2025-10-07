import $$ from "../TestHelpers"

$$.suite('StaticRange', () => {

  $$.test('constructor', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		root.append(node1, node2)
		node1.append(child1, child2)

    const range = new $$.StaticRange({ startContainer: node1, startOffset: 1, endContainer: node2, endOffset: 0 })
		$$.deepEqual(range.startContainer, node1)
		$$.deepEqual(range.startOffset, 1)
		$$.deepEqual(range.endContainer, node2)
		$$.deepEqual(range.endOffset, 0)

		const attrNode = root._nodeDocument.createAttribute('att')
		node1.attributes.setNamedItem(attrNode)
		$$.throws(() => new $$.StaticRange({ startContainer: attrNode, startOffset: 0, endContainer: attrNode, endOffset: 1 }))
  })

})