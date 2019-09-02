import $$ from './TestHelpers'

describe('CustomEvent', function () {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  test('constructor()', function () {
    const event = new $$.CustomEvent("custom", { 
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: "some data" })
    expect(event.type).toBe("custom")
    expect(event.bubbles).toBeTruthy()
    expect(event.cancelable).toBeTruthy()
    expect(event.composed).toBeTruthy()
    expect(event.detail).toBe("some data")
  })

  test('initCustomEvent()', function () {
    const event = new $$.CustomEvent("custom")
    event.initCustomEvent("custom", true, true, "some data")
    expect(event.type).toBe("custom")
    expect(event.bubbles).toBeTruthy()
    expect(event.cancelable).toBeTruthy()
    expect(event.composed).toBeFalsy()
    expect(event.detail).toBe("some data")
  })

  test('initCustomEvent() defaults', function () {
    const event = new $$.CustomEvent("custom")
    event.initCustomEvent("custom")
    expect(event.type).toBe("custom")
    expect(event.bubbles).toBeFalsy()
    expect(event.cancelable).toBeFalsy()
    expect(event.composed).toBeFalsy()
    expect(event.detail).toBeNull()
  })

})