import $$ from "../TestHelpers"

describe('Guard', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  test('null checks', () => {
    expect($$.util.Guard.isNode(null)).toBe(false)
    expect($$.util.Guard.isDocumentNode(null)).toBe(false)
    expect($$.util.Guard.isDocumentTypeNode(null)).toBe(false)
    expect($$.util.Guard.isDocumentFragmentNode(null)).toBe(false)
    expect($$.util.Guard.isElementNode(null)).toBe(false)
    expect($$.util.Guard.isAttrNode(null)).toBe(false)
    expect($$.util.Guard.isCharacterDataNode(null)).toBe(false)
    expect($$.util.Guard.isTextNode(null)).toBe(false)
    expect($$.util.Guard.isExclusiveTextNode(null)).toBe(false)
    expect($$.util.Guard.isProcessingInstructionNode(null)).toBe(false)
    expect($$.util.Guard.isCommentNode(null)).toBe(false)
    expect($$.util.Guard.isCDATASectionNode(null)).toBe(false)
    expect($$.util.Guard.isRegisteredObserver(null)).toBe(false)
    expect($$.util.Guard.isTransientRegisteredObserver(null)).toBe(false)
  })

  test('document type guards', () => {
    expect($$.util.Guard.isNode(doc)).toBe(true)

    expect($$.util.Guard.isDocumentNode(doc)).toBe(true)
    expect($$.util.Guard.isDocumentTypeNode($$.dom.createDocumentType('root', 'pub', 'sys'))).toBe(true)
    expect($$.util.Guard.isDocumentFragmentNode(doc.createDocumentFragment())).toBe(true)
  })

  test('element and attribute type guards', () => {
    expect($$.util.Guard.isElementNode(doc.createElement('ele'))).toBe(true)
    expect($$.util.Guard.isAttrNode(doc.createAttribute('attr'))).toBe(true)
  })

  test('character data type guards', () => {
    expect($$.util.Guard.isCharacterDataNode(doc.createTextNode('value'))).toBe(true)
    expect($$.util.Guard.isCharacterDataNode(doc.createProcessingInstruction('target', 'value'))).toBe(true)
    expect($$.util.Guard.isCharacterDataNode(doc.createComment('value'))).toBe(true)
    expect($$.util.Guard.isCharacterDataNode(doc.createCDATASection('value'))).toBe(true)
  })

  test('text type guards', () => {
    expect($$.util.Guard.isTextNode(doc.createTextNode('value'))).toBe(true)
    expect($$.util.Guard.isTextNode(doc.createProcessingInstruction('target', 'value'))).toBe(false)
    expect($$.util.Guard.isTextNode(doc.createComment('value'))).toBe(false)
    expect($$.util.Guard.isTextNode(doc.createCDATASection('value'))).toBe(true)
  })

  test('exclusive text type guards', () => {
    expect($$.util.Guard.isExclusiveTextNode(doc.createTextNode('value'))).toBe(true)
    expect($$.util.Guard.isExclusiveTextNode(doc.createProcessingInstruction('target', 'value'))).toBe(false)
    expect($$.util.Guard.isExclusiveTextNode(doc.createComment('value'))).toBe(false)
    expect($$.util.Guard.isExclusiveTextNode(doc.createCDATASection('value'))).toBe(false)
  })

  test('specific character data type guards', () => {
    expect($$.util.Guard.isProcessingInstructionNode(doc.createProcessingInstruction('target', 'value'))).toBe(true)
    expect($$.util.Guard.isCommentNode(doc.createComment('value'))).toBe(true)
    expect($$.util.Guard.isCDATASectionNode(doc.createCDATASection('value'))).toBe(true)
  })

  test('MouseEvent', () => {
    const e = { screenX: 100, screenY: 100 }
    expect($$.util.Guard.isMouseEvent(e)).toBe(true)
  })

  test('isRegisteredObserver', () => {
    const e = { observer: new Object(), options: {} }
    expect($$.util.Guard.isRegisteredObserver(e)).toBe(true)
  })

  test('isTransientRegisteredObserver', () => {
    const e = { observer: new Object(), options: {} }
    const t = { observer: new Object(), options: {}, source: e }
    expect($$.util.Guard.isTransientRegisteredObserver(e)).toBe(false)
    expect($$.util.Guard.isTransientRegisteredObserver(t)).toBe(true)
  })

})