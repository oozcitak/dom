import $$ from "../TestHelpers"

$$.suite('EventTarget', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  $$.test('addEventListener() with null callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    $$.deepEqual((ele as any)._eventListenerList.length, 0)
    ele.addEventListener('custom', null)
    $$.deepEqual((ele as any)._eventListenerList.length, 0)
  })

  $$.test('addEventListener() with function callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    $$.deepEqual((ele as any)._eventListenerList.length, 0)
    const callback = (e: any) => false
    ele.addEventListener('custom', callback)
    $$.deepEqual((ele as any)._eventListenerList.length, 1)
    $$.deepEqual((ele as any)._eventListenerList[0].callback, { handleEvent: callback })
  })

  $$.test('adding same listener has no effect', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const callback = (e: any) => false
    ele.addEventListener('custom', callback)
    $$.deepEqual((ele as any)._eventListenerList.length, 1)
    ele.addEventListener('custom', callback)
    $$.deepEqual((ele as any)._eventListenerList.length, 1)
  })

  $$.test('addEventListener() with event handler', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    $$.deepEqual((ele as any)._eventListenerList.length, 0)
    const handler = { handleEvent: (e: any) => false }
    ele.addEventListener('custom', handler)
    $$.deepEqual((ele as any)._eventListenerList.length, 1)
    $$.deepEqual((ele as any)._eventListenerList[0].callback, handler)
  })

  $$.test('removeEventListener() with null callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    ele.addEventListener('custom', (e: any) => false, false)
    $$.deepEqual((ele as any)._eventListenerList.length, 1)
    ele.removeEventListener('custom', null)
    $$.deepEqual((ele as any)._eventListenerList.length, 1)
  })

  $$.test('removeEventListener() with function callback', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const callback = (e: any) => false
    ele.addEventListener('other', (e: any) => true, false)
    ele.addEventListener('custom', (e: any) => true, false)
    ele.addEventListener('custom', callback, false)
    $$.deepEqual((ele as any)._eventListenerList.length, 3)
    ele.removeEventListener('custom', callback, false)
    $$.deepEqual((ele as any)._eventListenerList.length, 2)
  })

  $$.test('removeEventListener() with event handler', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const handler = { handleEvent: (e: any) => false }
    ele.addEventListener('other', (e: any) => true, false)
    ele.addEventListener('custom', (e: any) => true, false)
    ele.addEventListener('custom', handler, false)
    $$.deepEqual((ele as any)._eventListenerList.length, 3)
    ele.removeEventListener('custom', handler, false)
    $$.deepEqual((ele as any)._eventListenerList.length, 2)
  })

  $$.test('dispatchEvent()', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    let num = 0
    const event = new $$.Event("custom")
    ele.addEventListener('custom', (e: any) => num = 1, false)
    ele.dispatchEvent(event)
    $$.deepEqual(num, 1)
  })

  $$.test('dispatchEvent() cant be nested', () => {
    const ele = doc.createElement('ele')
    de.appendChild(ele)

    const event = new $$.Event("custom")
    ele.addEventListener('custom', (e: any) => $$.throws(() => ele.dispatchEvent(event)), false)
    ele.dispatchEvent(event)
  })

})