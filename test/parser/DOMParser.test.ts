import $$ from "../TestHelpers"

describe('DOMParser', () => {

  test('HTML parser not yet supported', () => {
    const parser = new $$.DOMParser()
    expect(() => parser.parseFromString('', "text/html")).toThrow()
  })

  test('XML parser', () => {
    const parser = new $$.DOMParser()
    const doc = parser.parseFromString('<root/>', "application/xml")
    
    expect($$.printTree(doc)).toBe($$.t`
      root
      `)
  })

  test('XML parser', () => {
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
    
    expect(ser.serializeToString(doc)).toBe(
      '<?xml-stylesheet href="doc.xsl"\n   type="text/xsl"   ?>' +
      '<!DOCTYPE doc SYSTEM "doc.dtd">' + 
      '<doc>Hello, world!<!-- Comment 1 --></doc>' +
      '<?pi-without-data?>' +
      '<!-- Comment 2 -->' +
      '<!-- Comment 3 -->'
    )
  })
})