import { dom, DOMParser, DOMImplementation, XMLSerializer } from "../lib"
import { DOMImplementation as XMLDOMImplementation, DOMParser as XMLDOMParser } from "xmldom"
import { JSDOM } from "jsdom"
import { Suite } from "benchmark"
import { processBenchmark } from "./"

function createTestDoc(impl: any): any {
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

(function () {
  const suite = new Suite("createDocument + createElement + appendChild")
   
  dom.setFeatures(false)
  
  const domImpl = new DOMImplementation()
  const xmldomImpl = new XMLDOMImplementation()
  const jsdomImpl = new JSDOM().window.document.implementation

  suite.add("dom", () => createTestDoc(domImpl))
  suite.add("xmldom", () => createTestDoc(xmldomImpl))
  suite.add("jsdom", () => createTestDoc(jsdomImpl))

  suite.on("complete", () => processBenchmark(suite, "dom"))
  suite.run()

})();

(function () {
  const suite = new Suite("parser")
  
  dom.setFeatures(false)
  const domImpl = new DOMImplementation()
  const xml = new XMLSerializer().serializeToString(createTestDoc(domImpl))

  const domParser = new DOMParser()
  const xmldomParser = new XMLDOMParser()
  const jsdomParser = JSDOM.fragment

  suite.add("dom", () => domParser.parseFromString(xml, "application/xml"))
  suite.add("xmldom", () => xmldomParser.parseFromString(xml, "application/xml"))
  suite.add("jsdom", () => jsdomParser(xml))

  suite.on("complete", () => processBenchmark(suite, "dom"))
  suite.run()

})();
