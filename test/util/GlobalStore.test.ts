import $$ from '../TestHelpers'

describe('GlobalStore', () => {

  test('dom', () => {
    const dom1 = $$.util.globalStore.dom
    const dom2 = $$.util.globalStore.dom
    expect(dom1).toBe(dom2)
  })

})