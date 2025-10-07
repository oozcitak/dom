import $$ from "../TestHelpers"
import { MutationRecord } from "../../src/dom/interfaces"
import { dom } from "../../src/dom"

$$.suite('CharacterData', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node1 = doc.createTextNode('data')
  const node2 = doc.createTextNode('data')
  doc.documentElement.appendChild(node1)
  doc.documentElement.appendChild(node2)

  $$.test('constructor()', () => {
    $$.deepEqual(node1.data, 'data')
  })

  $$.test('isEqualNode()', () => {
    $$.deepEqual(node1.isEqualNode(node2), true)
    $$.deepEqual(node1.isEqualNode(), false)
  })

  $$.test('nodeValue, textContent, data', () => {
    $$.deepEqual(node1.nodeValue, 'data')
    $$.deepEqual(node1.textContent, 'data')
    $$.deepEqual(node1.data, 'data')
    node1.nodeValue = 'new data'
    $$.deepEqual(node1.nodeValue, 'new data')
    $$.deepEqual(node1.textContent, 'new data')
    $$.deepEqual(node1.data, 'new data')
    node1.textContent = 'other data'
    $$.deepEqual(node1.nodeValue, 'other data')
    $$.deepEqual(node1.textContent, 'other data')
    $$.deepEqual(node1.data, 'other data')
    node1.data = 'old data'
    $$.deepEqual(node1.nodeValue, 'old data')
    $$.deepEqual(node1.textContent, 'old data')
    $$.deepEqual(node1.data, 'old data')
    // assign null
    node1.nodeValue = null
    $$.deepEqual(node1.data, '')
    node1.data = 'data'
    node1.textContent = null
    $$.deepEqual(node1.data, '')
    node1.data = 'data'
  })

  $$.test('length', () => {
    $$.deepEqual(node1.length, 4)
  })

  $$.test('appendData', () => {
    node1.appendData(' or data')
    $$.deepEqual(node1.data, 'data or data')
    node1.data = 'data'
  })

  $$.test('insertData', () => {
    node1.insertData(2, 'da')
    $$.deepEqual(node1.data, 'dadata')
    node1.data = 'data'
  })

  $$.test('deleteData', () => {
    node1.data = 'a long night'
    node1.deleteData(2, 5)
    $$.deepEqual(node1.data, 'a night')
    $$.throws(() => node1.deleteData(20, 1))
    node1.deleteData(1, 60)
    $$.deepEqual(node1.data, 'a')
    node1.data = 'data'
  })

  $$.test('deleteData updates live range', () => {
    const range = new $$.Range()

    node1.data = 'aaxxxaa'
    range.setStart(node1, 1)
    range.setEnd(node1, 4)
    node1.deleteData(2, 3)
    $$.deepEqual(node1.data, 'aaaa')
    $$.deepEqual(range.startOffset, 1)
    $$.deepEqual(range.endOffset, 2)

    node1.data = 'aaxxxaa'
    range.setStart(node1, 3)
    range.setEnd(node1, 6)
    node1.deleteData(2, 3)
    $$.deepEqual(node1.data, 'aaaa')
    $$.deepEqual(range.startOffset, 2)
    $$.deepEqual(range.endOffset, 3)

    node1.data = 'aaxxxaa'
    range.setStart(node1, 6)
    range.setEnd(node1, 7)
    node1.deleteData(2, 3)
    $$.deepEqual(node1.data, 'aaaa')
    $$.deepEqual(range.startOffset, 3)
    $$.deepEqual(range.endOffset, 4)

    node1.data = 'data'
  })

  $$.test('replaceData', () => {
    node1.data = 'a long night'
    node1.replaceData(2, 4, 'starry')
    $$.deepEqual(node1.data, 'a starry night')
    node1.data = 'data'
  })

  $$.test('substringData', () => {
    node1.data = 'a long night'
    $$.deepEqual(node1.substringData(2, 4), 'long')
    $$.throws(() => node1.substringData(20, 4))
    $$.deepEqual(node1.substringData(2, 40), 'long night')
    node1.data = 'data'
  })

  $$.test('mutation observer', () => {
    node1.data = 'a long night'

		const callback = (mutations: MutationRecord[]) => {
      for (let mutation of mutations) {
        if (mutation.type === 'characterData') {
          $$.deepEqual(mutation.target, node1)
          $$.deepEqual([...mutation.addedNodes], [])
          $$.deepEqual([...mutation.removedNodes], [])
          $$.deepEqual(mutation.previousSibling, null)
          $$.deepEqual(mutation.nextSibling, null)
          $$.deepEqual(mutation.oldValue, 'a long night')
        }
			}
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(node1, { characterData: true, characterDataOldValue: true })
    node1.deleteData(2, 5)
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()

    node1.data = 'data'
  })

  $$.test('mutation observer without setting', () => {
    node1.data = 'a long night'

    let fired = false
		const callback = (mutations: MutationRecord[]) => {
      for (let mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target === node1) {
          fired = true
        }
      }
		}
    const observer = new $$.MutationObserver(callback)

		observer.observe(node1, { characterData: true, characterDataOldValue: true })
    dom.setFeatures(false)
    node1.deleteData(2, 5)
    dom.setFeatures(true)
    const records = observer.takeRecords()
    if (records) callback(records)
    observer.disconnect()

    node1.data = 'data'

    $$.deepEqual(fired, false)
  })

})