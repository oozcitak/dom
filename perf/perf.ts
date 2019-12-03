import { implementation as impl, parser } from "../lib"
import { DOMParser } from "../lib/parser"
import { DOMImplementation as XMLDOMImplementation, DOMParser as XMLDOMParser } from "xmldom"
import { JSDOM } from "jsdom"
import { Suite } from "benchmark"
import { printBenchmark } from "./"

(function () {
  const suite = new Suite("createDocument")

  const xmldomImpl = new XMLDOMImplementation()
  const jsdomImpl = new JSDOM().window.document.implementation
  
  function test(dom: any) {
    dom.createDocument(null, "", null)
  }

  suite.add("dom", () => test(impl))
  suite.add("xmldom", () => test(xmldomImpl))
  suite.add("jsdom", () => test(jsdomImpl))

  suite.on("complete", () => printBenchmark(suite))
  suite.run()

})();

(function () {
  const suite = new Suite("createElement")
  
  const doc = impl.createDocument(null, "", null)
  const xmldomDoc = new XMLDOMImplementation().createDocument(null, "", null)
  const jsdomDoc = new JSDOM().window.document.implementation.createDocument(null, "", null)
  
  function test(doc: any) {
    doc.createElement("node")
  }

  suite.add("dom", () => test(doc))
  suite.add("xmldom", () => test(xmldomDoc))
  suite.add("jsdom", () => test(jsdomDoc))

  suite.on("complete", () => printBenchmark(suite))
  suite.run()

})();

(function () {
  const suite = new Suite("createDocument + createElement + appendChild")
   
  function test(dom: any) {
    const doc = dom.createDocument(null, "", null)
    const root = doc.createElement("root")
    doc.appendChild(root)
    for (let i = 0; i < 100; i++) {
      const node = doc.createElement("node" + i.toString())
      root.appendChild(node)
    }
  }

  const xmldomImpl = new XMLDOMImplementation()
  const jsdomImpl = new JSDOM().window.document.implementation

  suite.add("dom", () => test(impl))
  suite.add("xmldom", () => test(xmldomImpl))
  suite.add("jsdom", () => test(jsdomImpl))

  suite.on("complete", () => printBenchmark(suite))
  suite.run()

})();

(function () {
  const suite = new Suite("parser")
  
  const xml = `
  <?xml version="1.0"?>
  <topgun>
    <pilots>
      <pilot callsign="Iceman" rank="Lieutenant">Tom Kazansky</pilot>
      <pilot callsign="Maverick" rank="Lieutenant">Pete Mitchell</pilot>
      <pilot callsign="Goose" rank="Lieutenant (j.g.)">Nick Bradshaw</pilot>
    </pilots>
    <hangar>
      <aircraft>F-14 Tomcat</aircraft>
      <aircraft>MiG-28</aircraft>
    </hangar>
  </topgun>  
  `

  suite.add("dom", () => new DOMParser().parseFromString(xml, "application/xml"))
  suite.add("xmldom", () => new XMLDOMParser().parseFromString(xml, "application/xml"))
  suite.add("jsdom", () => JSDOM.fragment(xml))

  suite.on("complete", () => printBenchmark(suite))
  suite.run()

})();