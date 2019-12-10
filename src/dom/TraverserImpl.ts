import { Node, NodeFilter, WhatToShow, Traverser } from "./interfaces"

/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export abstract class TraverserImpl implements Traverser {

  _activeFlag: boolean
  _root: Node
  _whatToShow: WhatToShow
  _filter: NodeFilter | null

  /**
   * Initializes a new instance of `Traverser`.
   * 
   * @param root - root node
   */
  protected constructor(root: Node) {
    this._activeFlag = false
    this._root = root
    this._whatToShow = WhatToShow.All
    this._filter = null
  }

  /** @inheritdoc */
  get root(): Node { return this._root }

  /** @inheritdoc */
  get whatToShow(): WhatToShow { return this._whatToShow }

  /** @inheritdoc */
  get filter(): NodeFilter | null { return this._filter }

}
