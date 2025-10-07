import $$ from "../TestHelpers"
import { dom } from "../../src/dom"

$$.suite('DOM', () => {

  $$.test('setFeatures()', () => {
    const features = dom.features
    dom.setFeatures(false)
    // resetting defaults all features
    dom.setFeatures()
    $$.deepEqual(dom.features.customElements, true)
    // init by object
    dom.setFeatures(false)
    dom.setFeatures({ customElements: true })
    $$.deepEqual(dom.features.customElements, true)
    dom.setFeatures(features)
  })

})