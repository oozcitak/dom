import { Node } from "./interfaces"
import { TraverserImpl } from "./TraverserImpl"
import { Traverse } from "./util/Traverse"
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

  /**
   * Gets the current node.
   */
  get referenceNode(): Node { return this._reference }

  /**
   * Gets a flag that indicates whether the iterator is before
   * or after  the reference node. If is `true`, the iterator is 
   * before the node, otherwise it is after the node.
   */
  get pointerBeforeReferenceNode(): boolean { return this._pointerBeforeReference }

  /**
   * Returns the next node in the subtree, or `null` if there are none.
   */
  nextNode(): Node | null {
    const [node, ref, beforeNode] = Traverse.traverse(this, true)
    this._reference = ref
    this._pointerBeforeReference = beforeNode
    return node
  }

  /**
   * Returns the previous node in the subtree, or `null` if there
   * are none.
   */
  previousNode(): Node | null {
    const [node, ref, beforeNode] = Traverse.traverse(this, false)
    this._reference = ref
    this._pointerBeforeReference = beforeNode
    return node
  }

  /**
   * This method is a no-op and is not used.
   */
  detach(): void { }


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
