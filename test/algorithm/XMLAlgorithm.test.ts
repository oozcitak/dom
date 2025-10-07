import $$ from "../TestHelpers"
import {
  xml_isName, xml_isQName, xml_isLegalChar, xml_isPubidChar
} from "../../src/algorithm"

$$.suite('XMLAlgorithm', () => {

  $$.test('isName()', () => {
    $$.deepEqual(xml_isName('name'), true)
    $$.deepEqual(xml_isName('not a name'), false)
  })

  $$.test('isName() - NameStartChar', () => {
    // ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] |
    // [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] |
    // [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] |
    // [#x10000-#xEFFFF]
    $$.charRange(0, 57, (c => $$.deepEqual(xml_isName(c), false)))
    $$.deepEqual(xml_isName(':'), true) // 58
    $$.charRange(59, 64, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange('A', 'Z', (c => $$.deepEqual(xml_isName(c), true))) // 65-90
    $$.charRange(91, 94, (c => $$.deepEqual(xml_isName(c), false)))
    $$.deepEqual(xml_isName('_'), true)  // 95
    $$.deepEqual(xml_isName('`'), false) // 96
    $$.charRange('a', 'z', (c => $$.deepEqual(xml_isName(c), true))) // 97-122
    $$.charRange(0x7B, 0xBF, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0xC0, 0xD6, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0xD7, 0xD7, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0xD8, 0xF6, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0xF7, 0xF7, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0xF8, 0x2FF, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0x300, 0x36F, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0x370, 0x37D, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0x37E, 0x37E, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0x37F, 0x1FFF, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0x2000, 0x200B, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0x200C, 0x200D, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0x200E, 0x206F, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0x2070, 0x218F, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0x2190, 0x2BFF, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0x2C00, 0x2FEF, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0x2FF0, 0x3000, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0x3001, 0xD7FF, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0xD800, 0xF8FF, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0xF900, 0xFDCF, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0xFDD0, 0xFDEF, (c => $$.deepEqual(xml_isName(c), false)))
    $$.charRange(0xFDF0, 0xFFFD, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => $$.deepEqual(xml_isName(c), false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0xEFFFF, (c => $$.deepEqual(xml_isName(c), true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0xEFF0F, 0xEFFFF, (c => $$.deepEqual(xml_isName(c), true)))
    $$.charRange(0xF0000, 0xF00F0, (c => $$.deepEqual(xml_isName(c), false)))
  })

  $$.test('isName() - NameChar', () => {
    // ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] |
    // [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] |
    // [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] |
    // [#x10000-#xEFFFF] |
    // "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
    $$.charRange(0, 44, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.deepEqual(xml_isName('A-'), true) // 45
    $$.deepEqual(xml_isName('A.'), true) // 46
    $$.deepEqual(xml_isName('A/'), false) // 47
    $$.charRange('0', '9', (c => $$.deepEqual(xml_isName('A' + c), true))) // 48-57
    $$.deepEqual(xml_isName('A:'), true) // 58
    $$.charRange(59, 64, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange('A', 'Z', (c => $$.deepEqual(xml_isName('A' + c), true))) // 65-90
    $$.charRange(91, 94, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.deepEqual(xml_isName('A_'), true)  // 95
    $$.deepEqual(xml_isName('A`'), false) // 96
    $$.charRange('a', 'z', (c => $$.deepEqual(xml_isName('A' + c), true))) // 97-122
    $$.charRange(0x7B, 0xB6, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0xB7, 0xB7, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xB8, 0xBF, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0xC0, 0xD6, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xD7, 0xD7, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0xD8, 0xF6, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xF7, 0xF7, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0xF8, 0x2FF, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x300, 0x36F, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x370, 0x37D, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x37E, 0x37E, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0x37F, 0x1FFF, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x2000, 0x200B, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0x200C, 0x200D, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x200E, 0x203D, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0x203F, 0x2040, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x2041, 0x206F, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0x2070, 0x218F, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x2190, 0x2BFF, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0x2C00, 0x2FEF, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0x2FF0, 0x3000, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0x3001, 0xD7FF, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xD800, 0xF8FF, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0xF900, 0xFDCF, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xFDD0, 0xFDEF, (c => $$.deepEqual(xml_isName('A' + c), false)))
    $$.charRange(0xFDF0, 0xFFFD, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => $$.deepEqual(xml_isName('A' + c), false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0xEFFFF, (c => $$.deepEqual(xml_isName('A' + c), true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xEFF0F, 0xEFFFF, (c => $$.deepEqual(xml_isName('A' + c), true)))
    $$.charRange(0xF0000, 0xF00F0, (c => $$.deepEqual(xml_isName('A' + c), false)))
  })

  $$.test('isQName()', () => {
    $$.deepEqual(xml_isQName('prefix:name'), true)
    $$.deepEqual(xml_isQName('not_a_qname:'), false)
    $$.deepEqual(xml_isQName(':not_a_qname'), false)
    $$.deepEqual(xml_isQName('not:a:qname'), false)

    $$.charRange(0, 57, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.deepEqual(xml_isQName(':'), false) // 58
    $$.charRange(59, 64, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange('A', 'Z', (c => $$.deepEqual(xml_isQName(c), true))) // 65-90
    $$.charRange(91, 94, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.deepEqual(xml_isQName('_'), true)  // 95
    $$.deepEqual(xml_isQName('`'), false) // 96
    $$.charRange('a', 'z', (c => $$.deepEqual(xml_isQName(c), true))) // 97-122
    $$.charRange(0x7B, 0xBF, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0xC0, 0xD6, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0xD7, 0xD7, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0xD8, 0xF6, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0xF7, 0xF7, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0xF8, 0x2FF, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0x300, 0x36F, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0x370, 0x37D, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0x37E, 0x37E, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0x37F, 0x1FFF, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0x2000, 0x200B, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0x200C, 0x200D, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0x200E, 0x206F, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0x2070, 0x218F, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0x2190, 0x2BFF, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0x2C00, 0x2FEF, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0x2FF0, 0x3000, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0x3001, 0xD7FF, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0xD800, 0xF8FF, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0xF900, 0xFDCF, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0xFDD0, 0xFDEF, (c => $$.deepEqual(xml_isQName(c), false)))
    $$.charRange(0xFDF0, 0xFFFD, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => $$.deepEqual(xml_isQName(c), false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0xEFFFF, (c => $$.deepEqual(xml_isQName(c), true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0xEFF0F, 0xEFFFF, (c => $$.deepEqual(xml_isQName(c), true)))
    $$.charRange(0xF0000, 0xF00F0, (c => $$.deepEqual(xml_isQName(c), false)))
  })

  $$.test('isLegalChar()', () => {
    // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
    $$.charRange(0x0, 0x8, (c => $$.deepEqual(xml_isLegalChar(c), false)))
    $$.charRange(0xA, 0xA, (c => $$.deepEqual(xml_isLegalChar(c), true)))
    $$.charRange(0xB, 0xC, (c => $$.deepEqual(xml_isLegalChar(c), false)))
    $$.charRange(0xD, 0xD, (c => $$.deepEqual(xml_isLegalChar(c), true)))
    $$.charRange(0xE, 0x1F, (c => $$.deepEqual(xml_isLegalChar(c), false)))
    $$.charRange(0x20, 0xD7FF, (c => $$.deepEqual(xml_isLegalChar(c), true)))
    $$.charRange(0xD800, 0xDFFF, (c => $$.deepEqual(xml_isLegalChar(c), false)))
    $$.charRange(0xE000, 0xFFFD, (c => $$.deepEqual(xml_isLegalChar(c), true)))
    $$.charRange(0xFFFF, 0xFFFF, (c => $$.deepEqual(xml_isLegalChar(c), false)))
    // The last test takes too long to complete
    // $$.charRange(0x10000, 0x10FFFF, (c => $$.deepEqual(xml_isLegalChar(c), true)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x10000, 0x100F0, (c => $$.deepEqual(xml_isLegalChar(c), true)))
    $$.charRange(0x10FF0F, 0x10FFFF, (c => $$.deepEqual(xml_isLegalChar(c), true)))
  })

  $$.test('isPubidChar()', () => {
    // #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]
    $$.charRange(0x0, 0x9, (c => $$.deepEqual(xml_isPubidChar(c), false)))
    $$.charRange(0xA, 0xA, (c => $$.deepEqual(xml_isPubidChar(c), true)))
    $$.charRange(0xB, 0xC, (c => $$.deepEqual(xml_isPubidChar(c), false)))
    $$.charRange(0xD, 0xD, (c => $$.deepEqual(xml_isPubidChar(c), true)))
    $$.charRange(0xE, 0x1F, (c => $$.deepEqual(xml_isPubidChar(c), false)))
    $$.charRange(0x20, 0x21, (c => $$.deepEqual(xml_isPubidChar(c), true)))
    $$.charRange(0x22, 0x22, (c => $$.deepEqual(xml_isPubidChar(c), false)))
    $$.charRange(0x20, 0x21, (c => $$.deepEqual(xml_isPubidChar(c), true)))
    $$.charRange('#', '%', (c => $$.deepEqual(xml_isPubidChar(c), true))) // 0x23-0x25
    $$.deepEqual(xml_isPubidChar('&'), false) // 0x26
    $$.charRange('\'', ';', (c => $$.deepEqual(xml_isPubidChar(c), true))) // 0x27-0x3B ['()*+,-./] | [0-9] | [:;]
    $$.deepEqual(xml_isPubidChar('<'), false) // 0x3C
    $$.deepEqual(xml_isPubidChar('='), true) // 0x3D
    $$.deepEqual(xml_isPubidChar('>'), false) // 0x3E
    $$.deepEqual(xml_isPubidChar('?'), true) // 0x3F
    $$.deepEqual(xml_isPubidChar('@'), true) // 0x40
    $$.charRange('A', 'Z', (c => $$.deepEqual(xml_isPubidChar(c), true))) // 65-90
    $$.charRange(91, 94, (c => $$.deepEqual(xml_isPubidChar(c), false)))
    $$.deepEqual(xml_isPubidChar('_'), true) // 95
    $$.charRange('a', 'z', (c => $$.deepEqual(xml_isPubidChar(c), true))) // 97-122
    // The last test takes too long to complete
    // $$.charRange(0x7B, 0x10FFFF, (c => $$.deepEqual(xml_isPubidChar(c), false)))
    // We test a simpler version since algorithm is the same
    $$.charRange(0x7B, 0x8B, (c => $$.deepEqual(xml_isPubidChar(c), false)))
    $$.charRange(0x10FF0F, 0x10FFFF, (c => $$.deepEqual(xml_isPubidChar(c), false)))
  })

})
