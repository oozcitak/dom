import $$ from './TestHelpers'

describe('Window', () => {

  const window = $$.window

  test('window', () => {
    expect(window.window).toBe(window)
    expect(window.self).toBe(window)
    expect(window.frames).toBe(window)
  })

  test('document', () => {
    const doc = window.document
    expect(doc.URL).toBe('about:blank')
  })

})