import $$ from '../TestHelpers'

describe('CustomElement', () => {

  test('isValidCustomElementName()', () => {
    expect($$.algo.customElement.isValidCustomElementName('.name')).toBe(false)
    expect($$.algo.customElement.isValidCustomElementName('font-face')).toBe(false)
    expect($$.algo.customElement.isValidCustomElementName('my-custom')).toBe(true)
  })

  test('isValidElementName()', () => {
    expect($$.algo.customElement.isValidElementName('.name')).toBe(false)
    expect($$.algo.customElement.isValidElementName('div')).toBe(true)
  })

  test('isVoidElementName()', () => {
    expect($$.algo.customElement.isVoidElementName('br')).toBe(true)
    expect($$.algo.customElement.isVoidElementName('div')).toBe(false)
  })

})