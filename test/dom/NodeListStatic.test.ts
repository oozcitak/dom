import $$ from "../TestHelpers"
import { MutationRecord, NodeList } from "../../src/dom/interfaces"

$$.suite('NodeListStatic', () => {

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


  $$.test('length', () => {
    if (list === undefined) throw new Error("List is undefined")
    $$.deepEqual(list.length, 5)
  })

  $$.test('item()', () => {
    if (list === undefined) throw new Error("List is undefined")
    $$.deepEqual(list.item(0), ele1)
    $$.deepEqual(list.item(1), ele2)
    $$.deepEqual(list.item(2), ele3)
    $$.deepEqual(list.item(3), ele4)
    $$.deepEqual(list.item(4), ele5)
    $$.deepEqual(list.item(-1), null)
    $$.deepEqual(list.item(1001), null)
  })

  $$.test('indexed getter', () => {
    if (list === undefined) throw new Error("List is undefined")
    $$.deepEqual(list[0], ele1)
    $$.deepEqual(list[1], ele2)
    $$.deepEqual(list[2], ele3)
    $$.deepEqual(list[3], ele4)
    $$.deepEqual(list[4], ele5)
    $$.deepEqual(list[-1], undefined)
    $$.deepEqual(list[1001], undefined)
  })

  $$.test('indexed setter', () => {
    if (list === undefined) throw new Error("List is undefined")
    const newEle = root._nodeDocument.createElement('tagX')
    list[2] = newEle
    $$.deepEqual(list[0], ele1)
    $$.deepEqual(list[1], ele2)
    $$.deepEqual(list[2], newEle)
    $$.deepEqual(list[3], ele4)
    $$.deepEqual(list[4], ele5)
    $$.deepEqual(list[-1], undefined)
    $$.deepEqual(list[1001], undefined)
    list[2] = ele3
  })

  $$.test('keys()', () => {
    if (list === undefined) throw new Error("List is undefined")
    $$.deepEqual([...list.keys()], [0, 1, 2, 3, 4])
  })

  $$.test('values()', () => {
    if (list === undefined) throw new Error("List is undefined")
    $$.deepEqual([...list.values()], [ele1, ele2, ele3, ele4, ele5])
  })

  $$.test('entries()', () => {
    if (list === undefined) throw new Error("List is undefined")
    $$.deepEqual([...list.entries()], [[0, ele1], [1, ele2], [2, ele3], [3, ele4], [4, ele5]])
  })

  $$.test('iteration()', () => {
    if (list === undefined) throw new Error("List is undefined")
    let arr = []
    for (const ele of list) {
      arr.push(ele)
    }
    $$.deepEqual(arr, [ele1, ele2, ele3, ele4, ele5])
  })

  $$.test('forEach()', () => {
    if (list === undefined) throw new Error("List is undefined")
    let arr: Array<[number, any]> = []
    list.forEach((node, index) => {
      arr.push([index, node])
    })
    $$.deepEqual(arr, [[0, ele1], [1, ele2], [2, ele3], [3, ele4], [4, ele5]])
  })

})