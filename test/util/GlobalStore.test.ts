import { GlobalStore } from '../../src/util/GlobalStore'

describe('GlobalStore without DOM', () => {

  test('algorithm', () => {
    const store = GlobalStore.instance
    expect(() => store.algorithm).toThrow()

    store.algorithm = "test" as any
    expect(store.algorithm).toBe("test")
  })

  test('window', () => {
    const store = GlobalStore.instance
    expect(() => store.window).toThrow()

    store.window = "test" as any
    expect(store.window).toBe("test")
  })

  test('instance', () => {
    const store1 = GlobalStore.instance
    const store2 = GlobalStore.instance
    expect(store1).toBe(store2)
  })

})