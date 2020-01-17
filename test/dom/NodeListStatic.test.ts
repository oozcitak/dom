import $$ from "../TestHelpers"
import { MutationRecord, NodeList } from "../../src/dom/interfaces"

describe('NodeListStatic', () => {

  const root = $$.newDoc

  let list: NodeList | undefined = undefined

  const callback = (mutations: MutationRecord[]) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        list = mutation.addedNodes
      }
    }
  }
  const observer = new $$.MutationObserver(callback)    

  observer.observe(root, { childList: true })
  const ele1 = root._nodeDocument.createElement('node1')
  const ele2 = root._nodeDocument.createElement('node2')
  const ele3 = root._nodeDocument.createElement('node3')
  const ele4 = root._nodeDocument.createElement('node4')
  const ele5 = root._nodeDocument.createElement('node5')
  root.append(ele1, ele2, ele3, ele4, ele5)
  const records = observer.takeRecords()
  if (records) callback(records)
  observer.disconnect()


  test('length', () => {
    if (list === undefined) throw new Error("List is undefined")
    expect(list.length).toBe(5)
  })

  test('item()', () => {
    if (list === undefined) throw new Error("List is undefined")
    expect(list.item(0)).toBe(ele1)
    expect(list.item(1)).toBe(ele2)
    expect(list.item(2)).toBe(ele3)
    expect(list.item(3)).toBe(ele4)
    expect(list.item(4)).toBe(ele5)
    expect(list.item(-1)).toBeNull()
    expect(list.item(1001)).toBeNull()
  })

  test('index', () => {
    if (list === undefined) throw new Error("List is undefined")
    expect(list[0]).toBe(ele1)
    expect(list[1]).toBe(ele2)
    expect(list[2]).toBe(ele3)
    expect(list[3]).toBe(ele4)
    expect(list[4]).toBe(ele5)
    expect(list[-1]).toBeUndefined()
    expect(list[1001]).toBeUndefined()
  })
  
  test('keys()', () => {
    if (list === undefined) throw new Error("List is undefined")
    expect([...list.keys()]).toEqual([0, 1, 2, 3, 4])
  })

  test('values()', () => {
    if (list === undefined) throw new Error("List is undefined")
    expect([...list.values()]).toEqual([ele1, ele2, ele3, ele4, ele5])
  })

  test('entries()', () => {
    if (list === undefined) throw new Error("List is undefined")
    expect([...list.entries()]).toEqual([[0, ele1], [1, ele2], [2, ele3], [3, ele4], [4, ele5]])
  })

  test('iteration()', () => {
    if (list === undefined) throw new Error("List is undefined")
    let arr = []
    for (const ele of list) {
      arr.push(ele)
    }
    expect(arr).toEqual([ele1, ele2, ele3, ele4, ele5])
  })

  test('forEach()', () => {
    if (list === undefined) throw new Error("List is undefined")
    let arr: Array<[number, any]> = []
    list.forEach((node, index) => {
      arr.push([index, node])
    })
    expect(arr).toEqual([[0, ele1], [1, ele2], [2, ele3], [3, ele4], [4, ele5]])
  })

})