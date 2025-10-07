import $$ from "../TestHelpers"
import { MutationRecord } from "../../src/dom/interfaces"


$$.suite('MutationObserver', () => {

	$$.test('childList - append', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'childList') {
					$$.deepEqual(mutation.target, root)
					$$.deepEqual([...mutation.addedNodes], [node4])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, node3)
					$$.deepEqual(mutation.nextSibling, null)
				}
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

	$$.test('childList - remove', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'childList') {
					$$.deepEqual(mutation.target, root)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [node2])
					$$.deepEqual(mutation.previousSibling, node1)
					$$.deepEqual(mutation.nextSibling, node3)
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(root, { childList: true })
    root.removeChild(node2)
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
	})

	$$.test('childList - replace', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'childList') {
					$$.deepEqual(mutation.target, root)
					$$.deepEqual([...mutation.addedNodes], [node4])
					$$.deepEqual([...mutation.removedNodes], [node2])
					$$.deepEqual(mutation.previousSibling, node1)
					$$.deepEqual(mutation.nextSibling, node3)
				}
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

	$$.test('childList - replace', () => {
		const root = $$.newDoc
		const node1 = root._nodeDocument.createElement('node1')
		const node2 = root._nodeDocument.createElement('node2')
		const node3 = root._nodeDocument.createElement('node3')
		root.append(node1, node2, node3)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'childList') {
					$$.deepEqual(mutation.target, root)
					$$.deepEqual([...mutation.addedNodes], [node4])
					$$.deepEqual([...mutation.removedNodes], [node2])
					$$.deepEqual(mutation.previousSibling, node1)
					$$.deepEqual(mutation.nextSibling, node3)
				}
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

	$$.test('characterData', () => {
		const root = $$.newDoc
		const text = root._nodeDocument.createTextNode('abc')
		root.append(text)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'characterData') {
					$$.deepEqual(mutation.target, text)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.oldValue, null)
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(text as any, { characterData: true })
    text.textContent = 'def'
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('characterData - observe old value', () => {
		const root = $$.newDoc
		const text = root._nodeDocument.createTextNode('abc')
		root.append(text)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'characterData') {
					$$.deepEqual(mutation.target, text)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.oldValue, 'abc')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(text as any, { characterData: true, characterDataOldValue: true })
    text.textContent = 'def'
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('attributes', () => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
    root.append(node)
    node.setAttributeNS('ns', 'att', 'val')

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'attributes') {
					$$.deepEqual(mutation.target, node)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.oldValue, null)
					$$.deepEqual(mutation.attributeNamespace, 'ns')
					$$.deepEqual(mutation.attributeName, 'att')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(node as any, { attributes: true })
    node.setAttributeNS('ns', 'att', 'new val')
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('attributes - observe old value', () => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
    root.append(node)
    node.setAttributeNS('ns', 'att', 'val')

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'attributes') {
					$$.deepEqual(mutation.target, node)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.attributeNamespace, 'ns')
					$$.deepEqual(mutation.attributeName, 'att')
					$$.deepEqual(mutation.oldValue, 'val')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(node as any, { attributes: true, attributeOldValue: true })
    node.setAttributeNS('ns', 'att', 'new val')
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('attributes- filter', () => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
    root.append(node)
    node.setAttributeNS('ns', 'att', 'val')
    node.setAttributeNS('ns', 'att2', 'val')

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'attributes') {
					$$.deepEqual(mutation.target, node)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.oldValue, null)
					$$.deepEqual(mutation.attributeNamespace, 'ns')
					$$.deepEqual(mutation.attributeName, 'att')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(node as any, { attributes: true, attributeFilter: ["att"] })
    node.setAttributeNS('ns', 'att', 'new val')
    node.setAttributeNS('ns', 'att2', 'new val')
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('subtree', () => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
		const text = root._nodeDocument.createTextNode('abc')
		root.append(node)
		node.append(text)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'characterData') {
					$$.deepEqual(mutation.target, text)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.oldValue, 'abc')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(root, { characterData: true, characterDataOldValue: true, subtree: true })
    text.textContent = 'def'
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('observe() - invalid options', () => {
		const root = $$.newDoc

    const observer = new $$.MutationObserver((mutations) => { })

		$$.throws(() => observer.observe(root))
		$$.throws(() => observer.observe(root, { characterDataOldValue: true, characterData: false, childList: true }))
		$$.throws(() => observer.observe(root, { attributeOldValue: true, attributes: false, childList: true }))
		$$.throws(() => observer.observe(root, { attributeFilter: ["match"], attributes: false, childList: true }))
  })

	$$.test('observe() - options without characterData', () => {
		const root = $$.newDoc
		const text = root._nodeDocument.createTextNode('abc')
		root.append(text)

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'characterData') {
					$$.deepEqual(mutation.target, text)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.oldValue, 'abc')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(text as any, { characterDataOldValue: true })
    text.textContent = 'def'
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('observe() - options without attributes', () => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
    root.append(node)
    node.setAttributeNS('ns', 'att', 'val')

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'attributes') {
					$$.deepEqual(mutation.target, node)
					$$.deepEqual([...mutation.addedNodes], [])
					$$.deepEqual([...mutation.removedNodes], [])
					$$.deepEqual(mutation.previousSibling, null)
					$$.deepEqual(mutation.nextSibling, null)
					$$.deepEqual(mutation.attributeNamespace, 'ns')
					$$.deepEqual(mutation.attributeName, 'att')
					$$.deepEqual(mutation.oldValue, 'val')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(node as any, { attributeOldValue: true })
    node.setAttributeNS('ns', 'att', 'new val')
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
  })

	$$.test('observe() - multiple calls with different types', () => {
		const root = $$.newDoc
		const node = root._nodeDocument.createElement('node')
    root.append(node)
    node.setAttributeNS('ns', 'att', 'val')

		const callback = (mutations: MutationRecord[]) => {
			for (let mutation of mutations) {
				if (mutation.type === 'attributes') {
					$$.deepEqual(mutation.attributeName, 'att')
				}
			}
		}
    const observer = new $$.MutationObserver(callback)

    // observe child nodes first
    observer.observe(node as any, { childList: true })
    node.appendChild(root._nodeDocument.createElement('child'))

    // attach another observer
    const observer2 = new $$.MutationObserver((mutations) => { })
    observer2.observe(node as any, { childList: true })
    node.appendChild(root._nodeDocument.createElement('child'))

    // replace the observer
		observer.observe(node as any, { attributes: true })
    node.setAttributeNS('ns', 'att', 'new val')
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()
    observer2.disconnect()
  })

})
