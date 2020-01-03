import $$ from "../TestHelpers"
import { namespace_validate, namespace_validateAndExtract } from "../../src/algorithm"

describe('Namespace', () => {

  test('validateQName()', () => {
    expect(() => namespace_validate('name')).not.toThrow()
    expect(() => namespace_validate('prefix:name')).not.toThrow()
    expect(() => namespace_validate('not_a_qname:')).toThrow()
    expect(() => namespace_validate(':not_a_qname')).toThrow()
    expect(() => namespace_validate('not:a:qname')).toThrow()
    expect(() => namespace_validate('not a name')).toThrow()
  })

  test('extractNames()', () => {
    expect(() => { namespace_validateAndExtract('my ns', 'prefix:name') }).not.toThrow()
    expect(() => { namespace_validateAndExtract('http://www.w3.org/XML/1998/namespace', 'xml:name') }).not.toThrow()
    expect(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'xmlns:name') }).not.toThrow()
    expect(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'xmlns') }).not.toThrow()

    expect(() => { namespace_validateAndExtract(null, 'prefix:name') }).toThrow()
    expect(() => { namespace_validateAndExtract('some ns', 'xml:name') }).toThrow()
    expect(() => { namespace_validateAndExtract('some ns', 'xmlns:name') }).toThrow()
    expect(() => { namespace_validateAndExtract('some ns', 'xmlns') }).toThrow()
    expect(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'some:name') }).toThrow()
    expect(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'somename') }).toThrow()
  })

})
