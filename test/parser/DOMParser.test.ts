import $$ from "../TestHelpers"

$$.suite('DOMParser', () => {

  $$.test('HTML parser not yet supported', () => {
    const parser = new $$.DOMParser()
    $$.throws(() => parser.parseFromString('', "text/html"))
  })

  $$.test('XML parser', () => {
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString('<root/>', "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      root
      `)
  })

})