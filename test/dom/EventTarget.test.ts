import $$ from "../TestHelpers"

describe('EventTarget', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  test('addEventListener() with null callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    expect((ele as any)._eventListenerList.length).toBe(0)
    ele.addEventListener('custom', null)
    expect((ele as any)._eventListenerList.length).toBe(0)
  })

  test('addEventListener() with function callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    expect((ele as any)._eventListenerList.length).toBe(0)
    const callback = (e: any) => false
    ele.addEventListener('custom', callback)
    expect((ele as any)._eventListenerList.length).toBe(1)
    expect((ele as any)._eventListenerList[0].callback).toEqual({ handleEvent: callback })
  })

  test('adding same listener has no effect', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const callback = (e: any) => false
    ele.addEventListener('custom', callback)
    expect((ele as any)._eventListenerList.length).toBe(1)
    ele.addEventListener('custom', callback)
    expect((ele as any)._eventListenerList.length).toBe(1)
  })

  test('addEventListener() with event handler', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    expect((ele as any)._eventListenerList.length).toBe(0)
    const handler = { handleEvent: (e: any) => false }
    ele.addEventListener('custom', handler)
    expect((ele as any)._eventListenerList.length).toBe(1)
    expect((ele as any)._eventListenerList[0].callback).toEqual(handler)
  })

  test('removeEventListener() with null callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    ele.addEventListener('custom', (e: any) => false, false)
    expect((ele as any)._eventListenerList.length).toBe(1)
    ele.removeEventListener('custom', null)
    expect((ele as any)._eventListenerList.length).toBe(1)
  })

  test('removeEventListener() with function callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const callback = (e: any) => false
    ele.addEventListener('other', (e: any) => true, false)
    ele.addEventListener('custom', (e: any) => true, false)
    ele.addEventListener('custom', callback, false)
    expect((ele as any)._eventListenerList.length).toBe(3)
    ele.removeEventListener('custom', callback, false)
    expect((ele as any)._eventListenerList.length).toBe(2)
  })

  test('removeEventListener() with event handler', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const handler = { handleEvent: (e: any) => false }
    ele.addEventListener('other', (e: any) => true, false)
    ele.addEventListener('custom', (e: any) => true, false)
    ele.addEventListener('custom', handler, false)
    expect((ele as any)._eventListenerList.length).toBe(3)
    ele.removeEventListener('custom', handler, false)
    expect((ele as any)._eventListenerList.length).toBe(2)
  })

  test('dispatchEvent()', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    let num = 0
    const event = new $$.Event("custom")
    ele.addEventListener('custom', (e: any) => num = 1, false)
    ele.dispatchEvent(event)
    expect(num).toBe(1)
  })

  test('dispatchEvent() cant be nested', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const event = new $$.Event("custom")
    ele.addEventListener('custom', (e: any) => expect(() => ele.dispatchEvent(event)).toThrow(), false)
    ele.dispatchEvent(event)
  })

})