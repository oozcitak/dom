import $$ from "../TestHelpers"

$$.suite('Issues', () => {

  $$.test('DOM textContent returns encoded text #7', () => {
    // https://github.com/oozcitak/xmlbuilder2/issues/98
    const xmlStr = $$.t`
    <description>I'm &lt;b&gt;bold&lt;/b&gt;</description>
    `

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      description
        # I'm <b>bold</b>
      `)
  })

})