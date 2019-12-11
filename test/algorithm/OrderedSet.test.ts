import $$ from "../TestHelpers"
import { orderedSet_parse, orderedSet_serialize, orderedSet_sanitize } from "../../src/algorithm"

describe('OrderedSet', () => {

  test('parse()', () => {
    const set = orderedSet_parse('a b c a')
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
    expect(orderedSet_serialize(set)).toBe('a b c')
  })

  test('sanitize()', () => {
    expect(orderedSet_sanitize('a  b   c   a')).toBe('a b c')
  })

})
