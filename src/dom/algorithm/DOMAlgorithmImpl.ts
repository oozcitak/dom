import {
  DOMAlgorithm, RemovingStep, CloningStep, AdoptingStep,
  ChildTextContentChangeStep, TreeAlgorithm, OrderedSetAlgorithm,
  NamespaceAlgorithm, SelectorsAlgorithm, EventAlgorithm, EventTargetAlgorithm,
  AbortAlgorithm, ShadowTreeAlgorithm, MutationAlgorithm,
  InsertionStep, ParentNodeAlgorithm, CreateAlgorithm, MutationObserverAlgorithm,
  AttrAlgorithm, ElementAlgorithm, CharacterDataAlgorithm, TextAlgorithm,
  NodeAlgorithm, DocumentAlgorithm, BoundaryPointAlgorithm, RangeAlgorithm,
  TraversalAlgorithm, NodeIteratorAlgorithm, TreeWalkerAlgorithm,
  NodeIteratorPreRemovingStep, DOMTokenListAlgorithm,
  EventConstructingStep
} from './interfaces'
import {
  DocumentInternal, ElementInternal, NodeInternal, NodeIteratorInternal, EventInternal
} from '../interfacesInternal'
import { TreeAlgorithmImpl } from './TreeAlgorithmImpl'
import { OrderedSetAlgorithmImpl } from './OrderedSetAlgorithmImpl'
import { NamespaceAlgorithmImpl } from './NamespaceAlgorithmImpl'
import { SelectorsAlgorithmImpl } from './SelectorsAlgorithmImpl'
import { EventAlgorithmImpl } from './EventAlgorithmImpl'
import { EventTargetAlgorithmImpl } from './EventTargetAlgorithmImpl'
import { AbortAlgorithmImpl } from './AbortAlgorithmImpl'
import { ShadowTreeAlgorithmImpl } from './ShadowTreeAlgorithmImpl'
import { MutationAlgorithmImpl } from './MutationAlgorithmImpl'
import { ParentNodeAlgorithmImpl } from './ParentNodeAlgorithmImpl'
import { CreateAlgorithmImpl } from './CreateAlgorithmImpl'
import { MutationObserverAlgorithmImpl } from './MutationObserverAlgorithmImpl'
import { NodeAlgorithmImpl } from './NodeAlgorithmImpl'
import { AttrAlgorithmImpl } from './AttrAlgorithmImpl'
import { ElementAlgorithmImpl } from './ElementAlgorithmImpl'
import { CharacterDataAlgorithmImpl } from './CharacterDataAlgorithmImpl'
import { TextAlgorithmImpl } from './TextAlgorithmImpl'
import { DocumentAlgorithmImpl } from './DocumentAlgorithmImpl'
import { BoundaryPointAlgorithmImpl } from './BoundaryPointAlgorithmImpl'
import { RangeAlgorithmImpl } from './RangeAlgorithmImpl'
import { TraversalAlgorithmImpl } from './TraversalAlgorithmImpl'
import { NodeIteratorAlgorithmImpl } from './NodeIteratorAlgorithmImpl'
import { TreeWalkerAlgorithmImpl } from './TreeWalkerAlgorithmImpl'
import { DOMTokenListAlgorithmImpl } from './DOMTokenListAlgorithmImpl'

/**
 * Contains DOM manipulation algorithms as described in the 
 * [DOM Living Standard](https://dom.spec.whatwg.org).
 */
export class DOMAlgorithmImpl implements DOMAlgorithm {

  private _tree: TreeAlgorithm
  private _orderedSet: OrderedSetAlgorithm
  private _namespace: NamespaceAlgorithm
  private _selectors: SelectorsAlgorithm
  private _event: EventAlgorithm
  private _eventTarget: EventTargetAlgorithm
  private _abort: AbortAlgorithm
  private _shadowTree: ShadowTreeAlgorithm
  private _mutation: MutationAlgorithm
  private _parentNode: ParentNodeAlgorithm
  private _create: CreateAlgorithm
  private _observer: MutationObserverAlgorithm
  readonly _attr: AttrAlgorithm
  readonly _element: ElementAlgorithm
  readonly _characterData: CharacterDataAlgorithm
  readonly _text: TextAlgorithm
  readonly _node: NodeAlgorithm
  readonly _document: DocumentAlgorithm
  readonly _boundaryPoint: BoundaryPointAlgorithm
  readonly _range: RangeAlgorithm
  readonly _traversal: TraversalAlgorithm
  readonly _nodeIterator: NodeIteratorAlgorithm
  readonly _treeWalker: TreeWalkerAlgorithm
  readonly _tokenList: DOMTokenListAlgorithm

