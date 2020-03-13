import $$ from "../TestHelpers"

describe('DOMParser', () => {

  test('HTML parser not yet supported', () => {
    const parser = new $$.DOMParser()
    expect(() => parser.parseFromString('', "text/html")).toThrow()
  })

  test('XML parser', () => {
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString('<root/>', "application/xml")
    
    expect($$.printTree(doc)).toBe($$.t`
      root
      `)
  })

})