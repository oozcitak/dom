import $$ from "../TestHelpers"

$$.suite('Window', () => {

  $$.test('event', () => {
    const window = $$.window
    const root = $$.newDoc

    const event = new $$.Event('custom', {})

    root.addEventListener('custom', (e) => {
      $$.deepEqual(window.event, event)
    }, false)

    root.dispatchEvent(event)
  })


})