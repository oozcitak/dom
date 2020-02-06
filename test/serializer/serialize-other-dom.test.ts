import $$ from "../TestHelpers"
import { gte } from 'semver'

// only run if node version >=10 since this is the minimum requirement for jsdom
if (gte(process.version, '10.0.0')) {

  const { JSDOM } = require("jsdom")
  const jsdomImpl = new JSDOM().window.document.implementation

  describe('serialize from another DOM implementation', () => {

    test('document', () => {
      const doc = jsdomImpl.createDocument(null, 'root', null)
      const de = doc.documentElement
      if (de) {
        const node1 = doc.createElement('node')
        node1.setAttribute('att', 'val')
        de.appendChild(node1)
        de.appendChild(doc.createComment('same node below'))
        const node2 = doc.createElement('node')
        node2.setAttribute('att', 'val')
        node2.setAttribute('att2', 'val2')
        de.appendChild(node2)
        de.appendChild(doc.createProcessingInstruction('kidding', 'itwas="different"'))
        de.appendChild(doc.createProcessingInstruction('for', 'real'))
        de.appendChild(doc.createCDATASection('<greeting>Hello, world!</greeting>'))
        const node3 = doc.createElement('text')
        node3.appendChild(doc.createTextNode('alien\'s pinky toe'))
        de.appendChild(node3)
      }

      const serializer = new $$.XMLSerializer()
      expect(serializer.serializeToString(doc as any)).toBe(
        '<root>' +
        '<node att="val"/>' +
        '<!--same node below-->' +
        '<node att="val" att2="val2"/>' +
        '<?kidding itwas="different"?>' +
        '<?for real?>' +
        '<![CDATA[<greeting>Hello, world!</greeting>]]>' +
        '<text>alien\'s pinky toe</text>' +
        '</root>'
      )
    })

    test('fragment', () => {
      const doc = jsdomImpl.createDocument(null, 'root', null)
      const frag = doc.createDocumentFragment()
      frag.appendChild(doc.createElement('node1'))
      frag.appendChild(doc.createElement('node2'))
  
      const serializer = new $$.XMLSerializer()
      expect(serializer.serializeToString(frag)).toBe(
        '<node1/><node2/>'
      )
    })

  })

}
