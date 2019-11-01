import dedent from "dedent"
import { window } from '../src/index'
import {
  AbortControllerImpl, AbortSignalImpl, AttrImpl, CDATASectionImpl, 
  CharacterDataImpl, CommentImpl, CustomEventImpl, DocumentFragmentImpl,
  DocumentImpl, DocumentTypeImpl, DOMException, DOMImplementationImpl,
  DOMTokenListImpl, ElementImpl, EventImpl, HTMLCollectionImpl, 
  MutationObserverImpl, MutationRecordImpl,
  NamedNodeMapImpl, NodeFilterImpl, NodeImpl, NodeListImpl,
  ProcessingInstructionImpl, ShadowRootImpl, StaticRangeImpl, TextImpl,
  XMLDocumentImpl, RangeImpl
} from '../src/dom'
// DOMParser
import { DOMParser, MimeType } from '../src/parser'
import { XMLStringLexer } from '../src/parser/XMLStringLexer'
import * as Token from '../src/parser/XMLToken'
// XMLSerializer
import { XMLSerializer } from '../src/serializer'
import { TupleSet } from '../src/serializer/TupleSet'
// DOMAlgorithm
import { DOMAlgorithmImpl } from '../src/algorithm/DOMAlgorithmImpl'

import { WhatToShow, FilterResult } from '../src/dom/interfaces'
import { ElementInternal } from "../src/dom/interfacesInternal"
import * as util from '../src/util'

export default class TestHelpers {
  /**
   * De-indents template literals.
   */
  static t = dedent

  /**
   * Returns a string representation of the XML tree rooted at `node`.
   * 
   * @param node - the root node of the tree
   * @param level - indentation level
   */
  static printTree(node: any, level?: number | undefined): string {
    const removeLastNewline = (level === undefined)
    level = level || 0
    const indent = '  '.repeat(level)
    let str = ''
    switch (node.nodeType) {
      case 1: // Element
        str = `${indent}${node.tagName}`
        if(node.namespaceURI) {
          str += ` (ns:${node.namespaceURI})`
        }
        for (const attr of node.attributes) {
          str += ` ${attr.name}="${attr.value}"`
          if(attr.namespaceURI) {
            str += ` (ns:${attr.namespaceURI})`
          }
        }
        str += `\n`
        break
      case 3: // Text
        str = `${indent}# ${node.data}\n`
        break
      case 4: // CData
        str = `${indent}$ ${node.data}\n`
        break
      case 7: // ProcessingInstruction
        if (node.data) {
          str = `${indent}? ${node.target} ${node.data}\n`
        } else {
          str = `${indent}? ${node.target}\n`
        }
        break
      case 8: // Comment
        str = `${indent}! ${node.data}\n`
        break
      case 9: // Document
      case 11: // DocumentFragment
        level = -1
        break
      case 10: // DocumentType
        str = `${indent}!DOCTYPE ${node.name}`
        if (node.publicId && node.systemId)
          str += ` PUBLIC ${node.publicId} ${node.systemId}`
        else if (node.publicId)
          str += ` PUBLIC ${node.publicId}`
        else if (node.systemId)
          str += ` SYSTEM ${node.systemId}`
        str += `\n`
        break
      default:
        throw new Error('Unknown node type')
    }
    for (const child of node.childNodes) {
      str += TestHelpers.printTree(child, level + 1)
    }

    // remove last newline
    if (removeLastNewline)
      str = str.slice(0, -1)

    return str
  }

  static AbortController = AbortControllerImpl
  static AbortSignal = AbortSignalImpl
  static Attr = AttrImpl
  static CDATASection = CDATASectionImpl
  static CharacterData = CharacterDataImpl
  static Comment = CommentImpl
  static CustomEvent = CustomEventImpl
  static DocumentFragment = DocumentFragmentImpl
  static Document = DocumentImpl
  static DocumentType = DocumentTypeImpl
  static DOMException = DOMException
  static DOMImplementation = DOMImplementationImpl
  static DOMTokenList = DOMTokenListImpl
  static Element = ElementImpl
  static Event = EventImpl
  static HTMLCollection = HTMLCollectionImpl
  static MutationObserver = MutationObserverImpl
  static MutationRecord = MutationRecordImpl
  static NamedNodeMap = NamedNodeMapImpl
  static NodeFilter = NodeFilterImpl
  static Node = NodeImpl
  static NodeList = NodeListImpl
  static ProcessingInstruction = ProcessingInstructionImpl
  static Range = RangeImpl
  static ShadowRoot = ShadowRootImpl
  static StaticRange = StaticRangeImpl
  static Text = TextImpl
  static XMLDocument = XMLDocumentImpl

  static DOMParser = DOMParser
  static MimeType = MimeType
  static XMLSerializer = XMLSerializer

  static XMLStringLexer = XMLStringLexer
  static Token = Token

  static TupleSet = TupleSet

  static WhatToShow = WhatToShow
  static FilterResult = FilterResult

  /**
   * Returns the algorithm object.
   */
  static algo = new DOMAlgorithmImpl()
  /**
   * Returns the window object.
   */
  static window = window
  /**
   * Returns the DOM implementation object.
   */
  static dom = window.document.implementation
  /**
   * Returns the root element of a new document.
   */
  static get newDoc(): ElementInternal {
    const doc = window.document.implementation.createDocument('ns', 'root')

    if (!doc.documentElement)
      throw new Error("documentElement is null")
  
    return doc.documentElement as ElementInternal
  }
  
  static util = util
}