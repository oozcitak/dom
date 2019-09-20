import $$ from './TestHelpers'

describe('List', function () {

  test('append()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.append(list, 'd')
    expect(list).toEqual(['a', 'b', 'c', 'd'])
  })

  test('extend()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.extend(list, ['d', 'e'])
    expect(list).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  test('prepend()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.prepend(list, 'd')
    expect(list).toEqual(['d', 'a', 'b', 'c'])
  })

  test('replace()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.replace(list, 'b', 'd')
    expect(list).toEqual(['a', 'd', 'c'])
  })

  test('replace() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    $$.infra.list.replace(list, (item) => item.startsWith('b'), 'd')
    expect(list).toEqual(['a', 'd', 'd', 'c'])
  })

  test('insert()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.insert(list, 'd', 1)
    expect(list).toEqual(['a', 'd', 'b', 'c'])
  })

  test('remove()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.remove(list, 'b')
    expect(list).toEqual(['a', 'c'])
  })

  test('remove() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    $$.infra.list.remove(list, (item) => item.startsWith('b'))
    expect(list).toEqual(['a', 'c'])
  })

  test('empty()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.empty(list)
    expect(list).toEqual([ ])
  })

  test('contains()', function () {
    const list = ['a', 'b', 'c']
    expect($$.infra.list.contains(list, 'b')).toBe(true)
    expect($$.infra.list.contains(list, 'd')).toBe(false)
  })

  test('remove() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    expect($$.infra.list.contains(list, (item) => item.startsWith('b'))).toBe(true)
    expect($$.infra.list.contains(list, (item) => item.startsWith('d'))).toBe(false)
  })

  test('size()', function () {
    const list = ['a', 'b', 'c']
    expect($$.infra.list.size(list)).toBe(3)
  })

  test('size() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    expect($$.infra.list.size(list, (item) => item.startsWith('b'))).toBe(2)
  })

  test('isEmpty()', function () {
    const list = ['a', 'b', 'c']
    expect($$.infra.list.isEmpty(list)).toBe(false)
    list.length = 0
    expect($$.infra.list.isEmpty(list)).toBe(true)
  })

  test('forEach()', function () {
    const list = ['a', 'b', 'c']
    const newList: string[] = []
    for (const item of $$.infra.list.forEach(list)) {
      newList.push(item + '_')
    }
    expect(newList).toEqual(['a_', 'b_', 'c_'])
  })

  test('forEach() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    const newList: string[] = []
    for (const item of $$.infra.list.forEach(list, item => item.startsWith('b'))) {
      newList.push(item + '_')
    }
    expect(newList).toEqual(['b1_', 'b2_'])
  })

  test('clone()', function () {
    const list = ['a', 'b', 'c']
    const newList = $$.infra.list.clone(list)
    expect(newList).toEqual(['a', 'b', 'c'])
  })

  test('sortInAscendingOrder()', function () {
    const list = ['c', 'b', 'a']
    const newList = $$.infra.list.sortInAscendingOrder(list, (a, b) => a < b)
    expect(newList).toEqual(['a', 'b', 'c'])
  })

  test('sortInAscendingOrder() reverse', function () {
    const list = ['a', 'b', 'c']
    const newList = $$.infra.list.sortInAscendingOrder(list, (a, b) => a < b)
    expect(newList).toEqual(['a', 'b', 'c'])
  })

  test('sortInDescendingOrder()', function () {
    const list = ['a', 'b', 'c']
    const newList = $$.infra.list.sortInDescendingOrder(list, (a, b) => a < b)
    expect(newList).toEqual(['c', 'b', 'a'])
  })

  test('sortInDescendingOrder() reverse', function () {
    const list = ['c', 'b', 'a']
    const newList = $$.infra.list.sortInDescendingOrder(list, (a, b) => a < b)
    expect(newList).toEqual(['c', 'b', 'a'])
  })

})