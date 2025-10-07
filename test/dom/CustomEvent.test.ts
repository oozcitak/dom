import $$ from "../TestHelpers"

$$.suite('CustomEvent', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  $$.test('constructor()', () => {
    const event = new $$.CustomEvent("custom", {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: "some data"
    })
    $$.deepEqual(event.type, "custom")
    $$.deepEqual(event.bubbles, true)
    $$.deepEqual(event.cancelable, true)
    $$.deepEqual(event.composed, true)
    $$.deepEqual(event.detail, "some data")
  })

  $$.test('dispatch()', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const event = new $$.CustomEvent('custom', { detail: "data" })

    ele.addEventListener('custom', function (e) {
      const ce = e as any
      // cannot init a dispatched event
      ce.initCustomEvent("something-else")
      $$.deepEqual(ce.type, "custom")
      $$.deepEqual(ce.detail, "data")
    }, false)

    ele.dispatchEvent(event)
  })

  $$.test('initCustomEvent()', () => {
    const event = new $$.CustomEvent("custom")
    event.initCustomEvent("custom", true, true, "some data")
    $$.deepEqual(event.type, "custom")
    $$.deepEqual(event.bubbles, true)
    $$.deepEqual(event.cancelable, true)
    $$.deepEqual(event.composed, false)
    $$.deepEqual(event.detail, "some data")
  })

  $$.test('initCustomEvent() defaults', () => {
    const event = new $$.CustomEvent("custom")
    event.initCustomEvent("custom")
    $$.deepEqual(event.type, "custom")
    $$.deepEqual(event.bubbles, false)
    $$.deepEqual(event.cancelable, false)
    $$.deepEqual(event.composed, false)
    $$.deepEqual(event.detail, null)
  })

})