import $$ from '../TestHelpers'

describe('NodeCompareCache', () => {

  test('check()', () => {
    const doc = $$.dom.createDocument('ns', 'root')
    const cache = $$.util.NodeCompareCache.instance

    for (let i = 0; i < 100; i++) {
      const node1 = doc.createElement('node1')
      const node2 = doc.createElement('node2')
      const val1 = cache.check(node1 as any, node2 as any)
      const val2 = cache.check(node2 as any, node1 as any)
      expect(val1 || val2).toBe(true)
      expect(val1 && val2).toBe(false)
    }
  })

})