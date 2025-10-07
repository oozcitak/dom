import $$ from "../TestHelpers"

$$.suite('XMLSerializer', () => {

  $$.test('with namespace', () => {
    const doc = $$.dom.createDocument('ns', 'root')

    const serializer = new $$.XMLSerializer()
    $$.deepEqual(serializer.serializeToString(doc), '<root xmlns="ns"/>')
  })

  $$.test('without namespace', () => {
    const doc = $$.dom.createDocument(null, 'root')

    const serializer = new $$.XMLSerializer()
    $$.deepEqual(serializer.serializeToString(doc), '<root/>')
  })

})
