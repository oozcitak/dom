import $$ from "../TestHelpers"
import { orderedSet_parse, orderedSet_serialize, orderedSet_sanitize } from "../../src/algorithm"

$$.suite('OrderedSet', () => {

  $$.test('parse()', () => {
    const set = orderedSet_parse('a b c a')
    $$.deepEqual(set.size, 3)
    const vals = ['a', 'b', 'c']
    let i = 0
    for (const val of set)
    {
      $$.deepEqual(val, vals[i++])
    }
  })

  $$.test('serialize()', () => {
    const set = new Set(['a', 'b', 'c', 'a'])
    $$.deepEqual(orderedSet_serialize(set), 'a b c')
  })

  $$.test('sanitize()', () => {
    $$.deepEqual(orderedSet_sanitize('a  b   c   a'), 'a b c')
  })

})
