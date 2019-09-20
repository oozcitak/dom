import $$ from './TestHelpers'

describe('CustomEvent', function () {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  test('constructor()', function () {
    const event = new $$.CustomEvent("custom", {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: "some data"
    })
    expect(event.type).toBe("custom")
    expect(event.bubbles).toBe(true)
    expect(event.cancelable).toBe(true)
    expect(event.composed).toBe(true)
    expect(event.detail).toBe("some data")
  })

  test('dispatch()', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const event = new $$.CustomEvent('custom', { detail: "data" })

    ele.addEventListener('custom', function (e) {
      const ce = e as any
      // cannot init a dispatched event
      ce.initCustomEvent("something-else")
      expect(ce.type).toBe("custom")
      expect(ce.detail).toBe("data")
    }, false)

    ele.dispatchEvent(event)
  })

  test('initCustomEvent()', function () {
    const event = new $$.CustomEvent("custom")
    event.initCustomEvent("custom", true, true, "some data")
    expect(event.type).toBe("custom")
    expect(event.bubbles).toBe(true)
    expect(event.cancelable).toBe(true)
    expect(event.composed).toBe(false)
    expect(event.detail).toBe("some data")
  })

  test('initCustomEvent() defaults', function () {
    const event = new $$.CustomEvent("custom")
    event.initCustomEvent("custom")
    expect(event.type).toBe("custom")
    expect(event.bubbles).toBe(false)
    expect(event.cancelable).toBe(false)
    expect(event.composed).toBe(false)
    expect(event.detail).toBeNull()
  })

})