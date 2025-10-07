import $$ from "../TestHelpers"

$$.suite('XMLParser', () => {

  $$.test('basic', () => {
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

    $$.deepEqual($$.printTree(doc),
      '!DOCTYPE root PUBLIC pubid sysid\n' +
      'root\n' +
      '  node att="val"\n' +
      '  !  same node below \n' +
      '  node att="val" att2="val2"\n' +
      '  ? kidding itwas="different"\n' +
      '  ? forreal\n' +
      '  $ here be dragons\n' +
      '  text\n' +
      "    # alien's pinky toe")
  })

  $$.test('internal subset', () => {
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

    $$.deepEqual($$.printTree(doc),
      '!DOCTYPE root SYSTEM sysid\n' +
      'root\n' +
      '  node att="val"\n' +
      '  !  same node below \n' +
      '  node att="val" att2="val2"\n' +
      '  ? kidding itwas="different"\n' +
      '  ? forreal\n' +
      '  $ here be dragons\n' +
      '  text\n' +
      "    # alien's pinky toe")
  })

  $$.test('closing tag should match', () => {
    const xmlStr = $$.t`
      <root>
        <node att="val"/>
      </notroot>
      `

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")
    $$.deepEqual(doc.getElementsByTagName("parsererror").length, 1)
  })

  $$.test('default namespace', () => {
    const xmlStr = '<root xmlns="uri:myns"><node1><node2>text</node2></node1></root>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      root (ns:uri:myns) xmlns="uri:myns" (ns:http://www.w3.org/2000/xmlns/)
        node1 (ns:uri:myns)
          node2 (ns:uri:myns)
            # text
    `)
  })

  $$.test('namespace prefix', () => {
    const xmlStr =
      '<root xmlns="uri:myns" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="uri:myschema.xsd">' +
      '<node1><node2>text</node2></node1>' +
      '</root>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      root (ns:uri:myns) xmlns="uri:myns" (ns:http://www.w3.org/2000/xmlns/) xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" (ns:http://www.w3.org/2000/xmlns/) xsi:schemaLocation="uri:myschema.xsd" (ns:http://www.w3.org/2001/XMLSchema-instance)
        node1 (ns:uri:myns)
          node2 (ns:uri:myns)
            # text
      `)
  })

  $$.test('explicit namespace declaration', () => {
    const xmlStr =
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
      '<script type="text/ecmascript" xlink:href="foo.js"/>' +
      '</svg>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      svg (ns:http://www.w3.org/2000/svg) xmlns="http://www.w3.org/2000/svg" (ns:http://www.w3.org/2000/xmlns/) xmlns:xlink="http://www.w3.org/1999/xlink" (ns:http://www.w3.org/2000/xmlns/)
        script (ns:http://www.w3.org/2000/svg) type="text/ecmascript" xlink:href="foo.js" (ns:http://www.w3.org/1999/xlink)
      `)
  })

  $$.test('empty default namespace', () => {
    const xmlStr =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<script xmlns=""/>' +
      '</svg>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      svg (ns:http://www.w3.org/2000/svg) xmlns="http://www.w3.org/2000/svg" (ns:http://www.w3.org/2000/xmlns/)
        script xmlns="" (ns:http://www.w3.org/2000/xmlns/)
      `)
  })

  $$.test('default namespace override', () => {
    const xmlStr =
      '<svg xmlns="http://www.w3.org/2000/svg">' +
      '<script xmlns="http://www.w3.org/1999/xlink"/>' +
      '</svg>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      svg (ns:http://www.w3.org/2000/svg) xmlns="http://www.w3.org/2000/svg" (ns:http://www.w3.org/2000/xmlns/)
        script (ns:http://www.w3.org/1999/xlink) xmlns="http://www.w3.org/1999/xlink" (ns:http://www.w3.org/2000/xmlns/)
      `)
  })

  $$.test('prefixed namespace override', () => {
    const xmlStr =
      '<p:root xmlns:p="uri:my ns1">' +
      '<p:node><p:child/></p:node>' +
      '<p:node xmlns:p="uri:my ns2"><p:child/></p:node>' +
      '<p:node><p:child/></p:node>' +
      '</p:root>'

    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      p:root (ns:uri:my ns1) xmlns:p="uri:my ns1" (ns:http://www.w3.org/2000/xmlns/)
        p:node (ns:uri:my ns1)
          p:child (ns:uri:my ns1)
        p:node (ns:uri:my ns2) xmlns:p="uri:my ns2" (ns:http://www.w3.org/2000/xmlns/)
          p:child (ns:uri:my ns2)
        p:node (ns:uri:my ns1)
          p:child (ns:uri:my ns1)
      `)
  })

  $$.test('invalid nodes', () => {
    const parser = new $$.DOMParser()
    const doc1 = parser.parseFromString('<?xml version="1.0"?><root>\x00</root>', "application/xml")
    $$.deepEqual(doc1.getElementsByTagName("parsererror").length, 1)
    const doc2 = parser.parseFromString('<?xml version="1.0"?><root>\x01</root>', "application/xml")
    $$.deepEqual(doc2.getElementsByTagName("parsererror").length, 1)
    const doc3 = parser.parseFromString('<?xml version="1.1"?><root/>', "application/xml")
    $$.deepEqual(doc3.getElementsByTagName("parsererror").length, 1)
  })

  $$.test('invalid DTD', () => {
    const parser = new $$.DOMParser()
    const doc1 = parser.parseFromString('<!DOCTYPE root PUBLIC "pub\\id" "sysid"><root/>', "application/xml")
    $$.deepEqual(doc1.getElementsByTagName("parsererror").length, 1)
    const doc2 = parser.parseFromString('<!DOCTYPE root PUBLIC "pubid" "sysid\0"><root/>', "application/xml")
    $$.deepEqual(doc2.getElementsByTagName("parsererror").length, 1)
  })

  $$.test('invalid comment', () => {
    const parser = new $$.DOMParser()
    const doc1 = parser.parseFromString('<!--hello--world--><root/>', "application/xml")
    $$.deepEqual(doc1.getElementsByTagName("parsererror").length, 1)
    const doc2 = parser.parseFromString('<!--hello\0world--><root/>', "application/xml")
    $$.deepEqual(doc2.getElementsByTagName("parsererror").length, 1)
    const doc3 = parser.parseFromString('<!--hello-world---><root/>', "application/xml")
    $$.deepEqual(doc3.getElementsByTagName("parsererror").length, 1)
  })

  $$.test('invalid CDATA', () => {
    const parser = new $$.DOMParser()
    const doc1 = parser.parseFromString('<root><![CDATA[ab\0xy]]></root>', "application/xml")
    $$.deepEqual(doc1.getElementsByTagName("parsererror").length, 1)
  })

  $$.test('invalid processing instruction', () => {
    const parser = new $$.DOMParser()
    const doc1 = parser.parseFromString('<root><?x:target?></root>', "application/xml")
    $$.deepEqual(doc1.getElementsByTagName("parsererror").length, 1)
    const doc2 = parser.parseFromString('<root><?target val\0?></root>', "application/xml")
    $$.deepEqual(doc2.getElementsByTagName("parsererror").length, 1)
  })

  $$.test('invalid element name', () => {
    const parser = new $$.DOMParser()
    const doc1 = parser.parseFromString('<d:root:x/>', "application/xml")
    $$.deepEqual(doc1.getElementsByTagName("parsererror").length, 1)
    const doc2 = parser.parseFromString('<xmlns:root/>', "application/xml")
    $$.deepEqual(doc2.getElementsByTagName("parsererror").length, 1)
  })

  $$.test('invalid attributes', () => {
    const parser = new $$.DOMParser()
    const doc1 = parser.parseFromString('<root att="val" att="val"/>', "application/xml")
    $$.deepEqual(doc1.getElementsByTagName("parsererror").length, 1)
    const doc2 = parser.parseFromString('<root att\0="val"/>', "application/xml")
    $$.deepEqual(doc2.getElementsByTagName("parsererror").length, 1)
    const doc3 = parser.parseFromString('<root xmlns:x="http://www.w3.org/2000/xmlns/"/>', "application/xml")
    $$.deepEqual(doc3.getElementsByTagName("parsererror").length, 1)
    const doc4 = parser.parseFromString('<root xmlns:x=""/>', "application/xml")
    $$.deepEqual(doc4.getElementsByTagName("parsererror").length, 1)
    const doc5 = parser.parseFromString('<root d:att\0="val"/>', "application/xml")
    $$.deepEqual(doc5.getElementsByTagName("parsererror").length, 1)
  })

  // https://www.w3.org/TR/xml-c14n2-testcases/
  $$.test('Tests from Canonical XML - 1', () => {
    const str = $$.t`
    <?xml version="1.0"?>

    <?xml-stylesheet   href="doc.xsl"
       type="text/xsl"   ?>

    <!DOCTYPE doc SYSTEM "doc.dtd">

    <doc>Hello, world!<!-- Comment 1 --></doc>

    <?pi-without-data     ?>

    <!-- Comment 2 -->

    <!-- Comment 3 -->
    `
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(str, "application/xml")
    const ser = new $$.XMLSerializer()

    $$.deepEqual(ser.serializeToString(doc),
      '<?xml-stylesheet href="doc.xsl"\n   type="text/xsl"   ?>' +
      '<!DOCTYPE doc SYSTEM "doc.dtd">' +
      '<doc>Hello, world!<!-- Comment 1 --></doc>' +
      '<?pi-without-data?>' +
      '<!-- Comment 2 -->' +
      '<!-- Comment 3 -->'
    )
  })

  $$.test('Tests from Canonical XML - 2', () => {
    const str = $$.t`
    <!DOCTYPE doc [<!ATTLIST e9 attr CDATA "default">]>
    <doc>
       <e1   />
       <e2   ></e2>
       <e3   name = "elem3"   id="elem3"   />
       <e4   name="elem4"   id="elem4"   ></e4>
       <e5 a:attr="out" b:attr="sorted" attr2="all" attr="I'm"
          xmlns:b="http://www.ietf.org"
          xmlns:a="http://www.w3.org"
          xmlns="http://example.org"/>
       <e6 xmlns="" xmlns:a="http://www.w3.org">
          <e7 xmlns="http://www.ietf.org">
             <e8 xmlns="" xmlns:a="http://www.w3.org">
                <e9 xmlns="" xmlns:a="http://www.ietf.org"/>
             </e8>
          </e7>
       </e6>
    </doc>
    `
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(str, "application/xml")
    const ser = new $$.XMLSerializer()

    $$.deepEqual(ser.serializeToString(doc),
      '<!DOCTYPE doc>' +
      '<doc>' +
         '<e1/>' +
         '<e2/>' +
         '<e3 name="elem3" id="elem3"/>' +
         '<e4 name="elem4" id="elem4"/>' +
         '<e5 a:attr="out" b:attr="sorted" attr2="all" attr="I\'m" xmlns:b="http://www.ietf.org" xmlns:a="http://www.w3.org" xmlns="http://example.org"/>' +
         '<e6 xmlns:a="http://www.w3.org">' +
            '<e7 xmlns="http://www.ietf.org">' +
               '<e8 xmlns="">' +
                  '<e9 xmlns:a="http://www.ietf.org"/>' +
               '</e8>' +
            '</e7>' +
         '</e6>' +
      '</doc>'
    )
  })

  $$.test('decode entities', () => {
    const xmlStr = $$.t`
      <?xml version="1.0"?>
      <root>hello &lt;&amp;&gt; world</root>
      `
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString(xmlStr, "application/xml")

    $$.deepEqual($$.printTree(doc), $$.t`
      root
        # hello <&> world
      `)
  })

})