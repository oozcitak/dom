import $$ from "../TestHelpers"
import {
  customElement_isValidCustomElementName, customElement_isValidElementName,
  customElement_isVoidElementName
} from "../../src/algorithm"

$$.suite('CustomElement', () => {

  $$.test('isValidCustomElementName()', () => {
    $$.deepEqual(customElement_isValidCustomElementName('.name'), false)
    $$.deepEqual(customElement_isValidCustomElementName('font-face'), false)
    $$.deepEqual(customElement_isValidCustomElementName('my-custom'), true)
  })

  $$.test('isValidElementName()', () => {
    $$.deepEqual(customElement_isValidElementName('.name'), false)
    $$.deepEqual(customElement_isValidElementName('div'), true)
  })

  $$.test('isVoidElementName()', () => {
    $$.deepEqual(customElement_isVoidElementName('br'), true)
    $$.deepEqual(customElement_isVoidElementName('div'), false)
  })

})