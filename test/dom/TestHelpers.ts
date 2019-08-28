import TestHelpersRoot from "../TestHelpers"
import { window } from '../../src/index'
import { 
  DOMImplementationImpl, AttrImpl, CDATASectionImpl, CharacterDataImpl, 
  CommentImpl, DocumentFragmentImpl, DocumentImpl, DocumentTypeImpl, 
  DOMException, DOMTokenListImpl, ElementImpl, 
  HTMLCollectionImpl, NamedNodeMapImpl, NodeFilterImpl, NodeImpl, NodeListImpl, 
  ProcessingInstructionImpl, ShadowRootImpl, StaticRangeImpl, TextImpl, 
  XMLDocumentImpl
} from '../../src/dom'
import { DOMParser, MimeType } from '../../src/dom/parser'
import { XMLSerializer } from '../../src/dom/serializer'
import { XMLStringLexer } from '../../src/dom/parser/XMLStringLexer'
import * as Token from '../../src/dom/parser/XMLToken'
import { TupleSet } from '../../src/dom/serializer/TupleSet'
import { WhatToShow, FilterResult } from '../../src/dom/interfaces'

export default class TestHelpers extends TestHelpersRoot {
  static Attr = AttrImpl
  static CDATASection = CDATASectionImpl
  static CharacterData = CharacterDataImpl
  static Comment = CommentImpl
  static DocumentFragment = DocumentFragmentImpl
  static Document = DocumentImpl
  static DocumentType = DocumentTypeImpl
  static DOMException = DOMException
  static DOMImplementation = DOMImplementationImpl
  static DOMTokenList = DOMTokenListImpl
  static Element = ElementImpl
  static HTMLCollection = HTMLCollectionImpl
  static NamedNodeMap = NamedNodeMapImpl
  static NodeFilter = NodeFilterImpl
  static Node = NodeImpl
  static NodeList = NodeListImpl
  static ProcessingInstruction = ProcessingInstructionImpl
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
  
  static  WhatToShow = WhatToShow
  static FilterResult = FilterResult
    
  /**
   * Returns the window object.
   */
  static window = window
  /**
   * Returns the DOM implementation object.
   */
  static dom = window.document.implementation
}