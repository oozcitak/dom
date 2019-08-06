import {
  Node, NodeFilter, WhatToShow, FilterResult
} from "./interfaces"
import { NodeFilterImpl } from "./NodeFilterImpl"
import { TraverserInternal } from "./interfacesInternal"

/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
export abstract class TraverserImpl implements TraverserInternal {

  _activeFlag: boolean
  _root: Node
  _whatToShow: WhatToShow
  _filter: NodeFilter | null

  /**
   * Initializes a new instance of `TraverserImpl`.
   * 
   * @param root - root node
   */
  constructor(root: Node) {
    this._activeFlag = false
    this._root = root
    this._whatToShow = WhatToShow.All
    this._filter = null
  }

  /**
   * Gets the root node of the subtree.
   */
  get root(): Node { return this._root }

  /**
   * Gets the node types to match
   */
  get whatToShow(): WhatToShow { return this._whatToShow }

  /**
   * Gets the filter used to selected the nodes.
   */
  get filter(): NodeFilter | null { return this._filter }

}
