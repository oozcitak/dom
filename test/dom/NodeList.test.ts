import $$ from "../TestHelpers"

describe('NodeList', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const ele1 = doc.createElement('tag1')
  const ele2 = doc.createElement('tag2')
  const ele3 = doc.createElement('tag3')
  const ele4 = doc.createElement('tag4')
  const ele5 = doc.createElement('tag5')

  doc.documentElement.appendChild(ele1)
  doc.documentElement.appendChild(ele2)
  doc.documentElement.appendChild(ele3)
  doc.documentElement.appendChild(ele4)
  doc.documentElement.appendChild(ele5)

  const list = doc.documentElement.childNodes

  test('length', () => {
    expect(list.length).toBe(5)
  })

  test('item()', () => {
    expect(list.item(0)).toBe(ele1)
    expect(list.item(1)).toBe(ele2)
    expect(list.item(2)).toBe(ele3)
    expect(list.item(3)).toBe(ele4)
    expect(list.item(4)).toBe(ele5)
    expect(list.item(-1)).toBeNull()
    expect(list.item(1001)).toBeNull()
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