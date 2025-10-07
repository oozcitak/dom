import $$ from "../TestHelpers"

$$.suite('Issues', () => {

  $$.test('DOM textContent returns encoded text #7', () => {
    // https://github.com/oozcitak/xmlbuilder2/issues/88
    const xmlStr = $$.t`
    <?xml version="1.0" encoding="utf-8"?>
    <root>
      <text>&lt;data&gt;</text>
      <text><![CDATA[<data>]]></text>
    </root>
    `
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      root
        text
          # <data>
        text
          $ <data>
      `)
  })

})