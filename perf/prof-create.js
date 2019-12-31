const { DOMImplementation } = require("../lib")
const { dom } = require("../lib/dom")

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
for (let i = 0; i < 10000; i++) {
  createTestDoc(impl)
}
