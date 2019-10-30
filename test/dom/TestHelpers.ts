import TestHelpersRoot from "../TestHelpers"
import { window } from '../../src/index'
import {
  AbortControllerImpl, AbortSignalImpl, AttrImpl, CDATASectionImpl, 
  CharacterDataImpl, CommentImpl, CustomEventImpl, DocumentFragmentImpl,
  DocumentImpl, DocumentTypeImpl, DOMException, DOMImplementationImpl,
  DOMTokenListImpl, ElementImpl, EventImpl, HTMLCollectionImpl, 
  MutationObserverImpl, MutationRecordImpl,
  NamedNodeMapImpl, NodeFilterImpl, NodeImpl, NodeListImpl,
  ProcessingInstructionImpl, ShadowRootImpl, StaticRangeImpl, TextImpl,
  XMLDocumentImpl, RangeImpl
} from '../../src/dom'
import { DOMParser, MimeType } from '../../src/dom/parser'
import { XMLSerializer } from '../../src/dom/serializer'
import { XMLStringLexer } from '../../src/dom/parser/XMLStringLexer'
import * as Token from '../../src/dom/parser/XMLToken'
import { TupleSet } from '../../src/dom/serializer/TupleSet'
import { WhatToShow, FilterResult } from '../../src/dom/interfaces'
import { DOMAlgorithmImpl } from '../../src/dom/algorithm/DOMAlgorithmImpl'
import { ElementInternal } from "../../src/dom/interfacesInternal"

export default class TestHelpers extends TestHelpersRoot {
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
} 