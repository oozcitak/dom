import $$ from "../TestHelpers"

describe('XMLSerializer', () => {

  test('with namespace', () => {
    const doc = $$.dom.createDocument('ns', 'root')

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe('<root xmlns="ns"/>')
  })

  test('without namespace', () => {
    const doc = $$.dom.createDocument(null, 'root')

    const serializer = new $$.XMLSerializer()
    expect(serializer.serializeToString(doc)).toBe('<root/>')
  })

})
