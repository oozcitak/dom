import $$ from "../TestHelpers"

$$.suite('Issues', () => {

  $$.test('DOM textContent returns encoded text #7', () => {
    // https://github.com/oozcitak/xmlbuilder2/issues/82
    const xmlStr = $$.t`
    <?xml version="1.0" encoding="utf-8"?>
    <root>&lt;this&gt; test &lt;/this&gt;</root>
    `
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      root
        # <this> test </this>
      `)
  })

})