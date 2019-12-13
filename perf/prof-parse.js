const { dom, DOMImplementation, XMLSerializer, DOMParser } = require("../lib")

function createTestDoc(impl) {
  const doc = impl.createDocument(null, "", null)
  const root = doc.createElement("root")
  doc.appendChild(root)
  for (let i = 0; i < 100; i++) {
    const node = doc.createElement("node" + i.toString())
    for (let j = 0; j < 10; j++) {
      node.setAttribute("att" + j.toString(), "val" + j.toString())
      const text = doc.createTextNode("text" + j.toString())
      node.appendChild(text)
    }
    root.appendChild(node)
  }
  return doc
}

dom.setFeatures(false)
const impl = new DOMImplementation()
const xml = new XMLSerializer().serializeToString(createTestDoc(impl))
const domParser = new DOMParser()
for (let i = 0; i < 1000; i++) {
  domParser.parseFromString(xml, "application/xml")
}
