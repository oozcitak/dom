import $$ from "../TestHelpers"
import { EmptySet } from "../../src/util"

$$.suite('EmptySet', () => {

  const set = new EmptySet<number>()

  $$.test('size', () => {
    $$.deepEqual(set.size, 0)
  })

  $$.test('add()', () => {
    $$.throws(() => set.add(1))
  })

  $$.test('clear()', () => {
    set.clear()
    $$.deepEqual(set.size, 0)
  })

  $$.test('delete()', () => {
    $$.deepEqual(set.delete(1), false)
  })

  $$.test('forEach()', () => {
    let str = ""
    set.forEach(e => str += e.toString())
    $$.deepEqual(str, "")
  })

  $$.test('has()', () => {
    $$.deepEqual(set.has(1), false)
  })

  $$.test('entries()', () => {
    let str = ""
    for (const e of set.entries()) { str += e[0].toString() }
    $$.deepEqual(str, "")
  })

  $$.test('keys()', () => {
    let str = ""
    for (const e of set.keys()) { str += e.toString() }
    $$.deepEqual(str, "")
  })

  $$.test('values()', () => {
    let str = ""
    for (const e of set.values()) { str += e.toString() }
    $$.deepEqual(str, "")
  })

  $$.test('toString()', () => {
    $$.deepEqual(set.toString(), "[object EmptySet]")
  })

})