import $$ from "../TestHelpers"

$$.suite('Guard', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  $$.test('null checks', () => {
    $$.deepEqual($$.util.Guard.isNode(null), false)
    $$.deepEqual($$.util.Guard.isDocumentNode(null), false)
    $$.deepEqual($$.util.Guard.isDocumentTypeNode(null), false)
    $$.deepEqual($$.util.Guard.isDocumentFragmentNode(null), false)
    $$.deepEqual($$.util.Guard.isElementNode(null), false)
    $$.deepEqual($$.util.Guard.isAttrNode(null), false)
    $$.deepEqual($$.util.Guard.isCharacterDataNode(null), false)
    $$.deepEqual($$.util.Guard.isTextNode(null), false)
    $$.deepEqual($$.util.Guard.isExclusiveTextNode(null), false)
    $$.deepEqual($$.util.Guard.isProcessingInstructionNode(null), false)
    $$.deepEqual($$.util.Guard.isCommentNode(null), false)
    $$.deepEqual($$.util.Guard.isCDATASectionNode(null), false)
    $$.deepEqual($$.util.Guard.isRegisteredObserver(null), false)
    $$.deepEqual($$.util.Guard.isTransientRegisteredObserver(null), false)
  })

  $$.test('document type guards', () => {
    $$.deepEqual($$.util.Guard.isNode(doc), true)

    $$.deepEqual($$.util.Guard.isDocumentNode(doc), true)
    $$.deepEqual($$.util.Guard.isDocumentTypeNode($$.dom.createDocumentType('root', 'pub', 'sys')), true)
    $$.deepEqual($$.util.Guard.isDocumentFragmentNode(doc.createDocumentFragment()), true)
  })

  $$.test('element and attribute type guards', () => {
    $$.deepEqual($$.util.Guard.isElementNode(doc.createElement('ele')), true)
    $$.deepEqual($$.util.Guard.isAttrNode(doc.createAttribute('attr')), true)
  })

  $$.test('character data type guards', () => {
    $$.deepEqual($$.util.Guard.isCharacterDataNode(doc.createTextNode('value')), true)
    $$.deepEqual($$.util.Guard.isCharacterDataNode(doc.createProcessingInstruction('target', 'value')), true)
    $$.deepEqual($$.util.Guard.isCharacterDataNode(doc.createComment('value')), true)
    $$.deepEqual($$.util.Guard.isCharacterDataNode(doc.createCDATASection('value')), true)
  })

  $$.test('text type guards', () => {
    $$.deepEqual($$.util.Guard.isTextNode(doc.createTextNode('value')), true)
    $$.deepEqual($$.util.Guard.isTextNode(doc.createProcessingInstruction('target', 'value')), false)
    $$.deepEqual($$.util.Guard.isTextNode(doc.createComment('value')), false)
    $$.deepEqual($$.util.Guard.isTextNode(doc.createCDATASection('value')), true)
  })

  $$.test('exclusive text type guards', () => {
    $$.deepEqual($$.util.Guard.isExclusiveTextNode(doc.createTextNode('value')), true)
    $$.deepEqual($$.util.Guard.isExclusiveTextNode(doc.createProcessingInstruction('target', 'value')), false)
    $$.deepEqual($$.util.Guard.isExclusiveTextNode(doc.createComment('value')), false)
    $$.deepEqual($$.util.Guard.isExclusiveTextNode(doc.createCDATASection('value')), false)
  })

  $$.test('specific character data type guards', () => {
    $$.deepEqual($$.util.Guard.isProcessingInstructionNode(doc.createProcessingInstruction('target', 'value')), true)
    $$.deepEqual($$.util.Guard.isCommentNode(doc.createComment('value')), true)
    $$.deepEqual($$.util.Guard.isCDATASectionNode(doc.createCDATASection('value')), true)
  })

  $$.test('MouseEvent', () => {
    const e = { screenX: 100, screenY: 100 }
    $$.deepEqual($$.util.Guard.isMouseEvent(e), true)
  })

  $$.test('isRegisteredObserver', () => {
    const e = { observer: new Object(), options: {} }
    $$.deepEqual($$.util.Guard.isRegisteredObserver(e), true)
  })

  $$.test('isTransientRegisteredObserver', () => {
    const e = { observer: new Object(), options: {} }
    const t = { observer: new Object(), options: {}, source: e }
    $$.deepEqual($$.util.Guard.isTransientRegisteredObserver(e), false)
    $$.deepEqual($$.util.Guard.isTransientRegisteredObserver(t), true)
  })

})