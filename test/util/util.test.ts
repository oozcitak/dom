import $$ from './TestHelpers'

describe('util', function () {

  test('clone', function () {
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

  test('isBoolean', function () {
    expect($$.util.isBoolean(true)).toBeTruthy()
    expect($$.util.isBoolean(true)).toBeTruthy()
    expect($$.util.isBoolean(1)).toBeFalsy()
    expect($$.util.isBoolean(0)).toBeFalsy()
    expect($$.util.isBoolean("x")).toBeFalsy()
    expect($$.util.isBoolean(["x"])).toBeFalsy()
    expect($$.util.isBoolean({ x: "x" })).toBeFalsy()
    expect($$.util.isBoolean(() => { })).toBeFalsy()
  })

  test('isNumber', function () {
    expect($$.util.isNumber(1)).toBeTruthy()
    expect($$.util.isNumber(0)).toBeTruthy()
    expect($$.util.isNumber(NaN)).toBeTruthy()
    expect($$.util.isNumber(Infinity)).toBeTruthy()
    expect($$.util.isNumber("x")).toBeFalsy()
    expect($$.util.isNumber(["x"])).toBeFalsy()
    expect($$.util.isNumber({ x: "x" })).toBeFalsy()
    expect($$.util.isNumber(() => { })).toBeFalsy()
  })

  test('isString', function () {
    expect($$.util.isString("")).toBeTruthy()
    expect($$.util.isString("0")).toBeTruthy()
    expect($$.util.isString(1)).toBeFalsy()
    expect($$.util.isString(["x"])).toBeFalsy()
    expect($$.util.isString({ x: "x" })).toBeFalsy()
    expect($$.util.isString(() => { })).toBeFalsy()
  })

  test('isFunction', function () {
    expect($$.util.isFunction(() => { })).toBeTruthy()
    expect($$.util.isFunction("0")).toBeFalsy()
    expect($$.util.isFunction(1)).toBeFalsy()
    expect($$.util.isFunction(["x"])).toBeFalsy()
    expect($$.util.isFunction({ x: "x" })).toBeFalsy()
  })

  test('isObject', function () {
    expect($$.util.isObject(() => { })).toBeTruthy()
    expect($$.util.isObject(["x"])).toBeTruthy()
    expect($$.util.isObject({ x: "x" })).toBeTruthy()
    expect($$.util.isObject("0")).toBeFalsy()
    expect($$.util.isObject(1)).toBeFalsy()
  })

  test('isArray', function () {
    expect($$.util.isArray(["x"])).toBeTruthy()
    expect($$.util.isArray(() => { })).toBeFalsy()
    expect($$.util.isArray({ x: "x" })).toBeFalsy()
    expect($$.util.isArray("0")).toBeFalsy()
    expect($$.util.isArray(1)).toBeFalsy()
  })

  test('isEmpty', function () {
    expect($$.util.isEmpty([])).toBeTruthy()
    expect($$.util.isEmpty({})).toBeTruthy()
    expect($$.util.isEmpty(["x"])).toBeFalsy()
    expect($$.util.isEmpty({ x: "x" })).toBeFalsy()

    expect($$.util.isEmpty(123)).toBeFalsy()
    expect($$.util.isEmpty(0)).toBeFalsy()
    expect($$.util.isEmpty(true)).toBeFalsy()
    expect($$.util.isEmpty(false)).toBeFalsy()
    expect($$.util.isEmpty("nope")).toBeFalsy()
    expect($$.util.isEmpty("")).toBeFalsy()

    class Obj { }
    const emptyObj = new Obj()
    Reflect.setPrototypeOf(emptyObj, { id: 42 })
    expect($$.util.isEmpty(emptyObj)).toBeTruthy()
  })

})