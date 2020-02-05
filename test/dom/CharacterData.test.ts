import $$ from "../TestHelpers"
import { MutationRecord } from "../../src/dom/interfaces"
import { dom } from "../../src/dom"

describe('CharacterData', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const node1 = doc.createTextNode('data')
  const node2 = doc.createTextNode('data')
  doc.documentElement.appendChild(node1)
  doc.documentElement.appendChild(node2)

  test('constructor()', () => {
    expect(node1.data).toBe('data')
  })

  test('isEqualNode()', () => {
    expect(node1.isEqualNode(node2)).toBe(true)
    expect(node1.isEqualNode()).toBe(false)
  })

  test('nodeValue, textContent, data', () => {
    expect(node1.nodeValue).toBe('data')
    expect(node1.textContent).toBe('data')
    expect(node1.data).toBe('data')
    node1.nodeValue = 'new data'
    expect(node1.nodeValue).toBe('new data')
    expect(node1.textContent).toBe('new data')
    expect(node1.data).toBe('new data')
    node1.textContent = 'other data'
    expect(node1.nodeValue).toBe('other data')
    expect(node1.textContent).toBe('other data')
    expect(node1.data).toBe('other data')
    node1.data = 'old data'
    expect(node1.nodeValue).toBe('old data')
    expect(node1.textContent).toBe('old data')
    expect(node1.data).toBe('old data')
    // assign null
    node1.nodeValue = null
    expect(node1.data).toBe('')
    node1.data = 'data'
    node1.textContent = null
    expect(node1.data).toBe('')
    node1.data = 'data'
  })

  test('length', () => {
    expect(node1.length).toBe(4)
  })

  test('appendData', () => {
    node1.appendData(' or data')
    expect(node1.data).toBe('data or data')
    node1.data = 'data'
  })

  test('insertData', () => {
    node1.insertData(2, 'da')
    expect(node1.data).toBe('dadata')
    node1.data = 'data'
  })

  test('deleteData', () => {
    node1.data = 'a long night'
    node1.deleteData(2, 5)
    expect(node1.data).toBe('a night')
    expect(() => node1.deleteData(20, 1)).toThrow()
    node1.deleteData(1, 60)
    expect(node1.data).toBe('a')
    node1.data = 'data'
  })

  test('deleteData updates live range', () => {
    const range = new $$.Range()

    node1.data = 'aaxxxaa'
    range.setStart(node1, 1)
    range.setEnd(node1, 4)
    node1.deleteData(2, 3)
    expect(node1.data).toBe('aaaa')
    expect(range.startOffset).toBe(1)
    expect(range.endOffset).toBe(2)

    node1.data = 'aaxxxaa'
    range.setStart(node1, 3)
    range.setEnd(node1, 6)
    node1.deleteData(2, 3)
    expect(node1.data).toBe('aaaa')
    expect(range.startOffset).toBe(2)
    expect(range.endOffset).toBe(3)

    node1.data = 'aaxxxaa'
    range.setStart(node1, 6)
    range.setEnd(node1, 7)
    node1.deleteData(2, 3)
    expect(node1.data).toBe('aaaa')
    expect(range.startOffset).toBe(3)
    expect(range.endOffset).toBe(4)

    node1.data = 'data'
  })

  test('replaceData', () => {
    node1.data = 'a long night'
    node1.replaceData(2, 4, 'starry')
    expect(node1.data).toBe('a starry night')
    node1.data = 'data'
  })

  test('substringData', () => {
    node1.data = 'a long night'
    expect(node1.substringData(2, 4)).toBe('long')
    expect(() => node1.substringData(20, 4)).toThrow()
    expect(node1.substringData(2, 40)).toBe('long night')
    node1.data = 'data'
  })

  test('mutation observer', (done) => {
    node1.data = 'a long night'

		const callback = (mutations: MutationRecord[]) => {
			try {
        for (let mutation of mutations) {
  				if (mutation.type === 'characterData') {
	  				expect(mutation.target).toBe(node1)
		  			expect([...mutation.addedNodes]).toEqual([])
			  		expect([...mutation.removedNodes]).toEqual([])
				  	expect(mutation.previousSibling).toBeNull()
					  expect(mutation.nextSibling).toBeNull()
					  expect(mutation.oldValue).toBe('a long night')
					  done()
				  }
        }
				done()
			} catch (e) {
				done(e)
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

  test('mutation observer without setting', (done) => {
    node1.data = 'a long night'

    let fired = false
		const callback = (mutations: MutationRecord[]) => {
      for (let mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target === node1) {
          fired = true
        }
      }
      done()
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

    expect(fired).toBe(false)
  })

})