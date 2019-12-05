const { DOM } = require("../lib")

const dom = new DOM(false).implementation
for (let i = 0; i < 100000; i++) {
  const doc = dom.createDocument(null, "", null)
  const root = doc.createElement("root")
  doc.appendChild(root)
  for (let i = 0; i < 100; i++) {
    const node = doc.createElement("node" + i.toString())
    root.appendChild(node)
  }
}
