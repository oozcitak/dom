import $$ from '../TestHelpers'

describe('GlobalStore without DOM', () => {

  test('algorithm', () => {
    const store = $$.util.globalStore
    expect(() => store.algorithm).not.toThrow()
  })

  test('window', () => {
    const store = $$.util.globalStore
    expect(() => store.window).not.toThrow()
  })

  test('instance', () => {
    const store1 = $$.util.globalStore
    const store2 = $$.util.globalStore
    expect(store1).toBe(store2)
  })

})