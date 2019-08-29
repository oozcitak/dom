import $$ from './TestHelpers'

describe('GlobalStore', function () {

  test('instance', function () {
    const store1 = $$.GlobalStore.instance
    const store2 = $$.GlobalStore.instance
    expect(store1).toBe(store2)
  })

  test('set', function () {
    $$.util.globalStore.item = "value"
    expect($$.util.globalStore.item).toBe("value")
  })

  test('get', function () {
    expect($$.util.globalStore.item).toBe("value")
  })


})