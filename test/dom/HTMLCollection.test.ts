import $$ from "../TestHelpers"

$$.suite('HTMLCollection', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")
  const de = doc.documentElement

  const ele1 = doc.createElement('tagged')
  ele1.id = 'ele1'
  const ele2 = doc.createElement('tagged')
  ele2.id = 'ele2'
  const ele3 = doc.createElement('tagged')
  ele3.id = 'ele3'
  de.appendChild(ele1)
  de.appendChild(ele2)
  ele1.appendChild(ele3)
  const list = doc.getElementsByTagName('tagged')

  const htmlDoc = $$.dom.createHTMLDocument('title')

  if (!htmlDoc.documentElement)
    throw new Error("documentElement is null")
  const htmlDE = htmlDoc.documentElement
  const htmlDiv = htmlDoc.createElement('div')
  htmlDiv.setAttribute('att1', 'val1')
  htmlDiv.setAttribute('name', 'my div')
  htmlDiv.setAttribute('att3', 'val3')
  htmlDE.appendChild(htmlDiv)
  const htmlList = htmlDoc.getElementsByTagName('div')

  $$.test('length', () => {
    $$.deepEqual(list.length, 3)
  })

  $$.test('item', () => {
    $$.deepEqual(list.item(0), ele1)
    $$.deepEqual(list.item(1), ele3)
    $$.deepEqual(list.item(2), ele2)
    $$.deepEqual(list.item(-1), null)
    $$.deepEqual(list.item(1001), null)
  })

  $$.test('namedItem', () => {
    $$.deepEqual(list.namedItem('ele1'), ele1)
    $$.deepEqual(list.namedItem('ele2'), ele2)
    $$.deepEqual(list.namedItem('ele3'), ele3)
    $$.deepEqual(list.namedItem(''), null)
    $$.deepEqual(list.namedItem('none'), null)

    $$.deepEqual(htmlList.namedItem('my div'), htmlDiv)
  })

  $$.test('indexed getter', () => {
    $$.deepEqual(list[0], ele1)
    $$.deepEqual(list[1], ele3)
    $$.deepEqual(list[2], ele2)
    $$.deepEqual(list['ele1'], ele1)
    $$.deepEqual(list['ele2'], ele2)
    $$.deepEqual(list['ele3'], ele3)
  })

  $$.test('indexed setter', () => {
    const newEle = doc.createElement('tagged')
    newEle.id = 'eleX'
    list[1] = newEle
    $$.deepEqual(list[0], ele1)
    $$.deepEqual(list[1], newEle)
    $$.deepEqual(list[2], ele2)
    $$.deepEqual(list['ele1'], ele1)
    $$.deepEqual(list['eleX'], newEle)
    $$.deepEqual(list['ele2'], ele2)
    $$.deepEqual(list['ele3'], undefined)
    list[1] = ele3
  })

  $$.test('iteration', () => {
    let names = ''
    for (const ele of list) {
      names += '_' + ele.id
    }
    $$.deepEqual(names, '_ele1_ele3_ele2')
  })

  $$.test('_create()', () => {
    const list2 = $$.HTMLCollection._create(de)
    $$.deepEqual(list2._root, de)
  })

})