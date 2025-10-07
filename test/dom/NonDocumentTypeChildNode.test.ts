import $$ from "../TestHelpers"

$$.suite('NonDocumentTypeChildNode', () => {

  const doc = $$.dom.createDocument('myns', 'n:root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  const child1 = doc.createElement('child1')
  const child2 = doc.createTextNode('child2')
  const child3 = doc.createElement('child3')
  const child4 = doc.createTextNode('child4')
  de.appendChild(child1)
  de.appendChild(child2)
  de.appendChild(child3)
  de.appendChild(child4)

  $$.test('previousElementSibling', () => {
    $$.deepEqual(child4.previousElementSibling, child3)
    $$.deepEqual(child3.previousElementSibling, child1)
    $$.deepEqual(child1.previousElementSibling, null)
  })

  $$.test('nextElementSibling', () => {
    $$.deepEqual(child1.nextElementSibling, child3)
    $$.deepEqual(child3.nextElementSibling, null)
  })

})