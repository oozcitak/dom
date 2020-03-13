import { XMLStringLexer } from "./XMLStringLexer"
import { TokenType, DeclarationToken } from "./interfaces"
import { Document, Node } from "../dom/interfaces"
import {
  DocTypeToken, CDATAToken, CommentToken, TextToken, PIToken,
  ElementToken, ClosingTagToken
} from "./interfaces"
import { namespace as infraNamespace } from "@oozcitak/infra"
import {
  create_document, namespace_extractQName, xml_isName, xml_isLegalChar,
  xml_isPubidChar
} from "../algorithm"
import { LocalNameSet } from "../serializer/LocalNameSet"

/**
 * Represents a parser for XML content.
 * 
 * See: https://html.spec.whatwg.org/#xml-parser
 */
export class XMLParserImpl {

  /** 
   * Parses XML content.
   * 
   * @param source - a string containing XML content
   */
  parse(source: string): Document {
    const lexer = new XMLStringLexer(source, { skipWhitespaceOnlyText: true })

    const doc = create_document()

    let context: Node = doc
    let token = lexer.nextToken()
    while (token.type !== TokenType.EOF) {
      switch (token.type) {
        case TokenType.Declaration:
          const declaration = <DeclarationToken>token
          if (declaration.version !== "1.0") {
            throw new Error("Invalid xml version: " + declaration.version)
          }
          break
        case TokenType.DocType:
          const doctype = <DocTypeToken>token
          if (!xml_isPubidChar(doctype.pubId)) {
            throw new Error("DocType public identifier does not match PubidChar construct.")
          }
          if (!xml_isLegalChar(doctype.sysId) ||
            (doctype.sysId.indexOf('"') !== -1 && doctype.sysId.indexOf("'") !== -1)) {
            throw new Error("DocType system identifier contains invalid characters.")
          }
          context.appendChild(doc.implementation.createDocumentType(
            doctype.name, doctype.pubId, doctype.sysId))
          break
        case TokenType.CDATA:
          const cdata = <CDATAToken>token
          if (!xml_isLegalChar(cdata.data) ||
            cdata.data.indexOf("]]>") !== -1) {
            throw new Error("CDATA contains invalid characters.")
          }
          context.appendChild(doc.createCDATASection(cdata.data))
          break
        case TokenType.Comment:
          const comment = <CommentToken>token
          if (!xml_isLegalChar(comment.data) ||
            comment.data.indexOf("--") !== -1 || comment.data.endsWith("-")) {
            throw new Error("Comment data contains invalid characters.")
          }
          context.appendChild(doc.createComment(comment.data))
          break
        case TokenType.PI:
          const pi = <PIToken>token
          if (pi.target.indexOf(":") !== -1 || (/^xml$/i).test(pi.target)) {
            throw new Error("Processing instruction target contains invalid characters.")
          }
          if (!xml_isLegalChar(pi.data) || pi.data.indexOf("?>") !== -1) {
            throw new Error("Processing instruction data contains invalid characters.")
          }
          context.appendChild(doc.createProcessingInstruction(
            pi.target, pi.data))
          break
        case TokenType.Text:
          const text = <TextToken>token
          if (!xml_isLegalChar(text.data)) {
            throw new Error("Text data contains invalid characters.")
          }
          context.appendChild(doc.createTextNode(text.data))
          break
        case TokenType.Element:
          const element = <ElementToken>token

          // inherit namespace from parent
          const [prefix, localName] = namespace_extractQName(element.name)
          if (localName.indexOf(":") !== -1 || !xml_isName(localName)) {
            throw new Error("Node local name contains invalid characters.")
          }
          if (prefix === "xmlns") {
            throw new Error("An element cannot have the 'xmlns' prefix.")
          }
          let namespace = context.lookupNamespaceURI(prefix)

          // override namespace if there is a namespace declaration
          // attribute
          // also lookup namespace declaration attributes
          const nsDeclarations: { [key: string]: string } = {}
          for (const [attName, attValue] of element.attributes) {
            if (attName === "xmlns") {
              namespace = attValue
            } else {
              const [attPrefix, attLocalName] = namespace_extractQName(attName)
              if (attPrefix === "xmlns") {
                if (attLocalName === prefix) {
                  namespace = attValue
                }
                nsDeclarations[attLocalName] = attValue
              }
            }
          }

          // create the DOM element node
          const elementNode = (namespace !== null ?
            doc.createElementNS(namespace, element.name) :
            doc.createElement(element.name))

          context.appendChild(elementNode)

          // assign attributes
          const localNameSet = new LocalNameSet()

          for (const [attName, attValue] of element.attributes) {
            const [attPrefix, attLocalName] = namespace_extractQName(attName)
            let attNamespace: string | null = null
            if (attPrefix === "xmlns" || (attPrefix === null && attLocalName === "xmlns")) {
              // namespace declaration attribute
              attNamespace = infraNamespace.XMLNS
            } else {
              attNamespace = elementNode.lookupNamespaceURI(attPrefix)
              if (attNamespace !== null && elementNode.isDefaultNamespace(attNamespace)) {
                attNamespace = null
              } else if (attNamespace === null && attPrefix !== null) {
                attNamespace = nsDeclarations[attPrefix] || null
              }
            }
            if (localNameSet.has(attNamespace, attLocalName)) {
              throw new Error("Element contains duplicate attributes.")
            }
            localNameSet.set(attNamespace, attLocalName)
            if (attNamespace === infraNamespace.XMLNS) {
              if (attValue === infraNamespace.XMLNS) {
                throw new Error("XMLNS namespace is reserved.")
              }
            }
            if (attLocalName.indexOf(":") !== -1 || !xml_isName(attLocalName)) {
              throw new Error("Attribute local name contains invalid characters.")
            }

            if (attPrefix === "xmlns" && attValue === "") {
              throw new Error("Empty XML namespace is not allowed.")
            }

            if (attNamespace !== null)
              elementNode.setAttributeNS(attNamespace, attName, attValue)
            else
              elementNode.setAttribute(attName, attValue)
          }

          if (!element.selfClosing) {
            context = <Node>elementNode
          }
          break
        case TokenType.ClosingTag:
          const closingTag = <ClosingTagToken>token
          if (closingTag.name !== context.nodeName) {
            throw new Error('Closing tag name does not match opening tag name.')
          }
          /* istanbul ignore else */
          if (context._parent) {
            context = context._parent
          }
          break
      }

      token = lexer.nextToken()
    }
    return doc
  }
}
