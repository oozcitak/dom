import { Node } from "../dom/interfaces"
import { PreSerializer } from "./PreSerializer"

/**
 * Represents an XML serializer.
 * 
 * Implements: https://www.w3.org/TR/DOM-Parsing/#serializing
 */
export class XMLSerializer {

  private _xmlVersion: "1.0" | "1.1"

  /**
   * Initializes a new instance of `XMLSerializer`.
   * 
   * @param xmlVersion - XML specification version
   */
  constructor(xmlVersion: "1.0" | "1.1" = "1.0") {
    this._xmlVersion = xmlVersion
  }

  /**
   * Produces an XML serialization of the given node.
   * 
   * @param node - node to serialize
   */
  serializeToString(node: Node): string {
    let markup = ""
    const pre = new PreSerializer(this._xmlVersion, {
      openTagBegin: (name) => markup += "<" + name,
      openTagEnd: (selfClosing, voidElement) => markup += voidElement ? " />" : selfClosing ? "/>" : ">",
      closeTag: (name) => markup += "</" + name + ">",
      namespace: (name, value) => markup += " " + name + "=\"" + this._serializeAttributeValue(value) + "\"",
      attribute: (name, value) => markup += " " + name + "=\"" + this._serializeAttributeValue(value) + "\"",
      comment: (data) => markup += "<!--" + data + "-->",
      text: (data) => markup += this._serializeTextData(data),
      instruction: (target, data) => markup += "<?" + target + " " + data + "?>",
      cdata: (data) => markup += "<![CDATA[" + data + "]]>",
      docType: (name, publicId, systemId) =>
        markup += publicId && systemId ?
          "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\" \"" + systemId + "\">"
          : publicId ?
            "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\">"
            : systemId ?
              "<!DOCTYPE " + name + " SYSTEM \"" + systemId + "\">"
              :
              "<!DOCTYPE " + name + ">"
    })
    pre.serialize(node, false)
    return markup
  }

  /**
   * Produces an XML serialization of an attribute value.
   * 
   * @param value - attribute value
   */
  private _serializeAttributeValue(value: string): string {
    // Although XML spec allows ">" in attribute values, we replace ">" 
    // to match the behavior present in browsers    
    return value.replace('"', "&quot;")
      .replace("&", "&amp;")
      .replace("<", "&lt;")
      .replace(">", "&gt;")
  }

  /**
   * Produces an XML serialization of a text node data.
   * 
   * @param data - text node data to serialize
   */
  private _serializeTextData(data: string): string {
    return data.replace("&", "&amp;")
      .replace("<", "&lt;")
      .replace(">", "&gt;")
  }

}