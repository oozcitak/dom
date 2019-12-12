import $$ from "../TestHelpers"
import { EmptySet } from "../../src/util"

describe('EmptySet', () => {

  const set = new EmptySet<number>()

  test('size', () => {
    expect(set.size).toBe(0)
  })

  test('add()', () => {
    expect(() => set.add(1)).toThrow()
  })

  test('clear()', () => {
    set.clear()
    expect(set.size).toBe(0)
  })

  test('delete()', () => {
    expect(set.delete(1)).toBe(false)
  })

  test('forEach()', () => {
    let str = ""
    set.forEach(e => str += e.toString())
    expect(str).toBe("")
  })

  test('has()', () => {
    expect(set.has(1)).toBe(false)
  })

  test('entries()', () => {
    let str = ""
    for (const e of set.entries()) { str += e[0].toString() }
    expect(str).toBe("")
  })

  test('keys()', () => {
    let str = ""
    for (const e of set.keys()) { str += e.toString() }
    expect(str).toBe("")
  })

  test('values()', () => {
    let str = ""
    for (const e of set.values()) { str += e.toString() }
    expect(str).toBe("")
  })

  test('toString()', () => {
    expect(set.toString()).toBe("[object EmptySet]")
  })

})