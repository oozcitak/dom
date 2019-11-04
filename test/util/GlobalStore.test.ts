import $$ from '../TestHelpers'

describe('GlobalStore', () => {

  test('algorithm', () => {
    const store = $$.util.globalStore
    expect(() => store.algorithm).not.toThrow()
  })

  test('window', () => {
    const store = $$.util.globalStore
    expect(() => store.window).not.toThrow()
  })

  test('instance', () => {
    const store1 = $$.util.GlobalStore.instance
    const store2 = $$.util.GlobalStore.instance
    expect(store1).toBe(store2)
  })

})