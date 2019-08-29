import $$ from '../TestHelpers'

describe('HTMLSpec', function () {

  test('isValidCustomElementName()', function () {
    expect($$.HTMLSpec.isValidCustomElementName('.name')).toBeFalsy()
    expect($$.HTMLSpec.isValidCustomElementName('font-face')).toBeFalsy()
    expect($$.HTMLSpec.isValidCustomElementName('my-custom')).toBeTruthy()
  })

  test('isValidElementName()', function () {
    expect($$.HTMLSpec.isValidElementName('.name')).toBeFalsy()
    expect($$.HTMLSpec.isValidElementName('div')).toBeTruthy()
  })

  test('isVoidElementName()', function () {
    expect($$.HTMLSpec.isVoidElementName('br')).toBeTruthy()
    expect($$.HTMLSpec.isVoidElementName('div')).toBeFalsy()
  })

})
