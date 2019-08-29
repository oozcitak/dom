import $$ from './TestHelpers'

describe('String', function () {

  test('splitAStringOnASCIIWhitespace()', function () {
    const str = 'a b    c'
    const list = $$.infra.string.splitAStringOnASCIIWhitespace(str)
    expect(list.length).toBe(3)
    expect(list[0]).toBe('a')
    expect(list[1]).toBe('b')
    expect(list[2]).toBe('c')
  })

})