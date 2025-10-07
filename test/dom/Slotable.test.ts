import $$ from "../TestHelpers"

$$.suite('Slotable', () => {

  $$.test('null assignedSlot', () => {
    const doc = $$.dom.createHTMLDocument('doc')
    $$.deepEqual(doc.createElementNS('http://www.w3.org/1999/xhtml', 'div').assignedSlot, null)

    const shadowHost = doc.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    var shadowRoot = shadowHost.attachShadow({mode: 'open'})
    var childElement = doc.createElementNS('http://www.w3.org/1999/xhtml', 'b')
    shadowHost.appendChild(childElement)
    $$.deepEqual(childElement.assignedSlot, null)
    var childTextNode = doc.createTextNode('')
    shadowHost.appendChild(childTextNode)
    $$.deepEqual(childTextNode.assignedSlot, null)
    var slot = doc.createElementNS('http://www.w3.org/1999/xhtml', 'slot') as any
    slot._name = 'foo'
    shadowRoot.appendChild(slot)
    $$.deepEqual(childElement.assignedSlot, null)
    $$.deepEqual(childTextNode.assignedSlot, null)
  })

  $$.test('assignedSlot in open shadow tree', () => {
    const doc = $$.dom.createHTMLDocument('doc')
    const shadowHost = doc.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    const childElement = doc.createElementNS('http://www.w3.org/1999/xhtml', 'b')
    shadowHost.appendChild(childElement)
    const childTextNode = doc.createTextNode('')
    shadowHost.appendChild(childTextNode)
    var shadowRoot = shadowHost.attachShadow({mode: 'open'})
    var slot = doc.createElementNS('http://www.w3.org/1999/xhtml', 'slot')
    const htmlSlot = slot as any
    htmlSlot._name = ''
    htmlSlot._assignedNodes = []
    shadowRoot.appendChild(slot)

    $$.deepEqual(childElement.assignedSlot, slot)
    $$.deepEqual(childTextNode.assignedSlot, slot)
  })

  $$.test('assignedSlot in open closed tree', () => {
    const doc = $$.dom.createHTMLDocument('doc')
    const shadowHost = doc.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    const childElement = doc.createElementNS('http://www.w3.org/1999/xhtml', 'b')
    shadowHost.appendChild(childElement)
    const childTextNode = doc.createTextNode('')
    shadowHost.appendChild(childTextNode)
    var shadowRoot = shadowHost.attachShadow({mode: 'closed'})
    var slot = doc.createElementNS('http://www.w3.org/1999/xhtml', 'slot')
    const htmlSlot = slot as any
    htmlSlot._name = ''
    htmlSlot._assignedNodes = []
    shadowRoot.appendChild(slot)

    $$.deepEqual(childElement.assignedSlot, null)
    $$.deepEqual(childTextNode.assignedSlot, null)
  })

})