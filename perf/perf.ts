import { dom } from "../lib/dom"
import { DOMImplementation, DOMParser, XMLSerializer } from "../lib"
import {
  DOMImplementation as XMLDOMImplementation, DOMParser as XMLDOMParser,
  XMLSerializer as XMLDOMSerializer
} from "xmldom"
import { JSDOM } from "jsdom"
import { parse as fastXMLParse } from "fast-xml-parser"
import { Suite } from "benchmark"
import { processBenchmark } from "./"
import { readFileSync } from "fs"
import { join } from "path"

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
  const suite = new Suite("parse 2 kB sample xml")

  const sampleFileName = join(__dirname, "./assets/sample-2kB.xml")
  const xml = readFileSync(sampleFileName).toString()

  dom.setFeatures(false)
  const domParser = new DOMParser()
  const xmldomParser = new XMLDOMParser()
  const jsdomParser = JSDOM.fragment

  suite.add("dom", () => domParser.parseFromString(xml, "application/xml"))
  suite.add("xmldom", () => xmldomParser.parseFromString(xml, "application/xml"))
  suite.add("jsdom", () => jsdomParser(xml))
  suite.add("fast-xml-parser", () => fastXMLParse(xml, {}, true))

  suite.on("complete", () => processBenchmark(suite, "dom"))
  suite.on("error", (evt: any) => { throw evt.target.error })
  suite.run()

})();

(function () {
  const suite = new Suite("parse 2 MB sample xml")

  const sampleFileName = join(__dirname, "./assets/sample-2MB.xml")
  const xml = readFileSync(sampleFileName).toString()

  dom.setFeatures(false)
  const domParser = new DOMParser()
  const xmldomParser = new XMLDOMParser()
  const jsdomParser = JSDOM.fragment

  suite.add("dom", () => domParser.parseFromString(xml, "application/xml"))
  suite.add("xmldom", () => xmldomParser.parseFromString(xml, "application/xml"))
  suite.add("jsdom", () => jsdomParser(xml))
  suite.add("fast-xml-parser", () => fastXMLParse(xml, {}, true))

  suite.on("complete", () => processBenchmark(suite, "dom"))
  suite.on("error", (evt: any) => { throw evt.target.error })
  suite.run()

})();

(function () {
  const suite = new Suite("serializer")

  dom.setFeatures(false)
  
  const domImpl = new DOMImplementation()
  const xmldomImpl = new XMLDOMImplementation()

  const doc = createTestDoc(domImpl)
  const xmldomDoc = createTestDoc(xmldomImpl)

  const domSerializer = new XMLSerializer()
  const xmldomSerializer = new XMLDOMSerializer()
  const jsdomSerializer = new JSDOM(domSerializer.serializeToString(doc))

  suite.add("dom", () => domSerializer.serializeToString(doc))
  suite.add("xmldom", () => xmldomSerializer.serializeToString(xmldomDoc))
  suite.add("jsdom", () => jsdomSerializer.serialize())

  suite.on("complete", () => processBenchmark(suite, "dom"))
  suite.run()

})();