import $$ from "../TestHelpers"

describe('Event', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement
  const ele = doc.createElement('ele')
  de.appendChild(ele)

  test('properties', () => {
    const event = new $$.Event('custom', {})
    expect(event.target).toBeNull()
    expect(event.composedPath()).toEqual([])

    ele.addEventListener('custom', function (e) {
      // cannot init a dispatched event
      e.initEvent("something-else")
      expect(e.type).toBe("custom")

      expect(e.bubbles).toBe(false)
      expect(e.cancelable).toBe(false)
      expect(e.cancelBubble).toBe(false)
      expect(e.composed).toBe(false)
      expect(e.defaultPrevented).toBe(false)
      expect(e.isTrusted).toBe(false)
      expect(e.returnValue).toBe(true)
      expect(e.type).toBe("custom")
      expect(e.eventPhase).toBe($$.Event.AT_TARGET)
      expect(e.target).toBe(ele)
      expect(e.srcElement).toBe(ele)
      expect(e.currentTarget).toBe(ele)
      expect(e.composedPath()).toEqual([ele, de, doc])
    }, false)

    ele.dispatchEvent(event)
  })

  test('initEvent()', () => {
    const event = doc.createEvent('Event')
    event.initEvent('custom', true, true)

    ele.addEventListener('custom', function (e) {
      expect(e.type).toBe("custom")
      expect(e.bubbles).toBe(true)
      expect(e.cancelable).toBe(true)
      expect(e.target).toBe(ele)
    }, false)

    ele.dispatchEvent(event)
  })

  test('propagation', () => {
    const childEle = doc.createElement('child')
    ele.appendChild(childEle)

    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    childEle.dispatchEvent(event)
    expect(propagated).toBe(true)
  })

  test('stopPropagation()', () => {
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

    expect(propagated).toBe(false)
  })

  test('cancelBubble()', () => {
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

    expect(propagated).toBe(false)
  })

  test('immediate propagation', () => {
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

  test('stopImmediatePropagation()', () => {
    let propagated = false
    const event = new $$.Event("custom")
    ele.addEventListener('custom', function (e) {
      e.stopImmediatePropagation()
    }, false)
    ele.addEventListener('custom', function (e) {
      propagated = true
    }, false)
    ele.dispatchEvent(event)

    expect(propagated).toBe(false)
  })

  test('constants', () => {
    const event = new $$.Event('custom', {})
    expect(event.CAPTURING_PHASE).toBe(1)
    expect($$.Event.CAPTURING_PHASE).toBe(1)
  })

})