import $$ from './TestHelpers'

describe('DOMImplementation', function () {

  test('singleton pattern', function () {
    const impl1 = $$.dom
    const impl2 = $$.dom
    expect(impl1).toBe(impl2)
  })

  test('createDocumentType()', function () {
    const doctype = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    expect($$.printTree(doctype)).toBe($$.t`
      !DOCTYPE qname PUBLIC pubid sysid
      `)
  })

  test('createDocument()', function () {
    const doctype = $$.dom.createDocumentType('qname', 'pubid', 'sysid')
    const doc = $$.dom.createDocument('myns', 'qname', doctype)
    expect(doc.contentType).toBe('application/xml')

    expect($$.printTree(doc)).toBe($$.t`
      !DOCTYPE qname PUBLIC pubid sysid
      qname (ns:myns)
      `)

    const xhtml = $$.dom.createDocument('http://www.w3.org/1999/xhtml', 'html')
    expect(xhtml.contentType).toBe('application/xhtml+xml')
    const svg = $$.dom.createDocument('http://www.w3.org/2000/svg', 'svg')
    expect(svg.contentType).toBe('image/svg+xml')
  })

  test('createHTMLDocument()', function () {
    const doc = $$.dom.createHTMLDocument('htmldoc')
    expect(doc.contentType).toBe('text/html')
    expect($$.printTree(doc)).toBe($$.t`
      !DOCTYPE html
      HTML (ns:http://www.w3.org/1999/xhtml)
        HEAD (ns:http://www.w3.org/1999/xhtml)
          TITLE (ns:http://www.w3.org/1999/xhtml)
            # htmldoc
        BODY (ns:http://www.w3.org/1999/xhtml)
      `)
  })

  test('createHTMLDocument() without title', function () {
    const doc = $$.dom.createHTMLDocument()
    expect(doc.contentType).toBe('text/html')
    expect($$.printTree(doc)).toBe($$.t`
      !DOCTYPE html
      HTML (ns:http://www.w3.org/1999/xhtml)
        HEAD (ns:http://www.w3.org/1999/xhtml)
        BODY (ns:http://www.w3.org/1999/xhtml)
      `)
  })

  test('hasFeature()', function () {
    expect($$.dom.hasFeature()).toBe(true)
  })

})