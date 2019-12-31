import { applyMixin } from "@oozcitak/util"

// Import implementation classes
import { AbortControllerImpl } from "./AbortControllerImpl"
import { AbortSignalImpl } from "./AbortSignalImpl"
import { AbstractRangeImpl } from "./AbstractRangeImpl"
import { AttrImpl } from "./AttrImpl"
import { CDATASectionImpl } from "./CDATASectionImpl"
import { CharacterDataImpl } from "./CharacterDataImpl"
import { ChildNodeImpl } from "./ChildNodeImpl"
import { CommentImpl } from "./CommentImpl"
import { CustomEventImpl } from "./CustomEventImpl"
import { DocumentFragmentImpl } from "./DocumentFragmentImpl"
import { DocumentImpl } from "./DocumentImpl"
import { DocumentOrShadowRootImpl } from "./DocumentOrShadowRootImpl"
import { DocumentTypeImpl } from "./DocumentTypeImpl"
import { dom } from "./DOMImpl"
import { DOMImplementationImpl } from "./DOMImplementationImpl"
import { DOMTokenListImpl } from "./DOMTokenListImpl"
import { ElementImpl } from "./ElementImpl"
import { EventImpl } from "./EventImpl"
import { EventTargetImpl } from "./EventTargetImpl"
import { HTMLCollectionImpl } from "./HTMLCollectionImpl"
import { MutationObserverImpl } from "./MutationObserverImpl"
import { MutationRecordImpl } from "./MutationRecordImpl"
import { NamedNodeMapImpl } from "./NamedNodeMapImpl"
import { NodeFilterImpl } from "./NodeFilterImpl"
import { NodeImpl } from "./NodeImpl"
import { NodeIteratorImpl } from "./NodeIteratorImpl"
import { NodeListImpl } from "./NodeListImpl"
import { NodeListStaticImpl } from "./NodeListStaticImpl"
import { NonDocumentTypeChildNodeImpl } from "./NonDocumentTypeChildNodeImpl"
import { NonElementParentNodeImpl } from "./NonElementParentNodeImpl"
import { ParentNodeImpl } from "./ParentNodeImpl"
import { ProcessingInstructionImpl } from "./ProcessingInstructionImpl"
import { RangeImpl } from "./RangeImpl"
import { ShadowRootImpl } from "./ShadowRootImpl"
import { SlotableImpl } from "./SlotableImpl"
import { StaticRangeImpl } from "./StaticRangeImpl"
import { TextImpl } from "./TextImpl"
import { TraverserImpl } from "./TraverserImpl"
import { TreeWalkerImpl } from "./TreeWalkerImpl"
import { WindowImpl } from "./WindowImpl"
import { XMLDocumentImpl } from "./XMLDocumentImpl"

// Apply mixins
// ChildNode
applyMixin(ElementImpl, ChildNodeImpl)
applyMixin(CharacterDataImpl, ChildNodeImpl)
applyMixin(DocumentTypeImpl, ChildNodeImpl)
// DocumentOrShadowRoot
applyMixin(DocumentImpl, DocumentOrShadowRootImpl)
applyMixin(ShadowRootImpl, DocumentOrShadowRootImpl)
// NonDocumentTypeChildNode
applyMixin(ElementImpl, NonDocumentTypeChildNodeImpl)
applyMixin(CharacterDataImpl, NonDocumentTypeChildNodeImpl)
// NonElementParentNode
applyMixin(DocumentImpl, NonElementParentNodeImpl)
applyMixin(DocumentFragmentImpl, NonElementParentNodeImpl)
// ParentNode
applyMixin(DocumentImpl, ParentNodeImpl)
applyMixin(DocumentFragmentImpl, ParentNodeImpl)
applyMixin(ElementImpl, ParentNodeImpl)
// Slotable
applyMixin(TextImpl, SlotableImpl)
applyMixin(ElementImpl, SlotableImpl)

// Export classes
export {
  AbortControllerImpl as AbortController,
  AbortSignalImpl as AbortSignal,
  AbstractRangeImpl as AbstractRange,
  AttrImpl as Attr,
  CDATASectionImpl as CDATASection,
  CharacterDataImpl as CharacterData,
  CommentImpl as Comment,
  CustomEventImpl as CustomEvent,
  DocumentFragmentImpl as DocumentFragment,
  DocumentImpl as Document,
  DocumentTypeImpl as DocumentType,
  dom,
  DOMImplementationImpl as DOMImplementation,
  DOMTokenListImpl as DOMTokenList,
  ElementImpl as Element,
  EventImpl as Event,
  EventTargetImpl as EventTarget,
  HTMLCollectionImpl as HTMLCollection,
  MutationObserverImpl as MutationObserver,
  MutationRecordImpl as MutationRecord,
  NamedNodeMapImpl as NamedNodeMap,
  NodeFilterImpl as NodeFilter,
  NodeImpl as Node,
  NodeIteratorImpl as NodeIterator,
  NodeListImpl as NodeList,
  NodeListStaticImpl as NodeListStatic,
  ProcessingInstructionImpl as ProcessingInstruction,
  RangeImpl as Range,
  ShadowRootImpl as ShadowRoot,
  StaticRangeImpl as StaticRange,
  TextImpl as Text,
  TraverserImpl as Traverser,
  TreeWalkerImpl as TreeWalker,
  WindowImpl as Window,
  XMLDocumentImpl as XMLDocument
}

