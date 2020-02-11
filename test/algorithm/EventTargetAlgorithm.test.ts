import $$ from "../TestHelpers"
import { eventTarget_removeAllEventListeners } from "../../src/algorithm"

describe('EventTargetAlgorithm', () => {

  test('eventTarget_removeAllEventListeners()', () => {

    const doc = $$.dom.createDocument('ns', 'root')
    const ele = doc.createElement('ele')

    ele.addEventListener('custom', (e: any) => false)
    ele.addEventListener('custom', (e: any) => false)
    expect((ele as any)._eventListenerList.length).toBe(2)
    eventTarget_removeAllEventListeners(ele)
    expect((ele as any)._eventListenerList.length).toBe(0)
  })

})