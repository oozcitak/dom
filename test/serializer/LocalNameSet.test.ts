import $$ from "../TestHelpers"

$$.suite('LocalNameSet', () => {

  $$.test('set()', () => {
    const set = new $$.LocalNameSet()
    set.set("1", "a")
    set.set("1", "aa")
    set.set("2", "b")
    set.set("3", "c")
    set.set("3", "c")
    $$.deepEqual(set.has("1", "aa"), true)
    $$.deepEqual(set.has("3", "a"), false)
    $$.deepEqual(set.has("3", "c"), true)
  })

  $$.test('has()', () => {
    const set = new $$.LocalNameSet()
    set.set("1", "a")
    set.set("1", "aa")
    set.set("2", "b")
    set.set("3", "c")
    set.set("3", "c")
    $$.deepEqual(set.has("1", "a"), true)
    $$.deepEqual(set.has("1", "aa"), true)
    $$.deepEqual(set.has("2", "b"), true)
    $$.deepEqual(set.has("3", "c"), true)
  })

})