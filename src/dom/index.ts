import { applyMixin } from '../util'

// Import implementation classes
import { AbortControllerImpl } from './AbortControllerImpl'
import { AbortSignalImpl } from './AbortSignalImpl'
import { AbstractRangeImpl } from './AbstractRangeImpl'
import { AttrImpl } from './AttrImpl'
import { CDATASectionImpl } from './CDATASectionImpl'
import { CharacterDataImpl } from './CharacterDataImpl'
import { ChildNodeImpl } from './ChildNodeImpl'
import { CommentImpl } from './CommentImpl'
import { CustomEventImpl } from './CustomEventImpl'
import { DocumentFragmentImpl } from './DocumentFragmentImpl'
import { DocumentImpl } from './DocumentImpl'
import { DocumentOrShadowRootImpl } from './DocumentOrShadowRootImpl'
import { DocumentTypeImpl } from './DocumentTypeImpl'
import { DOMException } from './DOMException'
import { DOMImplementationImpl } from './DOMImplementationImpl'
import { DOMTokenListImpl } from './DOMTokenListImpl'
import { ElementImpl } from './ElementImpl'
import { EventImpl } from './EventImpl'
import { EventTargetImpl } from './EventTargetImpl'
import { HTMLCollectionImpl } from './HTMLCollectionImpl'
import { MutationObserverImpl } from './MutationObserverImpl'
import { MutationRecordImpl } from './MutationRecordImpl'
import { NamedNodeMapImpl } from './NamedNodeMapImpl'
import { NodeFilterImpl } from './NodeFilterImpl'
import { NodeImpl } from './NodeImpl'
import { NodeIteratorImpl } from './NodeIteratorImpl'
import { NodeListImpl } from './NodeListImpl'
import { NodeListStaticImpl } from './NodeListStaticImpl'
import { NonDocumentTypeChildNodeImpl } from './NonDocumentTypeChildNodeImpl'
import { NonElementParentNodeImpl } from './NonElementParentNodeImpl'
import { ParentNodeImpl } from './ParentNodeImpl'
import { ProcessingInstructionImpl } from './ProcessingInstructionImpl'
import { RangeImpl } from './RangeImpl'
import { ShadowRootImpl } from './ShadowRootImpl'
import { SlotableImpl } from './SlotableImpl'
import { StaticRangeImpl } from './StaticRangeImpl'
import { TextImpl } from './TextImpl'
import { TraverserImpl } from './TraverserImpl'
import { TreeWalkerImpl } from './TreeWalkerImpl'
import { WindowImpl } from './WindowImpl'
import { XMLDocumentImpl } from './XMLDocumentImpl'

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
  AbortControllerImpl, AbortSignalImpl, AbstractRangeImpl, AttrImpl,
  CDATASectionImpl, CharacterDataImpl, CommentImpl, CustomEventImpl,
  DocumentFragmentImpl, DocumentImpl, DocumentTypeImpl, DOMException,
  DOMImplementationImpl, DOMTokenListImpl, ElementImpl, EventImpl,
  EventTargetImpl, HTMLCollectionImpl, MutationObserverImpl, MutationRecordImpl,
  NamedNodeMapImpl, NodeFilterImpl, NodeImpl, NodeIteratorImpl, NodeListImpl,
  NodeListStaticImpl, ProcessingInstructionImpl, RangeImpl, ShadowRootImpl,
  StaticRangeImpl, TextImpl, TraverserImpl, TreeWalkerImpl, WindowImpl,
  XMLDocumentImpl
}
export { DOMParser, MimeType } from './parser'
export { XMLSerializer, PreSerializer } from './serializer'
export { XMLSpec } from './spec'
