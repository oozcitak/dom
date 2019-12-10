const { dom, DOMImplementation } = require("../lib")

dom.setFeatures(false)
const impl = new DOMImplementation()
for (let i = 0; i < 100000; i++) {
  const doc = impl.createDocument(null, "", null)
  const root = doc.createElement("root")
  doc.appendChild(root)
  for (let i = 0; i < 100; i++) {
    const node = doc.createElement("node" + i.toString())
    root.appendChild(node)
  }
}
