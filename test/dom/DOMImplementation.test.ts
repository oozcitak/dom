import $$ from "../TestHelpers"

$$.suite('DOMImplementation', () => {

  $$.test('singleton pattern', () => {
    const impl1 = $$.dom
    const impl2 = $$.dom
    $$.deepEqual(impl1, impl2)
  })

  $$.test('ID', () => {
    const impl = $$.dom
    $$.deepEqual(impl._ID, "@oozcitak/dom")
  })

  $$.test('createDocumentType()', () => {
    const doctype = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    $$.deepEqual($$.printTree(doctype), $$.t`
      !DOCTYPE qname PUBLIC pubid sysid
      `)
  })

  $$.test('createDocument()', () => {
    const doctype = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    const doc = $$.dom.createDocument('myns', 'qname', doctype)
    $$.deepEqual(doc.contentType, 'application/xml')

    $$.deepEqual($$.printTree(doc), $$.t`
      !DOCTYPE qname PUBLIC pubid sysid
      qname (ns:myns)
      `)

    const xhtml = $$.dom.createDocument('http://www.w3.org/1999/xhtml', 'html')
    $$.deepEqual(xhtml.contentType, 'application/xhtml+xml')
    const svg = $$.dom.createDocument('http://www.w3.org/2000/svg', 'svg')
    $$.deepEqual(svg.contentType, 'image/svg+xml')
  })

  $$.test('createHTMLDocument()', () => {
    const doc = $$.dom.createHTMLDocument('htmldoc')
    $$.deepEqual(doc.contentType, 'text/html')
    $$.deepEqual($$.printTree(doc), $$.t`
      !DOCTYPE html
      HTML (ns:http://www.w3.org/1999/xhtml)
        HEAD (ns:http://www.w3.org/1999/xhtml)
          TITLE (ns:http://www.w3.org/1999/xhtml)
            # htmldoc
        BODY (ns:http://www.w3.org/1999/xhtml)
      `)
  })

  $$.test('createHTMLDocument() without title', () => {
    const doc = $$.dom.createHTMLDocument()
    $$.deepEqual(doc.contentType, 'text/html')
    $$.deepEqual($$.printTree(doc), $$.t`
      !DOCTYPE html
      HTML (ns:http://www.w3.org/1999/xhtml)
        HEAD (ns:http://www.w3.org/1999/xhtml)
        BODY (ns:http://www.w3.org/1999/xhtml)
      `)
  })

  $$.test('hasFeature()', () => {
    $$.deepEqual($$.dom.hasFeature(), true)
  })

})