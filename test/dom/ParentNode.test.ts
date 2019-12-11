import $$ from "../TestHelpers"

describe('ParentNode', () => {

  const doc = $$.dom.createDocument('myns', 'n:root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  const child1 = doc.createTextNode('child1')
  const child2 = doc.createElement('child2')
  const child3 = doc.createTextNode('child3')
  const child4 = doc.createElement('child4')
  const child5 = doc.createTextNode('child5')
  de.appendChild(child1)
  de.appendChild(child2)
  de.appendChild(child3)
  de.appendChild(child4)
  de.appendChild(child5)

  test('children', () => {
    expect(de.children.length).toBe(2)
    expect(de.children[0]).toBe(child2)
    expect(de.children[1]).toBe(child4)
  })

  test('firstElementChild', () => {
    expect(de.firstElementChild).toBe(child2)
    expect(child2.firstElementChild).toBeNull()
  })

  test('lastElementChild', () => {
    expect(de.lastElementChild).toBe(child4)
    expect(child2.lastElementChild).toBeNull()
  })

  test('childElementCount', () => {
    expect(de.childElementCount).toBe(2)
  })

  test('prepend() with element node', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')

    if (!doc.documentElement)
      throw new Error("documentElement is null")
  
    const de = doc.documentElement
    de.appendChild(doc.createTextNode('txt'))
    de.appendChild(doc.createElement('ele'))
      
    de.prepend(doc.createElement('node1'), 
      doc.createTextNode('text1'), 
      'text2', 
      doc.createTextNode('text3'), 
      doc.createElement('node2'))

    expect($$.printTree(doc)).toBe($$.t`
      n:root (ns:myns)
        node1
        # text1
        # text2
        # text3
        node2
        # txt
        ele
      `)
  })

  test('prepend() with document fragment node', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')
    const frag = doc.createDocumentFragment()
  
    frag.appendChild(doc.createTextNode('txt'))
    frag.appendChild(doc.createElement('ele'))
      
    frag.prepend(doc.createElement('node1'), 
      doc.createTextNode('text1'), 
      'text2', 
      doc.createTextNode('text3'), 
      doc.createElement('node2'))

    expect($$.printTree(frag)).toBe($$.t`
      node1
      # text1
      # text2
      # text3
      node2
      # txt
      ele
      `)
  })

  test('prepend() with document node', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')
     
    doc.prepend(doc.createComment('comment1'))

    expect($$.printTree(doc)).toBe($$.t`
      ! comment1
      n:root (ns:myns)
      `)
  })

  test('append() with element node', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')

    if (!doc.documentElement)
      throw new Error("documentElement is null")
  
    const de = doc.documentElement
    de.appendChild(doc.createTextNode('txt'))
    de.appendChild(doc.createElement('ele'))
      
    de.append(doc.createElement('node1'), 
      doc.createTextNode('text1'), 
      'text2', 
      doc.createTextNode('text3'), 
      doc.createElement('node2'))

    expect($$.printTree(doc)).toBe($$.t`
      n:root (ns:myns)
        # txt
        ele
        node1
        # text1
        # text2
        # text3
        node2
      `)
  })

  test('append() with document fragment node', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')
    const frag = doc.createDocumentFragment()
  
    frag.appendChild(doc.createTextNode('txt'))
    frag.appendChild(doc.createElement('ele'))
      
    frag.append(doc.createElement('node1'), 
      doc.createTextNode('text1'), 
      'text2', 
      doc.createTextNode('text3'), 
      doc.createElement('node2'))

    expect($$.printTree(frag)).toBe($$.t`
      # txt
      ele
      node1
      # text1
      # text2
      # text3
      node2
      `)
  })

  test('append() with document node', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')
     
    doc.append(doc.createComment('comment1'))

    expect($$.printTree(doc)).toBe($$.t`
      n:root (ns:myns)
      ! comment1
      `)
  })

  test('querySelector()', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')
    expect(() => doc.querySelector('*')).toThrow()
  })

  test('querySelectorAll()', () => {
    const doc = $$.dom.createDocument('myns', 'n:root')
    expect(() => doc.querySelectorAll('*')).toThrow()
  })

})