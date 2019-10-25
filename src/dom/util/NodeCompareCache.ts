import { NodeInternal } from "../interfacesInternal"

/**
 * Represents a cache for comparing DOM nodes.
 * 
 * TODO: Weak references
 * Since weak references are not yet implemented in EcmaScript,
 * limit the number of items in the cache.
 */
export class NodeCompareCache {
  private static _instance: NodeCompareCache

  _items = new Map<NodeInternal, NodeInternal>()

  /**
   * Initializes a new instance of `NodeCompareCache`.
   */
  private constructor() { }

  /** @inheritdoc */
  check(nodeA: NodeInternal, nodeB: NodeInternal): boolean {
    if (this._items.get(nodeA) === nodeB)
      return true
    else if (this._items.get(nodeB) === nodeA)
      return false
      
    if (Math.random() < 0.5) {
      this._items.set(nodeA, nodeB)
      return true
    } else {
      this._items.set(nodeB, nodeA)
      return false
    }
  }

  /**
   * Returns the instance of `NodeCompareCache`. 
   */
  static get instance(): NodeCompareCache {
    if (!NodeCompareCache._instance) {
      NodeCompareCache._instance = new NodeCompareCache()
    }
    return NodeCompareCache._instance
  }  
}
