import $$ from './TestHelpers'

describe('Guard', function () {

  const doc = $$.dom.createDocument('ns', 'root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  test('null checks', function () {
    expect($$.Guard.isNode(null)).toBeFalsy()
    expect($$.Guard.isDocumentNode(null)).toBeFalsy()
    expect($$.Guard.isDocumentTypeNode(null)).toBeFalsy()
    expect($$.Guard.isDocumentFragmentNode(null)).toBeFalsy()
    expect($$.Guard.isElementNode(null)).toBeFalsy()
    expect($$.Guard.isAttrNode(null)).toBeFalsy()
    expect($$.Guard.isCharacterDataNode(null)).toBeFalsy()
    expect($$.Guard.isTextNode(null)).toBeFalsy()
    expect($$.Guard.isExclusiveTextNode(null)).toBeFalsy()
    expect($$.Guard.isProcessingInstructionNode(null)).toBeFalsy()
    expect($$.Guard.isCommentNode(null)).toBeFalsy()
    expect($$.Guard.isCDATASectionNode(null)).toBeFalsy()
    expect($$.Guard.isRegisteredObserver(null)).toBeFalsy()
    expect($$.Guard.isTransientRegisteredObserver(null)).toBeFalsy()
  })

  test('document type guards', function () {
    expect($$.Guard.isNode(doc)).toBeTruthy()

    expect($$.Guard.isDocumentNode(doc)).toBeTruthy()
    expect($$.Guard.isDocumentTypeNode($$.dom.createDocumentType('root', 'pub', 'sys'))).toBeTruthy()
    expect($$.Guard.isDocumentFragmentNode(doc.createDocumentFragment())).toBeTruthy()
  })

  test('element and attribute type guards', function () {
    expect($$.Guard.isElementNode(doc.createElement('ele'))).toBeTruthy()
    expect($$.Guard.isAttrNode(doc.createAttribute('attr'))).toBeTruthy()
  })

  test('character data type guards', function () {
    expect($$.Guard.isCharacterDataNode(doc.createTextNode('value'))).toBeTruthy()
    expect($$.Guard.isCharacterDataNode(doc.createProcessingInstruction('target', 'value'))).toBeTruthy()
    expect($$.Guard.isCharacterDataNode(doc.createComment('value'))).toBeTruthy()
    expect($$.Guard.isCharacterDataNode(doc.createCDATASection('value'))).toBeTruthy()
  })

  test('text type guards', function () {
    expect($$.Guard.isTextNode(doc.createTextNode('value'))).toBeTruthy()
    expect($$.Guard.isTextNode(doc.createProcessingInstruction('target', 'value'))).toBeFalsy()
    expect($$.Guard.isTextNode(doc.createComment('value'))).toBeFalsy()
    expect($$.Guard.isTextNode(doc.createCDATASection('value'))).toBeTruthy()
  })

  test('exclusive text type guards', function () {
    expect($$.Guard.isExclusiveTextNode(doc.createTextNode('value'))).toBeTruthy()
    expect($$.Guard.isExclusiveTextNode(doc.createProcessingInstruction('target', 'value'))).toBeFalsy()
    expect($$.Guard.isExclusiveTextNode(doc.createComment('value'))).toBeFalsy()
    expect($$.Guard.isExclusiveTextNode(doc.createCDATASection('value'))).toBeFalsy()
  })

  test('specific character data type guards', function () {
    expect($$.Guard.isProcessingInstructionNode(doc.createProcessingInstruction('target', 'value'))).toBeTruthy()
    expect($$.Guard.isCommentNode(doc.createComment('value'))).toBeTruthy()
    expect($$.Guard.isCDATASectionNode(doc.createCDATASection('value'))).toBeTruthy()
  })

})