import dedent from "dedent"
import { suite, test } from 'node:test'
import { deepEqual, throws, doesNotThrow, notDeepEqual, strictEqual, notStrictEqual } from 'node:assert'
import {
  AbortController, AbortSignal, Attr, CDATASection,
  CharacterData, Comment, CustomEvent, DocumentFragment,
  Document, DocumentType, DOMImplementation,
  DOMTokenList, Element, Event, HTMLCollection,
  MutationObserver, MutationRecord,
  NamedNodeMap, NodeFilter, Node, NodeList,
  ProcessingInstruction, ShadowRoot, StaticRange, Text,
  XMLDocument, Range, dom
} from "../src/dom"
// DOMParser
import { DOMParser } from "../src/parser"
import { XMLStringLexer } from "../src/parser/XMLStringLexer"
// XMLSerializer
import { XMLSerializer } from "../src/serializer"
import { LocalNameSet } from "../src/serializer/LocalNameSet"

import { WhatToShow, FilterResult } from "../src/dom/interfaces"
import * as util from "../src/util"

export default class TestHelpers {
  static suite = suite
  static test = test
  static deepEqual = deepEqual
  static notDeepEqual = notDeepEqual
  static strictEqual = strictEqual
  static notStrictEqual = notStrictEqual
  static throws = throws
  static doesNotThrow = doesNotThrow

  /**
   * De-indents template literals.
   */
  static t = dedent

  /**
   * Runs callback for each character in range.
   *
   * @param c1 - start character, inclusive
   * @param c2 - end character, inclusive
   * @param callback - callback function
   */
  static charRange(c1: number | string, c2: number | string, callback: ((c: string) => any)): void {
    const n1 = (typeof c1 === 'number' ? c1 : (c1.codePointAt(0) || 0))
    const n2 = (typeof c2 === 'number' ? c2 : (c2.codePointAt(0) || 0))
    for (let n = n1; n <= n2; n++) {
      callback(String.fromCodePoint(n))
    }
  }

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
        if (node.namespaceURI) {
          str += ` (ns:${node.namespaceURI})`
        }
        for (const attr of node.attributes) {
          str += ` ${attr.name}="${attr.value}"`
          if (attr.namespaceURI) {
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

  static AbortController = AbortController
  static AbortSignal = AbortSignal
  static Attr = Attr
  static CDATASection = CDATASection
  static CharacterData = CharacterData
  static Comment = Comment
  static CustomEvent = CustomEvent
  static DocumentFragment = DocumentFragment
  static Document = Document
  static DocumentType = DocumentType
  static DOMImplementation = DOMImplementation
  static DOMTokenList = DOMTokenList
  static Element = Element
  static Event = Event
  static HTMLCollection = HTMLCollection
  static MutationObserver = MutationObserver
  static MutationRecord = MutationRecord
  static NamedNodeMap = NamedNodeMap
  static NodeFilter = NodeFilter
  static Node = Node
  static NodeList = NodeList
  static ProcessingInstruction = ProcessingInstruction
  static Range = Range
  static ShadowRoot = ShadowRoot
  static StaticRange = StaticRange
  static Text = Text
  static XMLDocument = XMLDocument

  static DOMParser = DOMParser
  static XMLSerializer = XMLSerializer

  static LocalNameSet = LocalNameSet
  static XMLStringLexer = XMLStringLexer

  static WhatToShow = WhatToShow
  static FilterResult = FilterResult

  /**
   * Returns the window object.
   */
  static window = dom.window
  /**
   * Returns the DOM implementation object.
   */
  static dom = new DOMImplementation()
  /**
   * Returns the root element of a new document.
   */
  static get newDoc(): Element {
    const doc = TestHelpers.dom.createDocument('ns', 'root')

    if (!doc.documentElement)
      throw new Error("documentElement is null")

    return doc.documentElement as Element
  }

  static util = util
}