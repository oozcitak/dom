import $$ from "../TestHelpers"
import {
  xml_isName, xml_isQName, xml_isLegalChar, xml_isPubidChar
} from "../../src/algorithm"

describe('XMLAlgorithm', () => {

  test('isName()', () => {
    expect(xml_isName('name')).toBe(true)
    expect(xml_isName('not a name')).toBe(false)
  })

  test('isQName()', () => {
    expect(xml_isQName('prefix:name')).toBe(true)
    expect(xml_isQName('not_a_qname:')).toBe(false)
  })

  test('isLegalChar() XML 1.0', () => {
    expect(xml_isLegalChar('invalid char \u{0000}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0001}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0002}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0003}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0004}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0005}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0006}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0007}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0008}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{000B}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{000C}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{000E}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{000F}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0010}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0011}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0012}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0013}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0014}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0015}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0016}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0017}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{0018}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{001A}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{001B}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{001C}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{001D}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{001E}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{001F}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{D800}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{DFFF}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{FFFE}')).toBe(false)
    expect(xml_isLegalChar('invalid char \u{FFFF}')).toBe(false)
  })

  test('isLegalChar() XML 1.1', () => {
    expect(xml_isLegalChar('invalid char \u{0000}', "1.1")).toBe(false)
    expect(xml_isLegalChar('invalid char \u{D800}', "1.1")).toBe(false)
    expect(xml_isLegalChar('invalid char \u{DFFF}', "1.1")).toBe(false)
    expect(xml_isLegalChar('invalid char \u{FFFE}', "1.1")).toBe(false)
    expect(xml_isLegalChar('invalid char \u{FFFF}', "1.1")).toBe(false)

    expect(xml_isLegalChar('valid in XML 1.1 \u{0008}', "1.1")).toBe(true)
  })

  test('isPubidChar()', () => {
    expect(xml_isPubidChar('invalid char ^')).toBe(false)
  })

})
