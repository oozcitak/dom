import $$ from './TestHelpers'
import { MutationRecord } from '../../src/dom/interfaces'


describe('MutationObserver', () => {

	test('childList - append', (done) => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
			try {
		  	for (let mutation of mutations) {
			    if (mutation.type === 'childList') {
				    expect(mutation.target).toBe(root)
					  expect([...mutation.addedNodes]).toEqual([node4])
					  expect([...mutation.removedNodes]).toEqual([])
					  expect(mutation.previousSibling).toBe(node3)
					  expect(mutation.nextSibling).toBeNull()
			    }
				}
				done()
			} catch (e) {
				done(e)
			}
    }
    const observer = new $$.MutationObserver(callback)    

		observer.observe(root, { childList: true })
		const node4 = root._nodeDocument.createElement('node4')
    root.appendChild(node4)
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
	})

	test('childList - remove', (done) => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
			try {
        for (let mutation of mutations) {
  				if (mutation.type === 'childList') {
	  				expect(mutation.target).toBe(root)
		  			expect([...mutation.addedNodes]).toEqual([])
			  		expect([...mutation.removedNodes]).toEqual([node2])
				  	expect(mutation.previousSibling).toBe(node1)
					  expect(mutation.nextSibling).toBe(node3)
					  done()
				  }
        }
				done()
			} catch (e) {
				done(e)
			}        
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(root, { childList: true })
    root.removeChild(node2)
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
	})

	test('childList - replace', (done) => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
      try {
			  for (let mutation of mutations) {
				  if (mutation.type === 'childList') {
					  expect(mutation.target).toBe(root)
					  expect([...mutation.addedNodes]).toEqual([node4])
					  expect([...mutation.removedNodes]).toEqual([node2])
					  expect(mutation.previousSibling).toBe(node1)
					  expect(mutation.nextSibling).toBe(node3)
					  done()
				  }
        }
				done()
			} catch (e) {
				done(e)
			}        
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(root, { childList: true })
		const node4 = root._nodeDocument.createElement('node4')
    root.replaceChild(node4, node2)
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
   })

	test('childList - replace', (done) => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
      try {
			  for (let mutation of mutations) {
				  if (mutation.type === 'childList') {
					  expect(mutation.target).toBe(root)
					  expect([...mutation.addedNodes]).toEqual([node4])
					  expect([...mutation.removedNodes]).toEqual([node2])
					  expect(mutation.previousSibling).toBe(node1)
					  expect(mutation.nextSibling).toBe(node3)
					  done()
				  }
        }
				done()
			} catch (e) {
				done(e)
			}        
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(root, { childList: true })
		const node4 = root._nodeDocument.createElement('node4')
    root.replaceChild(node4, node2)
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	test('characterData', (done) => {
		const root = $$.newDoc
		const text = root._nodeDocument.createTextNode('abc')
		root.append(text)

		const callback = (mutations: MutationRecord[]) => {
			try {
		  	for (let mutation of mutations) {
			    if (mutation.type === 'characterData') {
				    expect(mutation.target).toBe(text)
					  expect([...mutation.addedNodes]).toEqual([])
					  expect([...mutation.removedNodes]).toEqual([])
					  expect(mutation.previousSibling).toBeNull()
					  expect(mutation.nextSibling).toBeNull()
					  expect(mutation.oldValue).toBeNull()
			    }
				}
				done()
			} catch (e) {
				done(e)
			}
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(text as any, { characterData: true })
    text.textContent = 'def'
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })
  
	test('characterData - observe old value', (done) => {
		const root = $$.newDoc
		const text = root._nodeDocument.createTextNode('abc')
		root.append(text)

		const callback = (mutations: MutationRecord[]) => {
			try {
		  	for (let mutation of mutations) {
			    if (mutation.type === 'characterData') {
				    expect(mutation.target).toBe(text)
					  expect([...mutation.addedNodes]).toEqual([])
					  expect([...mutation.removedNodes]).toEqual([])
					  expect(mutation.previousSibling).toBeNull()
					  expect(mutation.nextSibling).toBeNull()
					  expect(mutation.oldValue).toBe('abc')
			    }
				}
				done()
			} catch (e) {
				done(e)
			}
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(text as any, { characterData: true, characterDataOldValue: true })
    text.textContent = 'def'
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	test('attributes', (done) => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
    root.append(node)
    node.setAttributeNS('ns', 'att', 'val')

		const callback = (mutations: MutationRecord[]) => {
			try {
		  	for (let mutation of mutations) {
			    if (mutation.type === 'attributes') {
				    expect(mutation.target).toBe(node)
					  expect([...mutation.addedNodes]).toEqual([])
					  expect([...mutation.removedNodes]).toEqual([])
					  expect(mutation.previousSibling).toBeNull()
					  expect(mutation.nextSibling).toBeNull()
					  expect(mutation.oldValue).toBeNull()
					  expect(mutation.attributeNamespace).toBe('ns')
					  expect(mutation.attributeName).toBe('att')
			    }
				}
				done()
			} catch (e) {
				done(e)
			}
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(node as any, { attributes: true })
    node.setAttributeNS('ns', 'att', 'new val')
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	test('attributes - observe old value', (done) => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
    root.append(node)
    node.setAttributeNS('ns', 'att', 'val')

		const callback = (mutations: MutationRecord[]) => {
			try {
		  	for (let mutation of mutations) {
			    if (mutation.type === 'attributes') {
				    expect(mutation.target).toBe(node)
					  expect([...mutation.addedNodes]).toEqual([])
					  expect([...mutation.removedNodes]).toEqual([])
					  expect(mutation.previousSibling).toBeNull()
					  expect(mutation.nextSibling).toBeNull()
					  expect(mutation.attributeNamespace).toBe('ns')
					  expect(mutation.attributeName).toBe('att')
					  expect(mutation.oldValue).toBe('val')
			    }
				}
				done()
			} catch (e) {
				done(e)
			}
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(node as any, { attributes: true, attributeOldValue: true })
    node.setAttributeNS('ns', 'att', 'new val')
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	test('subtree', (done) => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
		const text = root._nodeDocument.createTextNode('abc')
		root.append(node)
		node.append(text)

		const callback = (mutations: MutationRecord[]) => {
			try {
		  	for (let mutation of mutations) {
			    if (mutation.type === 'characterData') {
				    expect(mutation.target).toBe(text)
					  expect([...mutation.addedNodes]).toEqual([])
					  expect([...mutation.removedNodes]).toEqual([])
					  expect(mutation.previousSibling).toBeNull()
					  expect(mutation.nextSibling).toBeNull()
					  expect(mutation.oldValue).toBe('abc')
			    }
				}
				done()
			} catch (e) {
				done(e)
			}
		}
    const observer = new $$.MutationObserver(callback)    

		observer.observe(root, { characterData: true, characterDataOldValue: true, subtree: true })
    text.textContent = 'def'
    const records = observer.takeRecords()
    if (records) callback(records)    
    observer.disconnect()
  })

})
