import $$ from './TestHelpers'

describe('List', function () {

  test('append()', function () {
    const list = ['a', 'b', 'c']
    expect(list.length).toBe(3)
    $$.infra.list.append(list, 'd')
    expect(list.length).toBe(4)
    expect(list[3]).toBe('d')
  })

  test('extend()', function () {
    const list = ['a', 'b', 'c']
    expect(list.length).toBe(3)
    $$.infra.list.extend(list, ['d', 'e'])
    expect(list.length).toBe(5)
    expect(list[3]).toBe('d')
    expect(list[4]).toBe('e')
  })

  test('prepend()', function () {
    const list = ['a', 'b', 'c']
    expect(list.length).toBe(3)
    $$.infra.list.prepend(list, 'd')
    expect(list.length).toBe(4)
    expect(list[0]).toBe('d')
  })

  test('replace()', function () {
    const list = ['a', 'b', 'c']
    expect(list.length).toBe(3)
    $$.infra.list.replace(list, 'b', 'd')
    expect(list.length).toBe(3)
    expect(list[1]).toBe('d')
  })

  test('replace() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    expect(list.length).toBe(4)
    $$.infra.list.replace(list, (item) => item.startsWith('b'), 'd')
    expect(list.length).toBe(4)
    expect(list[1]).toBe('d')
    expect(list[2]).toBe('d')
  })

  test('insert()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.insert(list, 'd', 1)
    expect(list.length).toBe(4)
    expect(list[1]).toBe('d')
  })

  test('remove()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.list.remove(list, 'b')
    expect(list.length).toBe(2)
    expect(list[0]).toBe('a')
    expect(list[1]).toBe('c')
  })

  test('remove() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    $$.infra.list.remove(list, (item) => item.startsWith('b'))
    expect(list.length).toBe(2)
    expect(list[0]).toBe('a')
    expect(list[1]).toBe('c')
  })

  test('empty()', function () {
    const list = ['a', 'b', 'c']
    expect(list.length).toBe(3)
    $$.infra.list.empty(list)
    expect(list.length).toBe(0)
  })

  test('contains()', function () {
    const list = ['a', 'b', 'c']
    expect($$.infra.list.contains(list, 'b')).toBeTruthy()
    expect($$.infra.list.contains(list, 'd')).toBeFalsy()
  })

  test('remove() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    expect($$.infra.list.contains(list, (item) => item.startsWith('b'))).toBeTruthy()
    expect($$.infra.list.contains(list, (item) => item.startsWith('d'))).toBeFalsy()
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
    expect($$.infra.list.isEmpty(list)).toBeFalsy()
    list.length = 0
    expect($$.infra.list.isEmpty(list)).toBeTruthy()
  })

  test('forEach()', function () {
    const list = ['a', 'b', 'c']
    const newList: string[] = []
    for (const item of $$.infra.list.forEach(list)) {
      newList.push(item)
    }
    expect(newList.length).toBe(3)
    expect(newList[0]).toBe('a')
    expect(newList[1]).toBe('b')
    expect(newList[2]).toBe('c')
  })

  test('forEach() with condition', function () {
    const list = ['a', 'b1', 'b2', 'c']
    const newList: string[] = []
    for (const item of $$.infra.list.forEach(list, item => item.startsWith('b'))) {
      newList.push(item)
    }
    expect(newList.length).toBe(2)
    expect(newList[0]).toBe('b1')
    expect(newList[1]).toBe('b2')
  })

  test('clone()', function () {
    const list = ['a', 'b', 'c']
    const newList = $$.infra.list.clone(list)
    expect(newList.length).toBe(3)
    expect(newList[0]).toBe('a')
    expect(newList[1]).toBe('b')
    expect(newList[2]).toBe('c')
  })

  test('sortInAscendingOrder()', function () {
    const list = ['c', 'b', 'a']
    const newList = $$.infra.list.sortInAscendingOrder(list, (a, b) => a < b)
    expect(newList.length).toBe(3)
    expect(newList[0]).toBe('a')
    expect(newList[1]).toBe('b')
    expect(newList[2]).toBe('c')
  })

  test('sortInDescendingOrder()', function () {
    const list = ['c', 'b', 'a']
    const newList = $$.infra.list.sortInDescendingOrder(list, (a, b) => a < b)
    expect(newList.length).toBe(3)
    expect(newList[0]).toBe('c')
    expect(newList[1]).toBe('b')
    expect(newList[2]).toBe('a')
  })

})