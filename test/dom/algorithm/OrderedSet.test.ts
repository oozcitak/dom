import $$ from '../TestHelpers'

describe('OrderedSet', () => {

  test('parse()', () => {
    const set = $$.algo.orderedSet.parse('a b c a')
    expect(set.size).toBe(3)
    const vals = ['a', 'b', 'c']
    let i = 0
    for (const val of set)
    {
      expect(val).toBe(vals[i++])
    }
  })

  test('serialize()', () => {
    const set = new Set(['a', 'b', 'c', 'a'])
    expect($$.algo.orderedSet.serialize(set)).toBe('a b c')
  })

  test('sanitize()', () => {
    expect($$.algo.orderedSet.sanitize('a  b   c   a')).toBe('a b c')
  })

})
