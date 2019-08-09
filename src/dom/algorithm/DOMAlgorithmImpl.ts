import {
  DOMAlgorithm, RemovingStep, CloningStep, AdoptingStep,
  ChildTextContentChangeStep, TreeAlgorithm, OrderedSetAlgorithm,
  NamespaceAlgorithm, SelectorsAlgorithm, EventAlgorithm, EventTargetAlgorithm,
  AbortAlgorithm, AttributeChangeStep, ShadowTreeAlgorithm, MutationAlgorithm,
  InsertionStep, ParentNodeAlgorithm, CreateAlgorithm, MutationObserverAlgorithm,
  AttrAlgorithm, ElementAlgorithm, CharacterDataAlgorithm, TextAlgorithm,
  NodeAlgorithm, DocumentAlgorithm, ListAlgorithm
} from './interfaces'
import {
  DocumentInternal, ElementInternal, NodeInternal, SlotInternal
} from '../interfacesInternal'
import { Guard } from '../util'
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
import { MutationObserverAlgorithmImpl } from './MutationObserverImpl'
import { NodeAlgorithmImpl } from './NodeAlgorithmImpl'
import { AttrAlgorithmImpl } from './AttrAlgorithmImpl'
import { ElementAlgorithmImpl } from './ElementAlgorithmImpl'
import { CharacterDataAlgorithmImpl } from './CharacterDataAlgorithmImpl'
import { TextAlgorithmImpl } from './TextAlgorithmImpl'
import { DocumentAlgorithmImpl } from './DocumentAlgorithmImpl'
import { ListAlgorithmImpl } from './ListAlgorithmImpl'

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
  readonly _list: ListAlgorithm

  protected removingSteps: RemovingStep[] = []
  protected cloningSteps: CloningStep[] = []
  protected adoptingSteps: AdoptingStep[] = []
  protected childTextContentChangeSteps: ChildTextContentChangeStep[] = []
  protected attributeChangeSteps: AttributeChangeStep[] = []
  protected insertionSteps: InsertionStep[] = []

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
    this._list = new ListAlgorithmImpl(this)

    this.attributeChangeSteps.push(this.updateASlotsName)
    this.attributeChangeSteps.push(this.updateASlotablesName)
    this.attributeChangeSteps.push(this.updateAnElementID)
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
  get list(): ListAlgorithm { return this._list }

  /** @inheritdoc */
  runRemovingSteps(removedNode: NodeInternal, oldParent: NodeInternal | null = null): void {
    for (const removingStep of this.removingSteps) {
      removingStep.call(this, removedNode, oldParent)
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
    for (const attributeChangeStep of this.attributeChangeSteps) {
      attributeChangeStep.call(this, element, localName, oldValue, value, namespace)
    }
  }

  /** @inheritdoc */
  runInsertionSteps(insertedNode: NodeInternal): void {
    for (const insertionStep of this.insertionSteps) {
      insertionStep.call(this, insertedNode)
    }
  }

  /**
   * Defines attribute change steps to update a slot’s name.
   */
  private updateASlotsName(element: ElementInternal, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    /**
     * 1. If element is a slot, localName is name, and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to the
     * empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. Run assign slotables for a tree with element’s root.
     */
    if (Guard.isSlot(element) && localName === "name" && namespace === null) {
      if (value === oldValue) return
      if (value === null && oldValue === '') return
      if (value === '' && oldValue === null) return

      if ((value === null || value === '')) {
        element._name = ''
      } else {
        element._name = value
      }

      this.shadowTree.assignSlotablesForATree(this.tree.rootNode(element))
    }
  }

  /**
   * Defines attribute change steps to update a slotable’s name.
   */
  private updateASlotablesName(element: ElementInternal, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    /**
     * 1. If localName is slot and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to 
     * the empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. If element is assigned, then run assign slotables for element’s 
     * assigned slot.
     * 1.7. Run assign a slot for element.
     */
    if (Guard.isSlotable(element) && localName === "slot" && namespace === null) {
      if (value === oldValue) return
      if (value === null && oldValue === '') return
      if (value === '' && oldValue === null) return

      if ((value === null || value === '')) {
        element._name = ''
      } else {
        element._name = value
      }

      if (this.shadowTree.isAssigned(element)) {
        this.shadowTree.assignSlotables(element._assignedSlot as SlotInternal)
      }

      this.shadowTree.assignASlot(element)
    }
  }

  /**
   * Defines attribute change steps to update an element's ID.
   */
  private updateAnElementID(element: ElementInternal, localName: string,
    oldValue: string | null, value: string | null, namespace: string | null): void {
    /**
     * 1. If localName is id, namespace is null, and value is null or the empty
     * string, then unset element’s ID.
     * 2. Otherwise, if localName is id, namespace is null, then set element’s
     * ID to value.
     */
    if (localName === "id" && namespace === null) {
      if (!value)
        element._uniqueIdentifier = undefined
      else
        element._uniqueIdentifier = value
    }
  }

}
