import $$ from './TestHelpers'

describe('Window', function () {

  const window = $$.window

  test('window', function () {
    expect(window.window).toBe(window)
    expect(window.self).toBe(window)
    expect(window.frames).toBe(window)
  })

  test('document', function () {
    const doc = window.document
    expect(doc.URL).toBe('about:blank')
  })

})