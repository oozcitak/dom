import $$ from './TestHelpers'

describe('Slotable', function () {

  test('null assignedSlot', function () {
    const doc = $$.dom.createHTMLDocument('doc')
    expect(doc.createElementNS('http://www.w3.org/1999/xhtml', 'div').assignedSlot).toBeNull()

    const shadowHost = doc.createElementNS('http://www.w3.org/1999/xhtml', 'div')
    var shadowRoot = shadowHost.attachShadow({mode: 'open'})
    var childElement = doc.createElementNS('http://www.w3.org/1999/xhtml', 'b')
    shadowHost.appendChild(childElement)
    expect(childElement.assignedSlot).toBeNull()
    var childTextNode = doc.createTextNode('')
    shadowHost.appendChild(childTextNode)
    expect(childTextNode.assignedSlot).toBeNull()
    var slot = doc.createElementNS('http://www.w3.org/1999/xhtml', 'slot') as any
    slot._name = 'foo'
    shadowRoot.appendChild(slot)
    expect(childElement.assignedSlot).toBeNull()
    expect(childTextNode.assignedSlot).toBeNull()
  })

  test('assignedSlot in open shadow tree', function () {
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

    expect(childElement.assignedSlot).toBe(slot)
    expect(childTextNode.assignedSlot).toBe(slot)
  })

})