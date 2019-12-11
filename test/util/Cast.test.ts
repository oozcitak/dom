import $$ from "../TestHelpers"

describe('Cast', () => {

  const ele = $$.newDoc

  test('asNode()', () => {
    expect($$.util.Cast.asNode(ele)).toBe(ele)
    expect(() => $$.util.Cast.asNode("not a node")).toThrow()
  })

})