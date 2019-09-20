import $$ from '../TestHelpers'

describe('HTMLSpec', function () {

  test('isValidCustomElementName()', function () {
    expect($$.HTMLSpec.isValidCustomElementName('.name')).toBe(false)
    expect($$.HTMLSpec.isValidCustomElementName('font-face')).toBe(false)
    expect($$.HTMLSpec.isValidCustomElementName('my-custom')).toBe(true)
  })

  test('isValidElementName()', function () {
    expect($$.HTMLSpec.isValidElementName('.name')).toBe(false)
    expect($$.HTMLSpec.isValidElementName('div')).toBe(true)
  })

  test('isVoidElementName()', function () {
    expect($$.HTMLSpec.isVoidElementName('br')).toBe(true)
    expect($$.HTMLSpec.isVoidElementName('div')).toBe(false)
  })

})
