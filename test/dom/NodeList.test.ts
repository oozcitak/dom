import $$ from "../TestHelpers"

$$.suite('NodeList', () => {

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

  $$.test('length', () => {
    $$.deepEqual(list.length, 5)
  })

  $$.test('item()', () => {
    $$.deepEqual(list.item(0), ele1)
    $$.deepEqual(list.item(1), ele2)
    $$.deepEqual(list.item(2), ele3)
    $$.deepEqual(list.item(3), ele4)
    $$.deepEqual(list.item(4), ele5)
    $$.deepEqual(list.item(-1), null)
    $$.deepEqual(list.item(1001), null)
  })

  $$.test('indexed getter', () => {
    $$.deepEqual(list[0], ele1)
    $$.deepEqual(list[1], ele2)
    $$.deepEqual(list[2], ele3)
    $$.deepEqual(list[3], ele4)
    $$.deepEqual(list[4], ele5)
    $$.deepEqual(list[-1], undefined)
    $$.deepEqual(list[1001], undefined)
  })

  $$.test('indexed setter', () => {
    const newEle = doc.createElement('tagX')
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