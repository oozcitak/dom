import { Node, NodeFilter, WhatToShow } from "./interfaces"
import { TraverserInternal } from "./interfacesInternal"
import { DOMAlgorithm } from "../algorithm/interfaces"
import { globalStore } from "../util"

/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export abstract class TraverserImpl implements TraverserInternal {

  _algo: DOMAlgorithm

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
    this._algo = globalStore.algorithm as DOMAlgorithm

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
