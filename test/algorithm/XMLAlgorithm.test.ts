import $$ from "../TestHelpers"
import {
  xml_isName, xml_isQName, xml_isLegalChar, xml_isPubidChar
} from "../../src/algorithm"

describe('XMLAlgorithm', () => {

  test('isName()', () => {
    expect(xml_isName('name')).toBe(true)
    expect(xml_isName('not a name')).toBe(false)
  })

  test('isName() - NameStartChar', () => {
    // ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | 
    // [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | 
    // [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | 
    // [#x10000-#xEFFFF]
    $$.charRange(0, 57, (c => expect(xml_isName(c)).toBe(false)))
    expect(xml_isName(':')).toBe(true) // 58
    $$.charRange(59, 64, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange('A', 'Z', (c => expect(xml_isName(c)).toBe(true))) // 65-90
    $$.charRange(91, 94, (c => expect(xml_isName(c)).toBe(false)))
    expect(xml_isName('_')).toBe(true)  // 95
    expect(xml_isName('`')).toBe(false) // 96
    $$.charRange('a', 'z', (c => expect(xml_isName(c)).toBe(true))) // 97-122
    $$.charRange(0x7B, 0xBF, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0xC0, 0xD6, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0xD7, 0xD7, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0xD8, 0xF6, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0xF7, 0xF7, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0xF8, 0x2FF, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0x300, 0x36F, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0x370, 0x37D, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0x37E, 0x37E, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0x37F, 0x1FFF, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0x2000, 0x200B, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0x200C, 0x200D, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0x200E, 0x206F, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0x2070, 0x218F, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0x2190, 0x2BFF, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0x2C00, 0x2FEF, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0x2FF0, 0x3000, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0x3001, 0xD7FF, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0xD800, 0xF8FF, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0xF900, 0xFDCF, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0xFDD0, 0xFDEF, (c => expect(xml_isName(c)).toBe(false)))
    $$.charRange(0xFDF0, 0xFFFD, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => expect(xml_isName(c)).toBe(false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0xEFFFF, (c => expect(xml_isName(c)).toBe(true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0xEFF0F, 0xEFFFF, (c => expect(xml_isName(c)).toBe(true)))
    $$.charRange(0xF0000, 0xF00F0, (c => expect(xml_isName(c)).toBe(false)))
  })

  test('isName() - NameChar', () => {
    // ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | 
    // [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | 
    // [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | 
    // [#x10000-#xEFFFF] | 
    // "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
    $$.charRange(0, 44, (c => expect(xml_isName('A' + c)).toBe(false)))
    expect(xml_isName('A-')).toBe(true) // 45
    expect(xml_isName('A.')).toBe(true) // 46
    expect(xml_isName('A/')).toBe(false) // 47
    $$.charRange('0', '9', (c => expect(xml_isName('A' + c)).toBe(true))) // 48-57
    expect(xml_isName('A:')).toBe(true) // 58
    $$.charRange(59, 64, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange('A', 'Z', (c => expect(xml_isName('A' + c)).toBe(true))) // 65-90
    $$.charRange(91, 94, (c => expect(xml_isName('A' + c)).toBe(false)))
    expect(xml_isName('A_')).toBe(true)  // 95
    expect(xml_isName('A`')).toBe(false) // 96
    $$.charRange('a', 'z', (c => expect(xml_isName('A' + c)).toBe(true))) // 97-122
    $$.charRange(0x7B, 0xB6, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0xB7, 0xB7, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xB8, 0xBF, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0xC0, 0xD6, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xD7, 0xD7, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0xD8, 0xF6, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xF7, 0xF7, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0xF8, 0x2FF, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x300, 0x36F, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x370, 0x37D, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x37E, 0x37E, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0x37F, 0x1FFF, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x2000, 0x200B, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0x200C, 0x200D, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x200E, 0x203D, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0x203F, 0x2040, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x2041, 0x206F, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0x2070, 0x218F, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x2190, 0x2BFF, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0x2C00, 0x2FEF, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0x2FF0, 0x3000, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0x3001, 0xD7FF, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xD800, 0xF8FF, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0xF900, 0xFDCF, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xFDD0, 0xFDEF, (c => expect(xml_isName('A' + c)).toBe(false)))
    $$.charRange(0xFDF0, 0xFFFD, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => expect(xml_isName('A' + c)).toBe(false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0xEFFFF, (c => expect(xml_isName('A' + c)).toBe(true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xEFF0F, 0xEFFFF, (c => expect(xml_isName('A' + c)).toBe(true)))
    $$.charRange(0xF0000, 0xF00F0, (c => expect(xml_isName('A' + c)).toBe(false)))
  })

  test('isQName()', () => {
    expect(xml_isQName('prefix:name')).toBe(true)
    expect(xml_isQName('not_a_qname:')).toBe(false)
    expect(xml_isQName(':not_a_qname')).toBe(false)
    expect(xml_isQName('not:a:qname')).toBe(false)

    $$.charRange(0, 57, (c => expect(xml_isQName(c)).toBe(false)))
    expect(xml_isQName(':')).toBe(false) // 58
    $$.charRange(59, 64, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange('A', 'Z', (c => expect(xml_isQName(c)).toBe(true))) // 65-90
    $$.charRange(91, 94, (c => expect(xml_isQName(c)).toBe(false)))
    expect(xml_isQName('_')).toBe(true)  // 95
    expect(xml_isQName('`')).toBe(false) // 96
    $$.charRange('a', 'z', (c => expect(xml_isQName(c)).toBe(true))) // 97-122
    $$.charRange(0x7B, 0xBF, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0xC0, 0xD6, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0xD7, 0xD7, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0xD8, 0xF6, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0xF7, 0xF7, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0xF8, 0x2FF, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0x300, 0x36F, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0x370, 0x37D, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0x37E, 0x37E, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0x37F, 0x1FFF, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0x2000, 0x200B, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0x200C, 0x200D, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0x200E, 0x206F, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0x2070, 0x218F, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0x2190, 0x2BFF, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0x2C00, 0x2FEF, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0x2FF0, 0x3000, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0x3001, 0xD7FF, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0xD800, 0xF8FF, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0xF900, 0xFDCF, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0xFDD0, 0xFDEF, (c => expect(xml_isQName(c)).toBe(false)))
    $$.charRange(0xFDF0, 0xFFFD, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => expect(xml_isQName(c)).toBe(false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0xEFFFF, (c => expect(xml_isQName(c)).toBe(true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0xEFF0F, 0xEFFFF, (c => expect(xml_isQName(c)).toBe(true)))
    $$.charRange(0xF0000, 0xF00F0, (c => expect(xml_isQName(c)).toBe(false)))    
  })

  test('isLegalChar()', () => {
    // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
    $$.charRange(0x0, 0x8, (c => expect(xml_isLegalChar(c)).toBe(false)))
    $$.charRange(0xA, 0xA, (c => expect(xml_isLegalChar(c)).toBe(true)))
    $$.charRange(0xB, 0xC, (c => expect(xml_isLegalChar(c)).toBe(false)))
    $$.charRange(0xD, 0xD, (c => expect(xml_isLegalChar(c)).toBe(true)))
    $$.charRange(0xE, 0x1F, (c => expect(xml_isLegalChar(c)).toBe(false)))
    $$.charRange(0x20, 0xD7FF, (c => expect(xml_isLegalChar(c)).toBe(true)))
    $$.charRange(0xD800, 0xDFFF, (c => expect(xml_isLegalChar(c)).toBe(false)))
    $$.charRange(0xE000, 0xFFFD, (c => expect(xml_isLegalChar(c)).toBe(true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => expect(xml_isLegalChar(c)).toBe(false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0x10FFFF, (c => expect(xml_isLegalChar(c)).toBe(true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => expect(xml_isLegalChar(c)).toBe(true)))
    $$.charRange(0x10FF0F, 0x10FFFF, (c => expect(xml_isLegalChar(c)).toBe(true)))
  })

  test('isPubidChar()', () => {
    // #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]
    $$.charRange(0x0, 0x9, (c => expect(xml_isPubidChar(c)).toBe(false)))
    $$.charRange(0xA, 0xA, (c => expect(xml_isPubidChar(c)).toBe(true)))
    $$.charRange(0xB, 0xC, (c => expect(xml_isPubidChar(c)).toBe(false)))
    $$.charRange(0xD, 0xD, (c => expect(xml_isPubidChar(c)).toBe(true)))
    $$.charRange(0xE, 0x1F, (c => expect(xml_isPubidChar(c)).toBe(false)))
    $$.charRange(0x20, 0x21, (c => expect(xml_isPubidChar(c)).toBe(true)))
    $$.charRange(0x22, 0x22, (c => expect(xml_isPubidChar(c)).toBe(false)))
    $$.charRange(0x20, 0x21, (c => expect(xml_isPubidChar(c)).toBe(true)))
    $$.charRange('#', '%', (c => expect(xml_isPubidChar(c)).toBe(true))) // 0x23-0x25
    expect(xml_isPubidChar('&')).toBe(false) // 0x26
    $$.charRange('\'', ';', (c => expect(xml_isPubidChar(c)).toBe(true))) // 0x27-0x3B ['()*+,-./] | [0-9] | [:;]
    expect(xml_isPubidChar('<')).toBe(false) // 0x3C
    expect(xml_isPubidChar('=')).toBe(true) // 0x3D
    expect(xml_isPubidChar('>')).toBe(false) // 0x3E
    expect(xml_isPubidChar('?')).toBe(true) // 0x3F
    expect(xml_isPubidChar('@')).toBe(true) // 0x40
    $$.charRange('A', 'Z', (c => expect(xml_isPubidChar(c)).toBe(true))) // 65-90
    $$.charRange(91, 94, (c => expect(xml_isPubidChar(c)).toBe(false)))
    expect(xml_isPubidChar('_')).toBe(true) // 95
    $$.charRange('a', 'z', (c => expect(xml_isPubidChar(c)).toBe(true))) // 97-122
    // The last test takes too long to complete
    // $$.charRange(0x7B, 0x10FFFF, (c => expect(xml_isPubidChar(c)).toBe(false)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x7B, 0x8B, (c => expect(xml_isPubidChar(c)).toBe(false)))
    $$.charRange(0x10FF0F, 0x10FFFF, (c => expect(xml_isPubidChar(c)).toBe(false)))
  })

})
