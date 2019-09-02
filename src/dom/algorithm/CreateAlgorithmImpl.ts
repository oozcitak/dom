import { CreateAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import {
  DocumentInternal, ElementInternal, HTMLCollectionInternal, NodeInternal,
  DocumentFragmentInternal, TextInternal, CDATASectionInternal, CommentInternal,
  ProcessingInstructionInternal, AttrInternal, DOMImplementationInternal,
  DocumentTypeInternal, RangeInternal, NodeListInternal, NamedNodeMapInternal,
  NodeIteratorInternal, TreeWalkerInternal, NodeFilterInternal,
  MutationRecordInternal, XMLDocumentInternal, DOMTokenListInternal,
  ShadowRootInternal, AbortControllerInternal, AbortSignalInternal
} from '../interfacesInternal'
import {
  TextImpl, CDATASectionImpl, ProcessingInstructionImpl, DOMImplementationImpl,
  CommentImpl, DocumentImpl, DocumentFragmentImpl, HTMLCollectionImpl,
  NamedNodeMapImpl, ElementImpl, DocumentTypeImpl, AttrImpl, NodeListImpl,
  NodeListStaticImpl, RangeImpl, NodeIteratorImpl, TreeWalkerImpl,
  NodeFilterImpl, MutationRecordImpl, XMLDocumentImpl, DOMTokenListImpl, 
  ShadowRootImpl, AbortControllerImpl, AbortSignalImpl
} from '..'
import { BoundaryPoint } from '../interfaces'

/**
 * Contains algorithms for creating DOM objects.
 */
export class CreateAlgorithmImpl extends SubAlgorithmImpl implements CreateAlgorithm {

  /**
   * Initializes a new `CreateAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  domImplementation(document: DocumentInternal): DOMImplementationInternal {
    return DOMImplementationImpl._create(document)
  }

  /** @inheritdoc */
  xmlDocument(): XMLDocumentInternal {
    return new XMLDocumentImpl()
  }

  /** @inheritdoc */
  document(): DocumentInternal {
    return new DocumentImpl()
  }

  /** @inheritdoc */
  abortController(): AbortControllerInternal {
    return new AbortControllerImpl()
  }

  /** @inheritdoc */
  abortSignal(): AbortSignalInternal {
    return AbortSignalImpl._create()
  }

  /** @inheritdoc */
  documentType(document: DocumentInternal, name: string, publicId: string = '',
    systemId: string = ''): DocumentTypeInternal {
    return DocumentTypeImpl._create(document, name, publicId, systemId)
  }

  /** @inheritdoc */
  element(document: DocumentInternal, localName: string, namespace: string | null = null,
    prefix: string | null = null): ElementInternal {
    return ElementImpl._create(document, localName, namespace, prefix)
  }

  /** @inheritdoc */
  documentFragment(document: DocumentInternal): DocumentFragmentInternal {
    return DocumentFragmentImpl._create(document)
  }

  /** @inheritdoc */
  shadowRoot(document: DocumentInternal, host: ElementInternal): ShadowRootInternal {
    return ShadowRootImpl._create(document, host)
  }

  /** @inheritdoc */
  attr(document: DocumentInternal, localName: string): AttrInternal {
    return AttrImpl._create(document, localName)
  }

  /** @inheritdoc */
  text(document: DocumentInternal, data: string = ''): TextInternal {
    return TextImpl._create(document, data)
  }

  /** @inheritdoc */
  cdataSection(document: DocumentInternal, data: string = ''): CDATASectionInternal {
    return CDATASectionImpl._create(document, data)
  }

  /** @inheritdoc */
  comment(document: DocumentInternal, data: string = ''): CommentInternal {
    return CommentImpl._create(document, data)
  }

  /** @inheritdoc */
  processingInstruction(document: DocumentInternal, target: string,
    data: string = ''): ProcessingInstructionInternal {
    return ProcessingInstructionImpl._create(document, target, data)
  }

  /** @inheritdoc */
  htmlCollection(root: NodeInternal,
    filter: ((element: ElementInternal) => any) = (() => true)): HTMLCollectionInternal {
    return HTMLCollectionImpl._create(root, filter)
  }

  /** @inheritdoc */
  nodeList(root: NodeInternal): NodeListInternal {
    return NodeListImpl._create(root)
  }

  /** @inheritdoc */
  nodeListStatic(root: NodeInternal, items: NodeInternal[]): NodeListInternal {
    return NodeListStaticImpl._create(root, items)
  }

  /** @inheritdoc */
  namedNodeMap(element: ElementInternal): NamedNodeMapInternal {
    return NamedNodeMapImpl._create(element)
  }

  /** @inheritdoc */
  range(start?: BoundaryPoint, end?: BoundaryPoint): RangeInternal {
    return RangeImpl._create(start, end)
  }

  /** @inheritdoc */
  nodeIterator(root: NodeInternal, reference: NodeInternal,
    pointerBeforeReference: boolean): NodeIteratorInternal {

    return NodeIteratorImpl._create(root, reference, pointerBeforeReference)
  }

  /** @inheritdoc */
  treeWalker(root: NodeInternal, current: NodeInternal): TreeWalkerInternal {
    return TreeWalkerImpl._create(root, current)
  }

  /** @inheritdoc */
  nodeFilter(): NodeFilterInternal {
    return NodeFilterImpl._create()
  }

  /** @inheritdoc */
  mutationRecord(type: "attributes" | "characterData" | "childList",
    target: NodeInternal, addedNodes: NodeListInternal,
    removedNodes: NodeListInternal, previousSibling: NodeInternal | null,
    nextSibling: NodeInternal | null, attributeName: string | null,
    attributeNamespace: string | null, oldValue: string | null): MutationRecordInternal {

    return MutationRecordImpl._create(type, target, addedNodes, removedNodes,
      previousSibling, nextSibling, attributeName, attributeNamespace, oldValue)
  }

  /** @inheritdoc */
  domTokenList(element: ElementInternal, attribute: AttrInternal): DOMTokenListInternal {
    return DOMTokenListImpl._create(element, attribute)
  }
}
