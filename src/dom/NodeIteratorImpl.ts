import { Node } from "./interfaces"
import { TraverserImpl } from "./TraverserImpl"
import { NodeIteratorInternal, CollectionInternal } from "./interfacesInternal"

/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export class NodeIteratorImpl extends TraverserImpl implements NodeIteratorInternal {

  _iteratorCollection: CollectionInternal
  _reference: Node
  _pointerBeforeReference: boolean

  /**
   * Initializes a new instance of `NodeIterator`.
   */
  private constructor(root: Node, reference: Node, pointerBeforeReference: boolean) {
    super(root)

    this._iteratorCollection = undefined as unknown as CollectionInternal
    this._reference = reference
    this._pointerBeforeReference = pointerBeforeReference
  }

  /** @inheritdoc */
  get referenceNode(): Node { return this._reference }

  /** @inheritdoc */
  get pointerBeforeReferenceNode(): boolean { return this._pointerBeforeReference }

  /** @inheritdoc */
  nextNode(): Node | null {
    /**
     * The nextNode() method, when invoked, must return the result of 
     * traversing with the context object and next.
     */
    return this._algo.nodeIterator.traverse(this, true)
  }

  /** @inheritdoc */
  previousNode(): Node | null {
    /**
     * The previousNode() method, when invoked, must return the result of 
     * traversing with the context object and previous.
     */
    return this._algo.nodeIterator.traverse(this, false)
  }

  /** @inheritdoc */
  detach(): void {
    /**
     * TODO:
     * The detach() method, when invoked, must do nothing.
     */
   }


  /**
   * Creates a new `NodeIterator`.
   * 
   * @param root - iterator's root node
   * @param reference - reference node
   * @param pointerBeforeReference - whether the iterator is before or after the
   * reference node 
   */
  static _create(root: Node, reference: Node, pointerBeforeReference: boolean):
    NodeIteratorInternal {
    return new NodeIteratorImpl(root, reference, pointerBeforeReference)
  }
}
