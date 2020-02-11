import { dom } from "../../src/dom"

describe('DOM', () => {

  test('setFeatures()', () => {
    const features = dom.features
    dom.setFeatures(false)
    // resetting defaults all features
    dom.setFeatures()
    expect(dom.features.customElements).toBe(true)
    // init by object
    dom.setFeatures(false)
    dom.setFeatures({ customElements: true })
    expect(dom.features.customElements).toBe(true)
    dom.setFeatures(features)
  })

})