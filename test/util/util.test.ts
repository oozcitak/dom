import $$ from '../TestHelpers'

describe('util', () => {

  test('clone', () => {
    expect($$.util.clone(1)).toBe(1)
    expect($$.util.clone(true)).toBe(true)
    expect($$.util.clone("x")).toBe("x")
    expect($$.util.clone(["x"])).toEqual(["x"])
    expect($$.util.clone({ x: "x" })).toEqual({ x: "x" })

    const obj1 = {
      a: 1,
      b: [1, 2, 3],
      c: "x",
      d: (val: string): string => 'hello ' + val
    }
    const  obj2 = $$.util.clone(obj1)
    expect(obj2.a).toBe(1)
    expect(obj2.b).toEqual([1, 2, 3])
    expect(obj2.c).toBe("x")
    expect(obj2.d("world")).toBe("hello world")
  })

  test('isBoolean', () => {
    expect($$.util.isBoolean(true)).toBe(true)
    expect($$.util.isBoolean(true)).toBe(true)
    expect($$.util.isBoolean(1)).toBe(false)
    expect($$.util.isBoolean(0)).toBe(false)
    expect($$.util.isBoolean("x")).toBe(false)
    expect($$.util.isBoolean(["x"])).toBe(false)
    expect($$.util.isBoolean({ x: "x" })).toBe(false)
    expect($$.util.isBoolean(() => { })).toBe(false)
  })

  test('isNumber', () => {
    expect($$.util.isNumber(1)).toBe(true)
    expect($$.util.isNumber(0)).toBe(true)
    expect($$.util.isNumber(NaN)).toBe(true)
    expect($$.util.isNumber(Infinity)).toBe(true)
    expect($$.util.isNumber("x")).toBe(false)
    expect($$.util.isNumber(["x"])).toBe(false)
    expect($$.util.isNumber({ x: "x" })).toBe(false)
    expect($$.util.isNumber(() => { })).toBe(false)
  })

  test('isString', () => {
    expect($$.util.isString("")).toBe(true)
    expect($$.util.isString("0")).toBe(true)
    expect($$.util.isString(1)).toBe(false)
    expect($$.util.isString(["x"])).toBe(false)
    expect($$.util.isString({ x: "x" })).toBe(false)
    expect($$.util.isString(() => { })).toBe(false)
  })

  test('isFunction', () => {
    expect($$.util.isFunction(() => { })).toBe(true)
    expect($$.util.isFunction("0")).toBe(false)
    expect($$.util.isFunction(1)).toBe(false)
    expect($$.util.isFunction(["x"])).toBe(false)
    expect($$.util.isFunction({ x: "x" })).toBe(false)
  })

  test('isObject', () => {
    expect($$.util.isObject(() => { })).toBe(true)
    expect($$.util.isObject(["x"])).toBe(true)
    expect($$.util.isObject({ x: "x" })).toBe(true)
    expect($$.util.isObject("0")).toBe(false)
    expect($$.util.isObject(1)).toBe(false)
  })

  test('isArray', () => {
    expect($$.util.isArray(["x"])).toBe(true)
    expect($$.util.isArray(() => { })).toBe(false)
    expect($$.util.isArray({ x: "x" })).toBe(false)
    expect($$.util.isArray("0")).toBe(false)
    expect($$.util.isArray(1)).toBe(false)
  })

  test('isEmpty', () => {
    expect($$.util.isEmpty([])).toBe(true)
    expect($$.util.isEmpty({})).toBe(true)
    expect($$.util.isEmpty(["x"])).toBe(false)
    expect($$.util.isEmpty({ x: "x" })).toBe(false)

    expect($$.util.isEmpty(123)).toBe(false)
    expect($$.util.isEmpty(0)).toBe(false)
    expect($$.util.isEmpty(true)).toBe(false)
    expect($$.util.isEmpty(false)).toBe(false)
    expect($$.util.isEmpty("nope")).toBe(false)
    expect($$.util.isEmpty("")).toBe(false)

    class Obj { }
    const emptyObj = new Obj()
    Reflect.setPrototypeOf(emptyObj, { id: 42 })
    expect($$.util.isEmpty(emptyObj)).toBe(true)
  })

  test('isPlainObject', function () {
    expect($$.util.isPlainObject({ x: "x" })).toBeTruthy()
    expect($$.util.isPlainObject(new Number(1))).toBeFalsy()
    expect($$.util.isPlainObject(["x"])).toBeFalsy()
    expect($$.util.isPlainObject(() => { })).toBeFalsy()
    expect($$.util.isPlainObject("0")).toBeFalsy()
    expect($$.util.isPlainObject(1)).toBeFalsy()
  })

  test('isIterable', function () {
    expect($$.util.isIterable(["x"])).toBeTruthy()
    expect($$.util.isIterable(new Map<string, number>([["a", 1]]))).toBeTruthy()
    expect($$.util.isIterable("0")).toBeTruthy()
    expect($$.util.isIterable({ x: "x" })).toBeFalsy()
    expect($$.util.isIterable(() => { })).toBeFalsy()
    expect($$.util.isIterable(1)).toBeFalsy()
  })

  test('isMap', function () {
    expect($$.util.isMap(new Map<string, number>([["a", 1]]))).toBeTruthy()
    expect($$.util.isMap({ x: "x" })).toBeFalsy()
    expect($$.util.isMap(["x"])).toBeFalsy()
    expect($$.util.isMap(() => { })).toBeFalsy()
    expect($$.util.isMap("0")).toBeFalsy()
    expect($$.util.isMap(1)).toBeFalsy()
  })

  test('getValue', function () {
    expect($$.util.getValue(new Number(1))).toBe(1)
    expect($$.util.getValue(new String("x"))).toBe("x")
    expect($$.util.getValue({ x: "x" })).toEqual({ x: "x" })
    expect($$.util.getValue(["x"])).toEqual(["x"])
    const withValueOf = new Number(1)
    const withoutValueOf = withValueOf as any
    withoutValueOf.valueOf = undefined
    expect($$.util.getValue(withoutValueOf).toString()).toBe("1")
  })

})
