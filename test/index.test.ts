import $$ from "./TestHelpers"
import { DOMImplementation, DOMParser, XMLSerializer } from "../src"

$$.suite('module exports', () => {

  $$.test('implementation', () => {
    const impl = new DOMImplementation()
    const doctype = impl.createDocumentType('qname', 'pubid', 'sysid')
    $$.deepEqual($$.printTree(doctype), $$.t`
      !DOCTYPE qname PUBLIC pubid sysid
      `)
  })

  $$.test('serializer + parser', () => {
    const xmlStr =
      '<section xmlns="http://www.ibm.com/events"' +
      ' xmlns:bk="urn:loc.gov:books"' +
      ' xmlns:pi="urn:personalInformation"' +
      ' xmlns:isbn="urn:ISBN:0-395-36341-6">' +
      '<title>Book-Signing Event</title>' +
      '<signing>' +
      '<bk:author pi:title="Mr" pi:name="Jim Ross"/>' +
      '<book bk:title="Writing COBOL for Fun and Profit" isbn:number="0426070806"/>' +
      '<comment xmlns="">What a great issue!</comment>' +
      '</signing>' +
      '</section>'

      const serializer = new $$.XMLSerializer()
      const parser = new $$.DOMParser()
      $$.deepEqual(serializer.serializeToString(parser.parseFromString(xmlStr, "application/xml")), xmlStr)
  })

})
