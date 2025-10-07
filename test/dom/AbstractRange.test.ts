import $$ from "../TestHelpers"

$$.suite('AbstractRange', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  $$.test('_startNode, _endNode', () => {
    const range = doc.createRange() as any
    $$.deepEqual(range._startNode, doc)
    $$.deepEqual(range._startOffset, 0)
    $$.deepEqual(range._endNode, doc)
    $$.deepEqual(range._endOffset, 0)
    $$.deepEqual(range._collapsed, true)
  })

  $$.test('startContainer, endContainer', () => {
    const range = doc.createRange()
    $$.deepEqual(range.startContainer, doc)
    $$.deepEqual(range.startOffset, 0)
    $$.deepEqual(range.endContainer, doc)
    $$.deepEqual(range.endOffset, 0)
    $$.deepEqual(range.collapsed, true)
  })

})