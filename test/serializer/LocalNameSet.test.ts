import $$ from "../TestHelpers"

describe('LocalNameSet', () => {

  test('set()', () => {
    const set = new $$.LocalNameSet()
    set.set("1", "a")
    set.set("1", "aa")
    set.set("2", "b")
    set.set("3", "c")
    set.set("3", "c")
    expect(set.has("1", "aa")).toBe(true)
    expect(set.has("3", "a")).toBe(false)
    expect(set.has("3", "c")).toBe(true)
  })

  test('has()', () => {
    const set = new $$.LocalNameSet()
    set.set("1", "a")
    set.set("1", "aa")
    set.set("2", "b")
    set.set("3", "c")
    set.set("3", "c")
    expect(set.has("1", "a")).toBe(true)
    expect(set.has("1", "aa")).toBe(true)
    expect(set.has("2", "b")).toBe(true)
    expect(set.has("3", "c")).toBe(true)
  })

})