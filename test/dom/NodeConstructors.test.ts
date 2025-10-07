import $$ from "../TestHelpers"

$$.suite('Node Constructors', () => {

  const doc = $$.window.document

  $$.test('Comment constructor()', () => {
    const node = new $$.Comment()
    $$.deepEqual(node.ownerDocument, doc)
    $$.deepEqual(node.data, '')
    const node2 = new $$.Comment('test')
    $$.deepEqual(node2.ownerDocument, doc)
    $$.deepEqual(node2.data, 'test')
  })

  $$.test('DocumentFragment constructor()', () => {
    const node = new $$.DocumentFragment()
    $$.deepEqual(node.ownerDocument, doc)
  })

  $$.test('Document constructor()', () => {
    const node = new $$.Document()
    $$.deepEqual(node.ownerDocument, null)
  })

  $$.test('Text constructor()', () => {
    const node = new $$.Text()
    $$.deepEqual(node.ownerDocument, doc)
    $$.deepEqual(node.data, '')
    const node2 = new $$.Text('test')
    $$.deepEqual(node2.ownerDocument, doc)
    $$.deepEqual(node2.data, 'test')
  })

  $$.test('XMLDocument constructor()', () => {
    const node = new $$.XMLDocument()
    $$.deepEqual(node.ownerDocument, null)
  })

})