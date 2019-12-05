import { XMLStringLexer } from "./XMLStringLexer"
import { TokenType } from './interfaces'
import { Document, Node } from "../dom/interfaces"
import {
  DocTypeToken, CDATAToken, CommentToken, TextToken, PIToken,
  ElementToken, ClosingTagToken
} from "./XMLToken"
import { globalStore } from "../util"
import { forEachObject } from "@oozcitak/util"
import { DOMAlgorithm, DOMFeatures } from "../algorithm/interfaces"
import { namespace as infraNamespace } from '@oozcitak/infra'

/**
 * Represents a parser for XML and HTML content.
 */
export class DOMParser {

  private algo: DOMAlgorithm

  /**
   * Initializes a new instance of `DOMParser`.
   * 
   * @param features - DOM features supported by algorithms. All features are
   * enabled by default unless explicity disabled.
   */
  constructor (features?: Partial<DOMFeatures> | boolean) {
    this.algo = globalStore.algorithm as DOMAlgorithm
    if (features !== undefined) {
      this.algo.setFeatures(features)
    }
  }

  /**
   * Parses the given string and returns a document object.
   * 
   * @param source - the string containing the document tree.
   * @param mimeType - the mime type of the document
   */
  parseFromString(source: string, mimeType: MimeType): Document {
    if (mimeType === "text/html") {
      throw new Error('HTML parser not implemented.')
    } else {
      const lexer = new XMLStringLexer(source)

      lexer.skipWhitespaceOnlyText = true

      const doc = this.algo.create.document()
      doc._contentType = mimeType

      let context: Node = doc
      for (const token of lexer) {
        switch (token.type) {
          case TokenType.Declaration:
            // no-op
            break
          case TokenType.DocType:
            const doctype = <DocTypeToken>token
            context.appendChild(doc.implementation.createDocumentType(
              doctype.name, doctype.pubId, doctype.sysId))
            break
          case TokenType.CDATA:
            const cdata = <CDATAToken>token
            context.appendChild(doc.createCDATASection(cdata.data))
            break
          case TokenType.Comment:
            const comment = <CommentToken>token
            context.appendChild(doc.createComment(comment.data))
            break
          case TokenType.PI:
            const pi = <PIToken>token
            context.appendChild(doc.createProcessingInstruction(
              pi.target, pi.data))
            break
          case TokenType.Text:
            const text = <TextToken>token
            context.appendChild(doc.createTextNode(text.data))
            break
          case TokenType.Element:
            const element = <ElementToken>token

            // inherit namespace from parent
            const [prefix, localName] = this.algo.namespace.extractQName(element.name)
            let namespace = context.lookupNamespaceURI(prefix)

            // override namespace if there is a namespace declaration
            // attribute
            for (let [attName, attValue] of forEachObject(element.attributes)) {
              if (attName === "xmlns") {
                namespace = attValue
              } else {
                const [attPrefix, attLocalName] = this.algo.namespace.extractQName(attName)
                if (attPrefix === "xmlns" && attLocalName === prefix) {
                  namespace = attValue
                }
              }
            }

            // create the DOM element node
            const elementNode = (namespace !== null ?
              doc.createElementNS(namespace, element.name) :
              doc.createElement(element.name))

            context.appendChild(elementNode)

            // assign attributes
            for (let [attName, attValue] of forEachObject(element.attributes)) {
              // skip the default namespace declaration attribute
              if (attName === "xmlns") {
                continue
              }

              const [attPrefix, attLocalName] = this.algo.namespace.extractQName(attName)
              if (attPrefix === "xmlns") {
                // prefixed namespace declaration attribute
                elementNode.setAttributeNS(infraNamespace.XMLNS, attName, attValue)
              } else {
                const attNamespace = elementNode.lookupNamespaceURI(attPrefix)
                if (attNamespace !== null && !elementNode.isDefaultNamespace(attNamespace)) {
                  elementNode.setAttributeNS(attNamespace, attName, attValue)
                } else {
                  elementNode.setAttribute(attName, attValue)
                }
              }
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
            if (context._parent) {
              context = context._parent
            }
            break
        }
      }
      return doc
    }
  }
}

/**
 * Defines the mime type of the document.
 */
export type MimeType = 'text/html' | 'text/xml' | 'application/xml' | 
  'application/xhtml+xml' | 'image/svg+xml'
