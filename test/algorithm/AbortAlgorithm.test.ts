import $$ from "../TestHelpers"
import { abort_add, abort_remove, abort_signalAbort } from "../../src/algorithm"
import { AbortError } from "../../src/dom/DOMException"

describe('AbortAlgorithm', () => {

  test('abort_add()', () => {
    const controller = new $$.AbortController()
    const signal = controller.signal

    abort_add(() => {
      throw new AbortError()
    }, signal)

    expect(signal._abortAlgorithms.size).toBe(1)
  })

  test('abort_add() cant add to aborted signal', () => {
    const controller = new $$.AbortController()
    const signal = controller.signal
    abort_signalAbort(signal)
    
    abort_add(() => {
      throw new AbortError()
    }, signal)

    expect(signal._abortAlgorithms.size).toBe(0)
  })

  test('abort_remove()', () => {
    const controller = new $$.AbortController()
    const signal = controller.signal

    const algo = () => { throw new AbortError() }
    
    abort_add(algo, signal)
    expect(signal._abortAlgorithms.size).toBe(1)
    abort_remove(algo, signal)
    expect(signal._abortAlgorithms.size).toBe(0)
  })

  test('abort_signalAbort()', () => {
    let abortCount = 0
    const controller = new $$.AbortController()
    const signal = controller.signal
    
    abort_add(() => {
      abortCount++
    }, signal)
    abort_signalAbort(signal)
    expect(abortCount).toBe(1)
    // aborting already aborted signal has no effect
    abort_signalAbort(signal)
    expect(abortCount).toBe(1)
  })

})