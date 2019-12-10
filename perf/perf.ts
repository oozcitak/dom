import { DOM, DOMParser } from "../lib"
import { DOMImplementation as XMLDOMImplementation, DOMParser as XMLDOMParser } from "xmldom"
import { JSDOM } from "jsdom"
import { Suite } from "benchmark"
import { processBenchmark } from "./"

(function () {
  const suite = new Suite("createDocument")
   
  const domImpl = new DOM(false).implementation
  const xmldomImpl = new XMLDOMImplementation()

  suite.add("dom", () => domImpl.createDocument(null, "", null))
  suite.add("xmldom", () => xmldomImpl.createDocument(null, "", null))

  suite.on("complete", () => processBenchmark(suite, "dom"))
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

  const domImpl = new DOM(false).implementation
  const xmldomImpl = new XMLDOMImplementation()
  const jsdomImpl = new JSDOM().window.document.implementation

  suite.add("dom", () => test(domImpl))
  suite.add("xmldom", () => test(xmldomImpl))
  suite.add("jsdom", () => test(jsdomImpl))

  suite.on("complete", () => processBenchmark(suite, "dom"))
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

  const domImpl = new DOM(false)
  const domParser = new DOMParser()
  const xmldomParser = new XMLDOMParser()
  const jsdomParser = JSDOM.fragment

  suite.add("dom", () => domParser.parseFromString(xml, "application/xml"))
  suite.add("xmldom", () => xmldomParser.parseFromString(xml, "application/xml"))
  suite.add("jsdom", () => jsdomParser(xml))

  suite.on("complete", () => processBenchmark(suite, "dom"))
  suite.run()

})();
