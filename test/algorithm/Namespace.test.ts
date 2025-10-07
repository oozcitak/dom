import $$ from "../TestHelpers"
import { namespace_validate, namespace_validateAndExtract } from "../../src/algorithm"

$$.suite('Namespace', () => {

  $$.test('validateQName()', () => {
    $$.doesNotThrow(() => namespace_validate('name'))
    $$.doesNotThrow(() => namespace_validate('prefix:name'))
    $$.throws(() => namespace_validate('not_a_qname:'))
    $$.throws(() => namespace_validate(':not_a_qname'))
    $$.throws(() => namespace_validate('not:a:qname'))
    $$.throws(() => namespace_validate('not a name'))
  })

  $$.test('extractNames()', () => {
    $$.doesNotThrow(() => { namespace_validateAndExtract('my ns', 'prefix:name') })
    $$.doesNotThrow(() => { namespace_validateAndExtract('http://www.w3.org/XML/1998/namespace', 'xml:name') })
    $$.doesNotThrow(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'xmlns:name') })
    $$.doesNotThrow(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'xmlns') })

    $$.throws(() => { namespace_validateAndExtract(null, 'prefix:name') })
    $$.throws(() => { namespace_validateAndExtract('some ns', 'xml:name') })
    $$.throws(() => { namespace_validateAndExtract('some ns', 'xmlns:name') })
    $$.throws(() => { namespace_validateAndExtract('some ns', 'xmlns') })
    $$.throws(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'some:name') })
    $$.throws(() => { namespace_validateAndExtract('http://www.w3.org/2000/xmlns/', 'somename') })
  })

})
