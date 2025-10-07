import $$ from "../TestHelpers"
import { eventTarget_removeAllEventListeners } from "../../src/algorithm"

$$.suite('EventTargetAlgorithm', () => {

  $$.test('eventTarget_removeAllEventListeners()', () => {

    const doc = $$.dom.createDocument('ns', 'root')
    const ele = doc.createElement('ele')

    ele.addEventListener('custom', (e: any) => false)
    ele.addEventListener('custom', (e: any) => false)
    $$.deepEqual((ele as any)._eventListenerList.length, 2)
    eventTarget_removeAllEventListeners(ele)
    $$.deepEqual((ele as any)._eventListenerList.length, 0)
  })

})