import { implementation as impl } from "../src"
import { DOMImplementation as XMLDOMImplementation } from "xmldom"
import { JSDOM } from "jsdom"
import { Suite } from "benchmark"
import { printBenchmark } from "./"
/*
(function () {
  const suite = new Suite("createDocument")

  const xmldomImpl = new XMLDOMImplementation()
  const jsdomImpl = new JSDOM().window.document.implementation
  
  suite.add("dom", () => {
    impl.createDocument(null, "", null)
  })

  suite.add("xmldom", () => {
    xmldomImpl.createDocument(null, "", null)
  })

  suite.add("jsdom", () => {
    jsdomImpl.createDocument(null, "", null)
  })

  suite.run()
  printBenchmark(suite)

})();

(function () {
  const suite = new Suite("createElement")
  
  const doc = impl.createDocument(null, "", null)
  const xmldomDoc = new XMLDOMImplementation().createDocument(null, "", null)
  const jsdomDoc = new JSDOM().window.document.implementation.createDocument(null, "", null)
  
  suite.add("dom", () => {
    doc.createElement("node")
  })

  suite.add("xmldom", () => {
    xmldomDoc.createElement("node")
  })

  suite.add("jsdom", () => {
    jsdomDoc.createElement("node")
  })

  suite.run()
  printBenchmark(suite)

})();
*/
(function () {
  const suite = new Suite("appendChild")
  
  const doc = impl.createDocument(null, "", null)
  const node = doc.createElement("node")
  const xmldomDoc = new XMLDOMImplementation().createDocument(null, "", null)
  const xmldomNode = xmldomDoc.createElement("node")
  const jsdomDoc = new JSDOM().window.document.implementation.createDocument(null, "", null)
  const jsdomNode = jsdomDoc.createElement("node")
  
  suite.add("dom", () => {
    doc.appendChild(node)
  })

  suite.add("xmldom", () => {
    xmldomDoc.appendChild(xmldomNode)
  })

  suite.add("jsdom", () => {
    jsdomDoc.appendChild(jsdomNode)
  })

  suite.run()
  printBenchmark(suite)

})();
