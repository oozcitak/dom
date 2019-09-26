import $$ from './TestHelpers'

describe('DOMObjectCache', () => {
  
  test('add()', () => {
    const cache = new $$.util.DOMObjectCacheImpl<number>()
    cache.add(1)
    cache.add(2)
    cache.add(3)
    expect([...cache.entries()]).toEqual([1, 2, 3])
  })

  test('remove()', () => {
    const cache = new $$.util.DOMObjectCacheImpl<number>()
    cache.add(1)
    cache.add(2)
    cache.add(3)
    expect([...cache.entries()]).toEqual([1, 2, 3])
    cache.remove(2)
    expect([...cache.entries()]).toEqual([1, 3])
    cache.remove(4)
    expect([...cache.entries()]).toEqual([1, 3])
  })

  test('clear()', () => {
    const cache = new $$.util.DOMObjectCacheImpl<number>()
    cache.add(1)
    cache.add(2)
    cache.add(3)
    expect([...cache.entries()]).toEqual([1, 2, 3])
    cache.clear()
    expect([...cache.entries()]).toEqual([ ])
  })

  test('entries()', () => {
    const cache = new $$.util.DOMObjectCacheImpl<number>()
    cache.add(1)
    cache.add(2)
    cache.add(3)
    expect([...cache.entries()]).toEqual([1, 2, 3])
  })

  test('iterator', () => {
    const cache = new $$.util.DOMObjectCacheImpl<number>()
    cache.add(1)
    cache.add(2)
    cache.add(3)
    const items: number[] = []
    for (const item of cache) {
      items.push(item)
    }
    expect([...items]).toEqual([1, 2, 3])
  })

  test('length', () => {
    const cache = new $$.util.DOMObjectCacheImpl<number>()
    cache.add(1)
    cache.add(2)
    cache.add(3)
    expect(cache.length).toBe(3)
  })

})