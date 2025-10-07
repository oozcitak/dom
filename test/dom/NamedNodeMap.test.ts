import $$ from "../TestHelpers"

$$.suite('NamedNodeMap', () => {

  const doc = $$.dom.createDocument('myns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const ele = doc.createElement('tagged')
  doc.documentElement.appendChild(ele)
  ele.setAttribute('att', 'val')
  ele.setAttributeNS('myns', 'd:att2', 'val2')
  const elex = doc.createElement('tagged2')
  doc.documentElement.appendChild(elex)
  elex.setAttribute('att2', 'val2')
  const list = ele.attributes

  $$.test('length', () => {
    $$.deepEqual(list.length, 2)
  })

  $$.test('item()', () => {
    const attr1 = list.item(0)
    $$.notDeepEqual(attr1, null)
    if (attr1) {
      $$.deepEqual(attr1.name, 'att')
      $$.deepEqual(attr1.value, 'val')
    }
    const attr2 = list.item(1)
    $$.notDeepEqual(attr2, null)
    if (attr2) {
      $$.deepEqual(attr2.name, 'd:att2')
      $$.deepEqual(attr2.value, 'val2')
    }
    $$.deepEqual(list.item(-1), null)
  })

  $$.test('getNamedItem()', () => {
    let attr = list.getNamedItem('att')
    $$.notDeepEqual(attr, null)
    if (attr) {
      $$.deepEqual(attr.value, 'val')
    }
  })

  $$.test('getNamedItemNS()', () => {
    let attr = list.getNamedItemNS('myns', 'att2')
    $$.notDeepEqual(attr, null)
    if (attr) {
      $$.deepEqual(attr.value, 'val2')
    }
  })

  $$.test('setNamedItem()', () => {
    let attr = doc.createAttribute('att')
    attr.value = 'newval'
    let oldattr = list.setNamedItem(attr)
    $$.notDeepEqual(oldattr, null)
    if (oldattr) {
      $$.deepEqual(oldattr.value, 'val')
    }
    let newattr = list.getNamedItem('att')
    $$.notDeepEqual(newattr, null)
    if (newattr) {
      $$.deepEqual(newattr.value, 'newval')
    }
  })

  $$.test('setNamedItemNS()', () => {
    let attr = doc.createAttributeNS('myns', 'd:att2')
    attr.value = 'newval'
    let oldattr = list.setNamedItemNS(attr)
    if (!oldattr)
      throw new Error("Atribute is null")
    $$.deepEqual(oldattr.value, 'val2')
    $$.deepEqual(list.setNamedItemNS(attr), attr)
    let newattr = list.getNamedItemNS('myns', 'att2')
    if (!newattr)
      throw new Error("Atribute is null")
    $$.deepEqual(newattr.value, 'newval')
    const attx = elex.attributes.item(0)
    if (!attx)
      throw new Error("Atribute is null")
    $$.throws(() => list.setNamedItemNS(attx))
  })

  $$.test('removeNamedItem()', () => {
    let oldattr = list.removeNamedItem('att')
    $$.notDeepEqual(oldattr, null)
    if (oldattr) {
      $$.deepEqual(oldattr.value, 'newval')
    }
    $$.deepEqual(list.getNamedItem('att'), null)
    $$.throws(() => list.removeNamedItem('none'))
  })

  $$.test('removeNamedItemNS()', () => {
    let oldattr = list.removeNamedItemNS('myns', 'att2')
    $$.notDeepEqual(oldattr, null)
    if (oldattr) {
      $$.deepEqual(oldattr.value, 'newval')
    }
    $$.deepEqual(list.getNamedItemNS('myns', 'att2'), null)
    $$.throws(() => list.removeNamedItemNS('none', 'none'))
  })

  $$.test('iteration', () => {
    ele.setAttribute('att', 'val')
    ele.setAttributeNS('myns', 'd:att2', 'val2')

    let names = ''
    let values = ''
    for (const att of list) {
      names += '_' + att.name
      values += '_' + att.value
    }
    $$.deepEqual(names, '_att_d:att2')
    $$.deepEqual(values, '_val_val2')
  })

})