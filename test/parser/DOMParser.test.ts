import $$ from "../TestHelpers"

describe('DOMParser - XML', () => {

  test('HTML parser not yet supported', () => {
    const parser = new $$.DOMParser()
    expect(() => parser.parseFromString('', "text/html")).toThrow()
  })

  test('basic', () => {
    const xmlStr = $$.t`
      <?xml version="1.0"?>
      <!DOCTYPE root PUBLIC "pubid" "sysid">
      <root>
        <node att="val"/>
        <!-- same node below -->
        <node att="val" att2='val2'/>
        <?kidding itwas="different"?>
        <?forreal?>
        <![CDATA[here be dragons]]>
        <text>alien's pinky toe</text>
      </root>
      `
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    expect($$.printTree(doc)).toBe($$.t`
      !DOCTYPE root PUBLIC pubid sysid
      root
        node att="val"
        !  same node below 
        node att="val" att2="val2"
        ? kidding itwas="different"
        ? forreal
        $ here be dragons
        text
          # alien's pinky toe
      `)
  })

  test('internal subset', () => {
    const xmlStr = $$.t`
      <?xml version="1.0"?>
      <!DOCTYPE root SYSTEM "sysid" [
        <?pub_border thin?>
        <!ELEMENT img EMPTY>
        <!-- Image attributes follow -->
        <!ATTLIST img height CDATA #REQUIRED>
        <!ATTLIST img visible (yes|no) "yes">
        <!NOTATION fs SYSTEM "http://my.fs.com/reader">
        <!NOTATION fs-nt PUBLIC "FS Network Reader 1.0" "http://my.fs.com/reader">
        <!ATTLIST img src NOTATION (fs|fs-nt) #REQUIRED>
        <!ELEMENT node (#PCDATA)>
        <!ENTITY ent "my val">
        <!ENTITY ent SYSTEM "http://www.myspec.com/ent">
        <!ENTITY ent PUBLIC "-//MY//SPEC ENT//EN" "http://www.myspec.com/ent" NDATA entprg>
        <!ENTITY % ent "my val">
        <!ENTITY % ent SYSTEM "http://www.myspec.com/ent">
        <!ENTITY % ent PUBLIC "-//MY//SPEC ENT//EN" "http://www.myspec.com/ent">
      ]>
      <root>
        <node att="val"/>
        <!-- same node below -->
        <node att="val" att2='val2'/>
        <?kidding itwas="different"?>
        <?forreal?>
        <![CDATA[here be dragons]]>
        <text>alien's pinky toe</text>
      </root>
      `
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    expect($$.printTree(doc)).toBe($$.t`
      !DOCTYPE root SYSTEM sysid
      root
        node att="val"
        !  same node below 
        node att="val" att2="val2"
        ? kidding itwas="different"
        ? forreal
        $ here be dragons
        text
          # alien's pinky toe
      `)
  })

  test('closing tag should match', () => {
    const xmlStr = $$.t`
      <root>
        <node att="val"/>
      </notroot>
      `

    const parser = new $$.DOMParser()
    expect(() => parser.parseFromString(xmlStr, "application/xml")).toThrow()
  })

  test('default namespace', () => {
    const xmlStr = '<root xmlns="uri:myns"><node1><node2>text</node2></node1></root>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    expect($$.printTree(doc)).toBe($$.t`
      root (ns:uri:myns)
        node1 (ns:uri:myns)
          node2 (ns:uri:myns)
            # text    
    `)
  })

  test('namespace prefix', () => {
    const xmlStr =
      '<root xmlns="uri:myns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="uri:myschema.xsd">' +
      '<node1><node2>text</node2></node1>' +
      '</root>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")
  
    expect($$.printTree(doc)).toBe($$.t`
      root (ns:uri:myns) xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" (ns:http://www.w3.org/2000/xmlns/) xsi:schemaLocation="uri:myschema.xsd" (ns:http://www.w3.org/2001/XMLSchema-instance)
        node1 (ns:uri:myns)
          node2 (ns:uri:myns)
            # text
      `)
  })

  test('explicit namespace declaration', () => {
    const xmlStr =
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<script type="text/ecmascript" xlink:href="foo.js"/>' +
      '</svg>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")
  
    expect($$.printTree(doc)).toBe($$.t`
      svg (ns:http://www.w3.org/2000/svg) xmlns:xlink="http://www.w3.org/1999/xlink" (ns:http://www.w3.org/2000/xmlns/)
        script (ns:http://www.w3.org/2000/svg) type="text/ecmascript" xlink:href="foo.js" (ns:http://www.w3.org/1999/xlink)
      `)
  })

  test('empty default namespace', () => {
    const xmlStr =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<script xmlns=""/>' +
      '</svg>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")
  
    expect($$.printTree(doc)).toBe($$.t`
      svg (ns:http://www.w3.org/2000/svg)
        script
      `)
  })

  test('default namespace override', () => {
    const xmlStr =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<script xmlns="http://www.w3.org/1999/xlink"/>' +
      '</svg>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")
  
    expect($$.printTree(doc)).toBe($$.t`
      svg (ns:http://www.w3.org/2000/svg)
        script (ns:http://www.w3.org/1999/xlink)
      `)
  })

  test('prefixed namespace override', () => {
    const xmlStr =
      '<p:root xmlns:p="uri:my ns1">' +
      '<p:node><p:child/></p:node>' +
      '<p:node xmlns:p="uri:my ns2"><p:child/></p:node>' +
      '<p:node><p:child/></p:node>' +
      '</p:root>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")
  
    expect($$.printTree(doc)).toBe($$.t`
      p:root (ns:uri:my ns1) xmlns:p="uri:my ns1" (ns:http://www.w3.org/2000/xmlns/)
        p:node (ns:uri:my ns1)
          p:child (ns:uri:my ns1)
        p:node (ns:uri:my ns2) xmlns:p="uri:my ns2" (ns:http://www.w3.org/2000/xmlns/)
          p:child (ns:uri:my ns2)
        p:node (ns:uri:my ns1)
          p:child (ns:uri:my ns1)
      `)
  })

  test('invalid nodes', () => {
    const parser = new $$.DOMParser()
    expect(() => parser.parseFromString('<?xml version="1.0"?><root>\x00</root>', "application/xml")).toThrow()
    expect(() => parser.parseFromString('<?xml version="1.0"?><root>\x01</root>', "application/xml")).toThrow()
    expect(() => parser.parseFromString('<?xml version="1.1"?><root>\x00</root>', "application/xml")).toThrow()
  })

})