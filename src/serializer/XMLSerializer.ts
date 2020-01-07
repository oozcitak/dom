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
    /**
     * From: https://w3c.github.io/DOM-Parsing/#dfn-serializing-an-attribute-value
     * 
     * 1. If the require well-formed flag is set (its value is true), and 
     * attribute value contains characters that are not matched by the XML Char
     * production, then throw an exception; the serialization of this attribute
     * value would fail to produce a well-formed element serialization.
     * 2. If attribute value is null, then return the empty string.
     * 3. Otherwise, attribute value is a string. Return the value of attribute
     * value, first replacing any occurrences of the following:
     * - "&" with "&amp;"
     * - """ with "&quot;"
     * - "<" with "&lt;"
     * - ">" with "&gt;"
     * NOTE
     * This matches behavior present in browsers, and goes above and beyond the
     * grammar requirement in the XML specification's AttValue production by
     * also replacing ">" characters.
     */
    let result = ""
    for (let i = 0; i < value.length; i++) {
      const c = value[i]
      if (c === "\"")
        result += "&quot;"
      else if (c === "&")
        result += "&amp;"
      else if (c === "<")
        result += "&lt;"
      else if (c === ">")
        result += "&gt;"
      else
        result += c
    }
    return result
  }

  /**
   * Produces an XML serialization of a text node data.
   * 
   * @param data - text node data to serialize
   */
  private _serializeTextData(data: string): string {
    /**
     * From: https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
     * 
     * 1. If the require well-formed flag is set (its value is true), and 
     * node's data contains characters that are not matched by the XML Char
     *  production, then throw an exception; the serialization of this node's
     * data would not be well-formed.
     * 2. Let markup be the value of node's data.
     * 3. Replace any occurrences of "&" in markup by "&amp;".
     * 4. Replace any occurrences of "<" in markup by "&lt;".
     * 5. Replace any occurrences of ">" in markup by "&gt;".
     * 6. Return the value of markup.
     */
    let result = ""
    for (let i = 0; i < data.length; i++) {
      const c = data[i]
      if (c === "&")
        result += "&amp;"
      else if (c === "<")
        result += "&lt;"
      else if (c === ">")
        result += "&gt;"
      else
        result += c
    }
    return result
  }

}