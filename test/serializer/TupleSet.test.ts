import $$ from "../TestHelpers"

describe('TupleSet', () => {

  test('size', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    expect(set.size).toBe(4)
  })

  test('set()', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    expect(set.size).toBe(4)
    expect(set.has([1, "aa"])).toBe(true)
    expect(set.has([3, "c"])).toBe(true)
  })

  test('clear()', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    expect(set.size).toBe(4)
    expect(set.has([1, "aa"])).toBe(true)
    expect(set.has([3, "c"])).toBe(true)
    set.clear()
    expect(set.size).toBe(0)
    expect(set.has([1, "aa"])).toBe(false)
    expect(set.has([3, "c"])).toBe(false)
  })

  test('delete()', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    expect(set.size).toBe(4)
    expect(set.has([1, "a"])).toBe(true)
    expect(set.has([1, "aa"])).toBe(true)
    expect(set.has([2, "b"])).toBe(true)
    expect(set.has([3, "c"])).toBe(true)
    set.delete([1, "aa"])
    set.delete([3, "c"])
    expect(set.size).toBe(2)
    expect(set.has([1, "a"])).toBe(true)
    expect(set.has([2, "b"])).toBe(true)
    expect(set.has([1, "aa"])).toBe(false)
    expect(set.has([3, "c"])).toBe(false)
  })

  test('entries()', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    let keys = ""
    let vals = ""
    for (const val of set.entries()) {
      keys += val[0].toString()
      vals += val[1].toString()
    }
    expect(keys).toBe("1123")
    expect(vals).toBe("aaabc")
  })

  test('values()', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    let keys = ""
    let vals = ""
    for (const val of set.values()) {
      keys += val[0].toString()
      vals += val[1].toString()
    }
    expect(keys).toBe("1123")
    expect(vals).toBe("aaabc")
  })

  test('foreach()', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    let keys = ""
    let vals = ""
    set.forEach((val, setRef) => {
      keys += val[0].toString()
      vals += val[1].toString()
    })
    expect(keys).toBe("1123")
    expect(vals).toBe("aaabc")

    set.clear()
    set.set([1, "a"])
    let thisObj: { x: string } = { x: "abc" }
    set.forEach(function(this: { x: string }, val, setRef) {
      expect(val[0]).toBe(1)
      expect(val[1]).toBe("a")
      expect(this).toBe(thisObj)
      expect(setRef).toBe(set)
    }, thisObj)
  })

  test('has()', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    expect(set.size).toBe(4)
    expect(set.has([1, "a"])).toBe(true)
    expect(set.has([1, "aa"])).toBe(true)
    expect(set.has([2, "b"])).toBe(true)
    expect(set.has([3, "c"])).toBe(true)
    set.clear()
    expect(set.size).toBe(0)
    expect(set.has([1, "a"])).toBe(false)
    expect(set.has([2, "b"])).toBe(false)
    expect(set.has([1, "aa"])).toBe(false)
    expect(set.has([3, "c"])).toBe(false)
  })

  test('iterator', () => {
    const set = new $$.TupleSet<number, string>()
    set.set([1, "a"])
    set.set([1, "aa"])
    set.set([2, "b"])
    set.set([3, "c"])
    set.set([3, "c"])
    let keys = ""
    let vals = ""
    for (const val of set) {
      keys += val[0].toString()
      vals += val[1].toString()
    }
    expect(keys).toBe("1123")
    expect(vals).toBe("aaabc")
  })

})