  protected removingSteps: RemovingStep[] = []
  protected cloningSteps: CloningStep[] = []
  protected adoptingSteps: AdoptingStep[] = []
  protected childTextContentChangeSteps: ChildTextContentChangeStep[] = []
  protected insertionSteps: InsertionStep[] = []
  protected nodeIteratorPreRemovingSteps: NodeIteratorPreRemovingStep[] = []
  protected eventConstructingSteps: EventConstructingStep[] = []

  protected supportedTokens: Map<string, Set<string>>

  /**
   * Initializes a new instance of `DOMAlgorithm`.
   */
  public constructor() {
    this._tree = new TreeAlgorithmImpl(this)
    this._orderedSet = new OrderedSetAlgorithmImpl(this)
    this._namespace = new NamespaceAlgorithmImpl(this)
    this._selectors = new SelectorsAlgorithmImpl(this)
    this._event = new EventAlgorithmImpl(this)
    this._eventTarget = new EventTargetAlgorithmImpl(this)
    this._abort = new AbortAlgorithmImpl(this)
    this._shadowTree = new ShadowTreeAlgorithmImpl(this)
    this._mutation = new MutationAlgorithmImpl(this)
    this._parentNode = new ParentNodeAlgorithmImpl(this)
    this._create = new CreateAlgorithmImpl(this)
    this._observer = new MutationObserverAlgorithmImpl(this)
    this._attr = new AttrAlgorithmImpl(this)
    this._element = new ElementAlgorithmImpl(this)
    this._characterData = new CharacterDataAlgorithmImpl(this)
    this._text = new TextAlgorithmImpl(this)
    this._node = new NodeAlgorithmImpl(this)
    this._document = new DocumentAlgorithmImpl(this)
    this._boundaryPoint = new BoundaryPointAlgorithmImpl(this)
    this._range = new RangeAlgorithmImpl(this)
    this._traversal = new TraversalAlgorithmImpl(this)
    this._nodeIterator = new NodeIteratorAlgorithmImpl(this)
    this._treeWalker = new TreeWalkerAlgorithmImpl(this)
    this._tokenList = new DOMTokenListAlgorithmImpl(this)

    this.supportedTokens = new Map()

    this.nodeIteratorPreRemovingSteps.push(this.removeNodeIterator)
  }

  /** @inheritdoc */
  get tree(): TreeAlgorithm { return this._tree }

  /** @inheritdoc */
  get orderedSet(): OrderedSetAlgorithm { return this._orderedSet }

  /** @inheritdoc */
  get namespace(): NamespaceAlgorithm { return this._namespace }

  /** @inheritdoc */
  get selectors(): SelectorsAlgorithm { return this._selectors }

  /** @inheritdoc */
  get event(): EventAlgorithm { return this._event }

  /** @inheritdoc */
  get eventTarget(): EventTargetAlgorithm { return this._eventTarget }

  /** @inheritdoc */
  get abort(): AbortAlgorithm { return this._abort }

  /** @inheritdoc */
  get shadowTree(): ShadowTreeAlgorithm { return this._shadowTree }

  /** @inheritdoc */
  get mutation(): MutationAlgorithm { return this._mutation }

  /** @inheritdoc */
  get parentNode(): ParentNodeAlgorithm { return this._parentNode }

  /** @inheritdoc */
  get create(): CreateAlgorithm { return this._create }

  /** @inheritdoc */
  get observer(): MutationObserverAlgorithm { return this._observer }

  /** @inheritdoc */
  get attr(): AttrAlgorithm { return this._attr }

  /** @inheritdoc */
  get element(): ElementAlgorithm { return this._element }

  /** @inheritdoc */
  get characterData(): CharacterDataAlgorithm { return this._characterData }

  /** @inheritdoc */
  get text(): TextAlgorithm { return this._text }

  /** @inheritdoc */
  get node(): NodeAlgorithm { return this._node }

  /** @inheritdoc */
  get document(): DocumentAlgorithm { return this._document }

  /** @inheritdoc */
  get boundaryPoint(): BoundaryPointAlgorithm { return this._boundaryPoint }

  /** @inheritdoc */
  get range(): RangeAlgorithm { return this._range }

  /** @inheritdoc */
  get traversal(): TraversalAlgorithm { return this._traversal }

  /** @inheritdoc */
  get nodeIterator(): NodeIteratorAlgorithm { return this._nodeIterator }

  /** @inheritdoc */
  get treeWalker(): TreeWalkerAlgorithm { return this._treeWalker }

  /** @inheritdoc */
  get tokenList(): DOMTokenListAlgorithm { return this._tokenList }

