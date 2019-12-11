import $$ from "../TestHelpers"

describe('Window', () => {

  test('event', () => {
    const window = $$.window
    const root = $$.newDoc

    const event = new $$.Event('custom', {})

    root.addEventListener('custom', (e) => {
      expect(window.event).toBe(event)
    }, false)

    root.dispatchEvent(event)
  })


})