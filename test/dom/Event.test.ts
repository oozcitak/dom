import $$ from './TestHelpers'

describe('Event', function () {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  test('properties', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const event = new $$.Event('custom', {})
    expect(event.target).toBeNull()
    expect(event.composedPath()).toEqual([])

    ele.addEventListener('custom', function (e) {
      // cannot init a dispatched event
      e.initEvent("something-else")
      expect(e.type).toBe("custom")

      expect(e.bubbles).toBeFalsy()
      expect(e.cancelable).toBeFalsy()
      expect(e.cancelBubble).toBeFalsy()
      expect(e.composed).toBeFalsy()
      expect(e.defaultPrevented).toBeFalsy()
      expect(e.isTrusted).toBeFalsy()
      expect(e.returnValue).toBeTruthy()
      expect(e.type).toBe("custom")
      expect(e.eventPhase).toBe($$.Event.AT_TARGET)
      expect(e.target).toBe(ele)
      expect(e.srcElement).toBe(ele)
      expect(e.currentTarget).toBe(ele)
      expect(e.composedPath()).toEqual([ele, de, doc])
    }, false)

    ele.dispatchEvent(event)
  })

  test('initEvent()', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const event = doc.createEvent('Event')
    event.initEvent('custom', true, true)

    ele.addEventListener('custom', function (e) {
      expect(e.type).toBe("custom")
      expect(e.bubbles).toBeTruthy()
      expect(e.cancelable).toBeTruthy()
      expect(e.target).toBe(ele)
    }, false)

    ele.dispatchEvent(event)
  })

  test('propagation', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)
    const childEle = doc.createElement('child')
    ele.appendChild(childEle)

    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    childEle.dispatchEvent(event)
    expect(propagated).toBeTruthy()
  })

  test('stopPropagation()', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)
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

    expect(propagated).toBeFalsy()
  })

  test('cancelBubble()', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)
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

    expect(propagated).toBeFalsy()
  })

  test('immediate propagation', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    let propagated = 0
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      propagated++
    }, false)
    ele.addEventListener('custom', function (e) {
      propagated++
    }, false)
    ele.dispatchEvent(event)

    expect(propagated).toBe(2)
  })

  test('stopImmediatePropagation()', function () {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      e.stopImmediatePropagation()
    }, false)
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    ele.dispatchEvent(event)

    expect(propagated).toBeFalsy()
  })

})