  /** @inheritdoc */
  runRemovingSteps(thisObj: any, removedNode: NodeInternal,
    oldParent: NodeInternal | null = null): void {
    for (const removingStep of this.removingSteps) {
      removingStep.call(thisObj, removedNode, oldParent)
    }
  }

  /** @inheritdoc */
  runCloningSteps(copy: NodeInternal, node: NodeInternal, document:
    DocumentInternal, cloneChildrenFlag?: boolean): void {
    for (const cloningStep of this.cloningSteps) {
      cloningStep.call(this, copy, node, document, cloneChildrenFlag)
    }
  }

  /** @inheritdoc */
  runAdoptingSteps(node: NodeInternal, oldDocument: DocumentInternal): void {
    for (const adoptingStep of this.adoptingSteps) {
      adoptingStep.call(this, node, oldDocument)
    }
  }

  /** @inheritdoc */
  runChildTextContentChangeSteps(parent: NodeInternal): void {
    for (const textChangeStep of this.childTextContentChangeSteps) {
      textChangeStep.call(this, parent)
    }
  }

  /** @inheritdoc */
  runAttributeChangeSteps(element: ElementInternal, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    for (const attributeChangeStep of element._attributeChangeSteps) {
      attributeChangeStep.call(this, element, localName, oldValue, value, namespace)
    }
  }

  /** @inheritdoc */
  runInsertionSteps(insertedNode: NodeInternal): void {
    for (const insertionStep of this.insertionSteps) {
      insertionStep.call(this, insertedNode)
    }
  }

  /** @inheritdoc */
  runNodeIteratorPreRemovingSteps(nodeIterator: NodeIteratorInternal,
    toBeRemovedNode: NodeInternal): void {
    for (const removingStep of this.nodeIteratorPreRemovingSteps) {
      removingStep.call(this, nodeIterator, toBeRemovedNode)
    }
  }

  /** @inheritdoc */
  runEventConstructingSteps(event: EventInternal): void {
    for (const constructionStep of this.eventConstructingSteps) {
      constructionStep.call(this, event)
    }
  }

  /**
   * Defines pre-removing steps for a node iterator.
   */
  private removeNodeIterator(nodeIterator: NodeIteratorInternal,
    toBeRemovedNode: NodeInternal): void {
    /**
     * 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s 
     * reference, or toBeRemovedNode is nodeIterator’s root, then return.
     */
    if (toBeRemovedNode === nodeIterator._root ||
      !this.tree.isAncestorOf(nodeIterator._reference as NodeInternal, toBeRemovedNode, true)) {
      return
    }

    /**
     * 2. If nodeIterator’s pointer before reference is true, then:
     */
    if (nodeIterator._pointerBeforeReference) {
      /**
       * 2.1. Let next be toBeRemovedNode’s first following node that is an
       * inclusive descendant of nodeIterator’s root and is not an inclusive
       * descendant of toBeRemovedNode, and null if there is no such node.
       */
      while (true) {
        const nextNode = this.tree.getFollowingNode(nodeIterator._root as NodeInternal, toBeRemovedNode)
        if (nextNode !== null &&
          this.tree.isDescendantOf(nodeIterator._root as NodeInternal, nextNode, true) &&
          !this.tree.isDescendantOf(toBeRemovedNode, nextNode, true)) {
          /**
           * 2.2. If next is non-null, then set nodeIterator’s reference to next 
           * and return.
           */
          nodeIterator._reference = nextNode
          return
        } else if (nextNode === null) {
          /**
           * 2.3. Otherwise, set nodeIterator’s pointer before reference to false.        
           */
          nodeIterator._pointerBeforeReference = false
          return
        }
      }
    }

    /**
     * 3. Set nodeIterator’s reference to toBeRemovedNode’s parent, if 
     * toBeRemovedNode’s previous sibling is null, and to the inclusive 
     * descendant of toBeRemovedNode’s previous sibling that appears last in 
     * tree order otherwise.
     */
    if (toBeRemovedNode.previousSibling === null) {
      if (toBeRemovedNode.parentNode !== null) {
        nodeIterator._reference = toBeRemovedNode.parentNode
      }
    } else {
      let childNode: NodeInternal = toBeRemovedNode.previousSibling as NodeInternal
      for (childNode of this.tree.getDescendantElements(toBeRemovedNode.previousSibling as NodeInternal, true)) {
        // loop through to get the last descendant node
      }
      nodeIterator._reference = childNode
    }
  }

  /** @inheritdoc */
  hasSupportedTokens(attributeName: string): boolean {
    return this.supportedTokens.has(attributeName)
  }

  /** @inheritdoc */
  getSupportedTokens(attributeName: string): Set<string> {
    return this.supportedTokens.get(attributeName) || new Set()
  }

}
