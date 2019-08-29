import $$ from '../TestHelpers'

describe('XMLSpec', function () {

  test('isName()', function () {
    expect($$.XMLSpec.isName('name')).toBeTruthy()
    expect($$.XMLSpec.isName('not a name')).toBeFalsy()
  })

  test('isQName()', function () {
    expect($$.XMLSpec.isQName('prefix:name')).toBeTruthy()
    expect($$.XMLSpec.isQName('not_a_qname:')).toBeFalsy()
  })

  test('isLegalChar() XML 1.0', function () {
    expect($$.XMLSpec.isLegalChar('invalid char \u{0000}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0001}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0002}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0003}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0004}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0005}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0006}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0007}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0008}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{000B}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{000C}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{000E}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{000F}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0010}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0011}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0012}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0013}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0014}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0015}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0016}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0017}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{0018}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{001A}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{001B}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{001C}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{001D}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{001E}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{001F}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{D800}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{DFFF}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{FFFE}')).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{FFFF}')).toBeFalsy()    
  })

  test('isLegalChar() XML 1.1', function () {
    expect($$.XMLSpec.isLegalChar('invalid char \u{0000}', "1.1")).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{D800}', "1.1")).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{DFFF}', "1.1")).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{FFFE}', "1.1")).toBeFalsy()
    expect($$.XMLSpec.isLegalChar('invalid char \u{FFFF}', "1.1")).toBeFalsy()

    expect($$.XMLSpec.isLegalChar('valid in XML 1.1 \u{0008}', "1.1")).toBeTruthy()
  })

  test('isPubidChar()', function () {
    expect($$.XMLSpec.isPubidChar('invalid char ^')).toBeFalsy()
  })

})
