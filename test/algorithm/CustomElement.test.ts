import $$ from "../TestHelpers"
import {
  customElement_isValidCustomElementName, customElement_isValidElementName,
  customElement_isVoidElementName
} from "../../src/algorithm"

describe('CustomElement', () => {

  test('isValidCustomElementName()', () => {
    expect(customElement_isValidCustomElementName('.name')).toBe(false)
    expect(customElement_isValidCustomElementName('font-face')).toBe(false)
    expect(customElement_isValidCustomElementName('my-custom')).toBe(true)
  })

  test('isValidElementName()', () => {
    expect(customElement_isValidElementName('.name')).toBe(false)
    expect(customElement_isValidElementName('div')).toBe(true)
  })

  test('isVoidElementName()', () => {
    expect(customElement_isVoidElementName('br')).toBe(true)
    expect(customElement_isVoidElementName('div')).toBe(false)
  })

})