import $$ from '../TestHelpers'

describe('StaticRange', () => {

  test('constructor', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const child1 = root._nodeDocument.createElement('child1')
		const child2 = root._nodeDocument.createElement('child2')
		root.append(node1, node2)
		node1.append(child1, child2)

    const range = new $$.StaticRange({ startContainer: node1, startOffset: 1, endContainer: node2, endOffset: 0 })
		expect(range.startContainer).toBe(node1)
		expect(range.startOffset).toBe(1)
		expect(range.endContainer).toBe(node2)
		expect(range.endOffset).toBe(0)
  })

})