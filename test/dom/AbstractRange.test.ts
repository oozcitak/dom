import $$ from '../TestHelpers'

describe('AbstractRange', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  test('_startNode, _endNode', () => {
    const range = doc.createRange() as any
    expect(range._startNode).toBe(doc)
    expect(range._startOffset).toBe(0)
    expect(range._endNode).toBe(doc)
    expect(range._endOffset).toBe(0)
    expect(range._collapsed).toBe(true)
  })

  test('startContainer, endContainer', () => {
    const range = doc.createRange()
    expect(range.startContainer).toBe(doc)
    expect(range.startOffset).toBe(0)
    expect(range.endContainer).toBe(doc)
    expect(range.endOffset).toBe(0)
    expect(range.collapsed).toBe(true)
  })

})