import { implementation as impl } from "../src"
import { DOMImplementation as XMLDOMImplementation } from "xmldom"
import { JSDOM } from "jsdom"
import { Suite } from "benchmark"
import { printBenchmark } from "./"

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

  suite.on("complete", () => printBenchmark(suite))
  suite.run()

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

  suite.on("complete", () => printBenchmark(suite))
  suite.run()

})();

(function () {
  const suite = new Suite("createDocument + createElement + appendChild")
   
  suite.add("dom", () => {
    const doc = impl.createDocument(null, "root", null)
    const root = doc.documentElement as any
    root.appendChild(doc.createElement("node"))
  })

  suite.add("xmldom", () => {
    const doc = new XMLDOMImplementation().createDocument(null, "", null)
    const root = doc.documentElement as any
    root.appendChild(doc.createElement("node"))
  })

  suite.add("jsdom", () => {
    const doc = new JSDOM().window.document.implementation.createDocument(null, "", null)
    const root = doc.documentElement as any
    root.appendChild(doc.createElement("node"))
  })

  suite.on("complete", () => printBenchmark(suite))
  suite.run()

})();
