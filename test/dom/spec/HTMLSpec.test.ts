import $$ from '../TestHelpers'

describe('HTMLSpec', () => {

  test('isValidCustomElementName()', () => {
    expect($$.HTMLSpec.isValidCustomElementName('.name')).toBe(false)
    expect($$.HTMLSpec.isValidCustomElementName('font-face')).toBe(false)
    expect($$.HTMLSpec.isValidCustomElementName('my-custom')).toBe(true)
  })

  test('isValidElementName()', () => {
    expect($$.HTMLSpec.isValidElementName('.name')).toBe(false)
    expect($$.HTMLSpec.isValidElementName('div')).toBe(true)
  })

  test('isVoidElementName()', () => {
    expect($$.HTMLSpec.isVoidElementName('br')).toBe(true)
    expect($$.HTMLSpec.isVoidElementName('div')).toBe(false)
  })

})
