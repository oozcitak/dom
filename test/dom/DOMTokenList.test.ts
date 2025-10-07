import $$ from "../TestHelpers"

$$.suite('DOMTokenList', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const ele = doc.createElement('tagged')
  doc.documentElement.appendChild(ele)
  ele.setAttribute('class', 'one two three')
  const list = ele.classList
  const ele2 = doc.createElement('node')
  doc.documentElement.appendChild(ele2)
  const list2 = ele2.classList

  $$.test('length', () => {
    $$.deepEqual(list.length, 3)
  })

  $$.test('item()', () => {
    $$.deepEqual(list.item(0), 'one')
    $$.deepEqual(list.item(1), 'two')
    $$.deepEqual(list.item(2), 'three')
    $$.deepEqual(list.item(-1), null)
    $$.deepEqual(list.item(1001), null)
  })

  $$.test('contains()', () => {
    $$.deepEqual(list.contains('one'), true)
    $$.deepEqual(list.contains('two'), true)
    $$.deepEqual(list.contains('three'), true)
    $$.deepEqual(list.contains('none'), false)
  })

  $$.test('add()', () => {
    list.add('four', 'five')
    $$.deepEqual(list.length, 5)
    $$.throws(() => list.add(''))
    $$.throws(() => list.add('one two'))
  })

  $$.test('remove()', () => {
    list.remove('four', 'five')
    $$.deepEqual(list.length, 3)
    $$.throws(() => list.remove(''))
    $$.throws(() => list.remove(' '))
  })

  $$.test('toggle()', () => {
    $$.deepEqual(list.toggle('one'), false)
    $$.deepEqual(list.toggle('one'), true)
    $$.deepEqual(list.toggle('one', false), false)
    $$.deepEqual(list.length, 2)
    $$.deepEqual(list.toggle('one', false), false)
    $$.deepEqual(list.length, 2)
    $$.deepEqual(list.toggle('one', true), true)
    $$.deepEqual(list.length, 3)
    $$.deepEqual(list.toggle('one', true), true)
    $$.deepEqual(list.length, 3)
    $$.throws(() => list.toggle(''))
    $$.throws(() => list.toggle('one two'))
  })

  $$.test('replace()', () => {
    $$.throws(() => list.replace('', '1'))
    $$.throws(() => list.replace('one', ''))
    $$.throws(() => list.replace(' ', '1'))
    $$.throws(() => list.replace('one', ' '))
    $$.deepEqual(list.replace('one', '1'), true)
    $$.deepEqual(list.replace('one', '1'), false)
    $$.deepEqual(list.length, 3)
  })

  $$.test('supports()', () => {
    $$.throws(() => list.supports('feature'))
  })

  $$.test('value', () => {
    list.value = 'four five six seven'
    $$.deepEqual(list.length, 4)
    list.add('eight')
    $$.deepEqual(list.value, 'four five six seven eight')
    $$.deepEqual(list.length, 5)
  })

  $$.test('iteration', () => {
    list.value = 'one two three'
    let names = ''
    for (const name of list) {
      names += '_' + name
    }
    $$.deepEqual(names, '_one_two_three')
  })

  $$.test('empty token list', () => {
    list2.value = ''
    $$.deepEqual(list2.length, 0)
  })

  $$.test('change attribute', () => {
    ele.setAttribute('class', 'four five six seven')
    let names = ''
    for (const name of list) {
      names += '_' + name
    }
    $$.deepEqual(names, '_four_five_six_seven')
    ele.setAttribute('x', 'four five six seven')
    names = ''
    for (const name of list) {
      names += '_' + name
    }
    $$.deepEqual(names, '_four_five_six_seven')
  })

})