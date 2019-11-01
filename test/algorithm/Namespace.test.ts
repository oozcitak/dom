import $$ from '../TestHelpers'

describe('Namespace', () => {

  test('validateQName()', () => {
    expect(() => $$.algo.namespace.validate('name')).not.toThrow()
    expect(() => $$.algo.namespace.validate('prefix:name')).not.toThrow()
    expect(() => $$.algo.namespace.validate('not_a_qname:')).toThrow()
    expect(() => $$.algo.namespace.validate('not a name')).toThrow()
  })

  test('extractNames()', () => {
    expect(() => { $$.algo.namespace.validateAndExtract('my ns', 'prefix:name') }).not.toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('http://www.w3.org/XML/1998/namespace', 'xml:name') }).not.toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('http://www.w3.org/2000/xmlns/', 'xmlns:name') }).not.toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('http://www.w3.org/2000/xmlns/', 'xmlns') }).not.toThrow()

    expect(() => { $$.algo.namespace.validateAndExtract(null, 'prefix:name') }).toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('some ns', 'xml:name') }).toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('some ns', 'xmlns:name') }).toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('some ns', 'xmlns') }).toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('http://www.w3.org/2000/xmlns/', 'some:name') }).toThrow()
    expect(() => { $$.algo.namespace.validateAndExtract('http://www.w3.org/2000/xmlns/', 'somename') }).toThrow()
  })

})
