import $$ from "../TestHelpers"

$$.suite('Event', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement
  const ele = doc.createElement('ele')
  de.appendChild(ele)

  $$.test('properties', () => {
    const event = new $$.Event('custom', {})
    $$.deepEqual(event.target, null)
    $$.deepEqual(event.composedPath(), [])

    ele.addEventListener('custom', function (e) {
      // cannot init a dispatched event
      e.initEvent("something-else")
      $$.deepEqual(e.type, "custom")

      $$.deepEqual(e.bubbles, false)
      $$.deepEqual(e.cancelable, false)
      $$.deepEqual(e.cancelBubble, false)
      $$.deepEqual(e.composed, false)
      $$.deepEqual(e.defaultPrevented, false)
      $$.deepEqual(e.isTrusted, false)
      $$.deepEqual(e.returnValue, true)
      $$.deepEqual(e.type, "custom")
      $$.deepEqual(e.eventPhase, $$.Event.AT_TARGET)
      $$.deepEqual(e.target, ele)
      $$.deepEqual(e.srcElement, ele)
      $$.deepEqual(e.currentTarget, ele)
      $$.deepEqual(e.composedPath(), [ele, de, doc])
    }, false)

    ele.dispatchEvent(event)
  })

  $$.test('initEvent()', () => {
    const event = doc.createEvent('Event')
    event.initEvent('custom', true, true)

    ele.addEventListener('custom', function (e) {
      $$.deepEqual(e.type, "custom")
      $$.deepEqual(e.bubbles, true)
      $$.deepEqual(e.cancelable, true)
      $$.deepEqual(e.target, ele)
    }, false)

    ele.dispatchEvent(event)
  })

  $$.test('propagation', () => {
    const childEle = doc.createElement('child')
    ele.appendChild(childEle)

    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    childEle.dispatchEvent(event)
    $$.deepEqual(propagated, true)
  })

  $$.test('stopPropagation()', () => {
    const childEle = doc.createElement('child')
    ele.appendChild(childEle)

    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    childEle.addEventListener('custom', function (e) {
      e.stopPropagation()
    }, false)
    childEle.dispatchEvent(event)

    $$.deepEqual(propagated, false)
  })

  $$.test('cancelBubble()', () => {
    const childEle = doc.createElement('child')
    ele.appendChild(childEle)

    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    childEle.addEventListener('custom', function (e) {
      e.cancelBubble = true
    }, false)
    childEle.dispatchEvent(event)

    $$.deepEqual(propagated, false)
  })

  $$.test('immediate propagation', () => {
    let propagated = 0
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      propagated++
    }, false)
    ele.addEventListener('custom', function (e) {
      propagated++
    }, false)
    ele.dispatchEvent(event)

    $$.deepEqual(propagated, 2)
  })

  $$.test('stopImmediatePropagation()', () => {
    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      e.stopImmediatePropagation()
    }, false)
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    ele.dispatchEvent(event)

    $$.deepEqual(propagated, false)
  })

  $$.test('constants', () => {
    const event = new $$.Event('custom', {})
    $$.deepEqual(event.CAPTURING_PHASE, 1)
    $$.deepEqual($$.Event.CAPTURING_PHASE, 1)
  })

  $$.test('set returnValue', () => {
    const event = new $$.Event('custom', { cancelable: true })
    event.returnValue = false
    $$.deepEqual(event.returnValue, false)
    const event2 = new $$.Event('custom', { cancelable: false })
    event2.returnValue = false
    $$.deepEqual(event2.returnValue, true)
  })

})