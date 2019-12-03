import {
  DOMAlgorithm, RemovingStep, CloningStep, AdoptingStep,
  ChildTextContentChangeStep, TreeAlgorithm, OrderedSetAlgorithm,
  NamespaceAlgorithm, SelectorsAlgorithm, EventAlgorithm, EventTargetAlgorithm,
  AbortAlgorithm, ShadowTreeAlgorithm, MutationAlgorithm,
  InsertionStep, ParentNodeAlgorithm, CreateAlgorithm, MutationObserverAlgorithm,
  AttrAlgorithm, ElementAlgorithm, CharacterDataAlgorithm, TextAlgorithm,
  NodeAlgorithm, DocumentAlgorithm, BoundaryPointAlgorithm, RangeAlgorithm,
  TraversalAlgorithm, NodeIteratorAlgorithm, TreeWalkerAlgorithm,
  NodeIteratorPreRemovingStep, DOMTokenListAlgorithm, EventConstructingStep,
  CustomElementAlgorithm, XMLAlgorithm
} from './interfaces'
import { Document, Element, Node, NodeIterator, Event } from '../dom/interfaces'
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
import { CustomElementAlgorithmImpl } from './CustomElementAlgorithmImpl'
import { XMLAlgorithmImpl } from './XMLAlgorithmImpl'

/**
 * Contains DOM manipulation algorithms as described in the 
 * [DOM Living Standard](https://dom.spec.whatwg.org).
 */
export class DOMAlgorithmImpl implements DOMAlgorithm {

  protected _tree: TreeAlgorithm
  protected _orderedSet: OrderedSetAlgorithm
  protected _namespace: NamespaceAlgorithm
  protected _selectors: SelectorsAlgorithm
  protected _event: EventAlgorithm
  protected _eventTarget: EventTargetAlgorithm
  protected _abort: AbortAlgorithm
  protected _shadowTree: ShadowTreeAlgorithm
  protected _mutation: MutationAlgorithm
  protected _parentNode: ParentNodeAlgorithm
  protected _create: CreateAlgorithm
  protected _observer: MutationObserverAlgorithm
  protected _attr: AttrAlgorithm
  protected _element: ElementAlgorithm
  protected _characterData: CharacterDataAlgorithm
  protected _text: TextAlgorithm
  protected _node: NodeAlgorithm
  protected _document: DocumentAlgorithm
  protected _boundaryPoint: BoundaryPointAlgorithm
  protected _range: RangeAlgorithm
  protected _traversal: TraversalAlgorithm
  protected _nodeIterator: NodeIteratorAlgorithm
  protected _treeWalker: TreeWalkerAlgorithm
  protected _tokenList: DOMTokenListAlgorithm
  protected _customElement: CustomElementAlgorithm
  protected _xml: XMLAlgorithm

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
    this._customElement = new CustomElementAlgorithmImpl(this)
    this._xml = new XMLAlgorithmImpl(this)

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
  get customElement(): CustomElementAlgorithm { return this._customElement }

  /** @inheritdoc */
  get xml(): XMLAlgorithm { return this._xml }

  /** @inheritdoc */
  runRemovingSteps(thisObj: any, removedNode: Node,
    oldParent: Node | null = null): void {
    for (const removingStep of this.removingSteps) {
      removingStep.call(thisObj, removedNode, oldParent)
    }
  }

  /** @inheritdoc */
  runCloningSteps(copy: Node, node: Node, document:
    Document, cloneChildrenFlag?: boolean): void {
    for (const cloningStep of this.cloningSteps) {
      cloningStep.call(this, copy, node, document, cloneChildrenFlag)
    }
  }

  /** @inheritdoc */
  runAdoptingSteps(node: Node, oldDocument: Document): void {
    for (const adoptingStep of this.adoptingSteps) {
      adoptingStep.call(this, node, oldDocument)
    }
  }

  /** @inheritdoc */
  runChildTextContentChangeSteps(parent: Node): void {
    for (const textChangeStep of this.childTextContentChangeSteps) {
      textChangeStep.call(this, parent)
    }
  }

  /** @inheritdoc */
  runAttributeChangeSteps(element: Element, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    for (const attributeChangeStep of element._attributeChangeSteps) {
      attributeChangeStep.call(this, element, localName, oldValue, value, namespace)
    }
  }

  /** @inheritdoc */
  runInsertionSteps(insertedNode: Node): void {
    for (const insertionStep of this.insertionSteps) {
      insertionStep.call(this, insertedNode)
    }
  }

  /** @inheritdoc */
  runNodeIteratorPreRemovingSteps(nodeIterator: NodeIterator,
    toBeRemovedNode: Node): void {
    for (const removingStep of this.nodeIteratorPreRemovingSteps) {
      removingStep.call(this, nodeIterator, toBeRemovedNode)
    }
  }

  /** @inheritdoc */
  runEventConstructingSteps(event: Event): void {
    for (const constructionStep of this.eventConstructingSteps) {
      constructionStep.call(this, event)
    }
  }

  /**
   * Defines pre-removing steps for a node iterator.
   */
  private removeNodeIterator(nodeIterator: NodeIterator,
    toBeRemovedNode: Node): void {
    /**
     * 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s 
     * reference, or toBeRemovedNode is nodeIterator’s root, then return.
     */
    if (toBeRemovedNode === nodeIterator._root ||
      !this.tree.isAncestorOf(nodeIterator._reference, toBeRemovedNode, true)) {
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
        const nextNode = this.tree.getFollowingNode(nodeIterator._root, toBeRemovedNode)
        if (nextNode !== null &&
          this.tree.isDescendantOf(nodeIterator._root, nextNode, true) &&
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
    if (toBeRemovedNode._previousSibling === null) {
      if (toBeRemovedNode._parent !== null) {
        nodeIterator._reference = toBeRemovedNode._parent
      }
    } else {
      let childNode = toBeRemovedNode._previousSibling
      for (childNode of this.tree.getDescendantElements(toBeRemovedNode._previousSibling, true)) {
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
