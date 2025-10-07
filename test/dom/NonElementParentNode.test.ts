import $$ from "../TestHelpers"

$$.suite('NonElementParentNode', () => {

  $$.test('getElementById() on document', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')

    if (!doc.documentElement)
      throw new Error("documentElement is null")

    const ele = doc.createElement('node_with_id')
    doc.documentElement.appendChild(ele)
    ele.id = 'uniq'

    $$.deepEqual(doc.getElementById('uniq'), ele)
    $$.deepEqual(doc.getElementById('none'), null)
  })

  $$.test('getElementById() on document fragment', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')
    const frag = doc.createDocumentFragment()

    const ele = doc.createElement('node_with_id')
    frag.appendChild(ele)
    ele.id = 'uniq'

    $$.deepEqual(frag.getElementById('uniq'), ele)
    $$.deepEqual(frag.getElementById('none'), null)
  })

})