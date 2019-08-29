import $$ from './TestHelpers'

describe('Stack', function () {

  test('push()', function () {
    const list = ['a', 'b', 'c']
    $$.infra.stack.push(list, 'd')
    expect(list).toEqual(['a', 'b', 'c', 'd'])
  })

  test('pop()', function () {
    const list = ['a', 'b', 'c']
    const item = $$.infra.stack.pop(list)
    expect(item).toBe('c')
    expect(list).toEqual(['a', 'b'])
    $$.infra.stack.pop(list) // remove b
    $$.infra.stack.pop(list) // remove a
    expect($$.infra.stack.pop(list)).toBeNull()    
  })

})