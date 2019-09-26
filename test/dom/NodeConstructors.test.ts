import $$ from './TestHelpers'

describe('Node Constructors', () => {

  const doc = $$.window.document

  test('Comment constructor()', () => {
    const node = new $$.Comment()
    expect(node.ownerDocument).toBe(doc)
    expect(node.data).toBe('')
    const node2 = new $$.Comment('test')
    expect(node2.ownerDocument).toBe(doc)
    expect(node2.data).toBe('test')
  })

  test('DocumentFragment constructor()', () => {
    const node = new $$.DocumentFragment()
    expect(node.ownerDocument).toBe(doc)
  })

  test('Document constructor()', () => {
    const node = new $$.Document()
    expect(node.ownerDocument).toBeNull()
  })

  test('Text constructor()', () => {
    const node = new $$.Text()
    expect(node.ownerDocument).toBe(doc)
    expect(node.data).toBe('')
    const node2 = new $$.Text('test')
    expect(node2.ownerDocument).toBe(doc)
    expect(node2.data).toBe('test')
  })

  test('XMLDocument constructor()', () => {
    const node = new $$.XMLDocument()
    expect(node.ownerDocument).toBeNull()
  })

})