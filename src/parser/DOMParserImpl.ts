import { DOMParser, MimeType } from "./interfaces"
import { Document } from "../dom/interfaces"
import { create_xmlDocument } from "../algorithm"
import { XMLParserImpl } from "./XMLParserImpl"

/**
 * Represents a parser for XML and HTML content.
 * 
 * See: https://w3c.github.io/DOM-Parsing/#the-domparser-interface
 */
export class DOMParserImpl implements DOMParser {

  /** @inheritdoc */
  parseFromString(source: string, mimeType: MimeType): Document {
    if (mimeType === "text/html")
      throw new Error('HTML parser not implemented.')

    try {
      const parser = new XMLParserImpl()
      const doc = parser.parse(source)
      doc._contentType = mimeType
      return doc
    } catch (e) {
      const doc = create_xmlDocument()
      const root = doc.createElementNS(
        "http://www.mozilla.org/newlayout/xml/parsererror.xml", "parsererror") 
      const ele = doc.createElement("error")
      ele.setAttribute("message", (e as Error).message)
      root.appendChild(ele)
      doc.appendChild(root)
      return doc
    }
  }
}
