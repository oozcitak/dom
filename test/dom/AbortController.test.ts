import $$ from "../TestHelpers"
import { AbortSignal } from "../../src/dom/interfaces"
import { AbortError } from "../../src/dom/DOMException"
import { abort_add } from "../../src/algorithm"

// an example function using the abort API, from:
// https://dom.spec.whatwg.org/#aborting-ongoing-activities-spec-example
function doAmazingness(options: { signal: AbortSignal }) {
  function importantWork() {
    return new Promise(resolve => setTimeout(resolve, 100))
  }

  if (options.signal.aborted) {
    return Promise.reject(new AbortError())
  }

  return new Promise<boolean>(async (resolve, reject) => {
    let aborted = false

    abort_add(() => {
      aborted = true
      reject(new AbortError())
    }, options.signal)

    for (let i = 0; i < 20; i++) {
      if (aborted) break
      // do important work
      await importantWork()
    }

    const amazingResult = true
    resolve(amazingResult)
  })
}

describe('AbortController', () => {

  test('abort()', (done) => {
    const controller = new $$.AbortController()
    const signal = controller.signal

    expect(signal.aborted).toBe(false)

    doAmazingness({ signal }).then(
      () => { throw new Error("Should have been aborted!") },
      () => {
        expect(signal.aborted).toBe(true)    
        done() 
      }
    )

    controller.abort()
  })

})