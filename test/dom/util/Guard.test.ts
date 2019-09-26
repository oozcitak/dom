import $$ from './TestHelpers'

describe('Guard', () => {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  test('null checks', () => {
    expect($$.Guard.isNode(null)).toBe(false)
    expect($$.Guard.isDocumentNode(null)).toBe(false)
    expect($$.Guard.isDocumentTypeNode(null)).toBe(false)
    expect($$.Guard.isDocumentFragmentNode(null)).toBe(false)
    expect($$.Guard.isElementNode(null)).toBe(false)
    expect($$.Guard.isAttrNode(null)).toBe(false)
    expect($$.Guard.isCharacterDataNode(null)).toBe(false)
    expect($$.Guard.isTextNode(null)).toBe(false)
    expect($$.Guard.isExclusiveTextNode(null)).toBe(false)
    expect($$.Guard.isProcessingInstructionNode(null)).toBe(false)
    expect($$.Guard.isCommentNode(null)).toBe(false)
    expect($$.Guard.isCDATASectionNode(null)).toBe(false)
    expect($$.Guard.isRegisteredObserver(null)).toBe(false)
    expect($$.Guard.isTransientRegisteredObserver(null)).toBe(false)
  })

  test('document type guards', () => {
    expect($$.Guard.isNode(doc)).toBe(true)

    expect($$.Guard.isDocumentNode(doc)).toBe(true)
    expect($$.Guard.isDocumentTypeNode($$.dom.createDocumentType('root', 'pub', 'sys'))).toBe(true)
    expect($$.Guard.isDocumentFragmentNode(doc.createDocumentFragment())).toBe(true)
  })

  test('element and attribute type guards', () => {
    expect($$.Guard.isElementNode(doc.createElement('ele'))).toBe(true)
    expect($$.Guard.isAttrNode(doc.createAttribute('attr'))).toBe(true)
  })

  test('character data type guards', () => {
    expect($$.Guard.isCharacterDataNode(doc.createTextNode('value'))).toBe(true)
    expect($$.Guard.isCharacterDataNode(doc.createProcessingInstruction('target', 'value'))).toBe(true)
    expect($$.Guard.isCharacterDataNode(doc.createComment('value'))).toBe(true)
    expect($$.Guard.isCharacterDataNode(doc.createCDATASection('value'))).toBe(true)
  })

  test('text type guards', () => {
    expect($$.Guard.isTextNode(doc.createTextNode('value'))).toBe(true)
    expect($$.Guard.isTextNode(doc.createProcessingInstruction('target', 'value'))).toBe(false)
    expect($$.Guard.isTextNode(doc.createComment('value'))).toBe(false)
    expect($$.Guard.isTextNode(doc.createCDATASection('value'))).toBe(true)
  })

  test('exclusive text type guards', () => {
    expect($$.Guard.isExclusiveTextNode(doc.createTextNode('value'))).toBe(true)
    expect($$.Guard.isExclusiveTextNode(doc.createProcessingInstruction('target', 'value'))).toBe(false)
    expect($$.Guard.isExclusiveTextNode(doc.createComment('value'))).toBe(false)
    expect($$.Guard.isExclusiveTextNode(doc.createCDATASection('value'))).toBe(false)
  })

  test('specific character data type guards', () => {
    expect($$.Guard.isProcessingInstructionNode(doc.createProcessingInstruction('target', 'value'))).toBe(true)
    expect($$.Guard.isCommentNode(doc.createComment('value'))).toBe(true)
    expect($$.Guard.isCDATASectionNode(doc.createCDATASection('value'))).toBe(true)
  })

})