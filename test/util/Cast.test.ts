import $$ from "../TestHelpers"

$$.suite('Cast', () => {

  const ele = $$.newDoc

  $$.test('asNode()', () => {
    $$.deepEqual($$.util.Cast.asNode(ele), ele)
    $$.throws(() => $$.util.Cast.asNode("not a node"))
  })

})