import { Node, FilterResult, TreeWalker } from "./interfaces"
import { TraverserImpl } from "./TraverserImpl"

/**
 * Represents the nodes of a subtree and a position within them.
 */
export class TreeWalkerImpl extends TraverserImpl implements TreeWalker {

  _current: Node

  /**
   * Initializes a new instance of `TreeWalker`.
   */
  private constructor(root: Node, current: Node) {
    super(root)

    this._current = current
  }

  /** @inheritdoc */
  get currentNode(): Node { return this._current }
  set currentNode(value: Node) { this._current = value }

  /** @inheritdoc */
  parentNode(): Node | null {
    /**
     * 1. Let node be the context object’s current.
     * 2. While node is non-null and is not the context object’s root:
     */
    let node: Node | null = this._current
    while (node !== null && node !== this._root) {
      /**
       * 2.1. Set node to node’s parent.
       * 2.2. If node is non-null and filtering node within the context object
       * returns FILTER_ACCEPT, then set the context object’s current to node
       * and return node.
       */
      node = node.parentNode
      if (node !== null &&
        this._algo.traversal.filter(this, node as Node) === FilterResult.Accept) {
        this._current = node
        return node
      }
    }

    /**
     * 3. Return null.
     */
    return null
  }

  /** @inheritdoc */
  firstChild(): Node | null {
    /**
     * The firstChild() method, when invoked, must traverse children with the 
     * context object and first.
     */
    return this._algo.treeWalker.traverseChildren(this, true)
  }

  /** @inheritdoc */
  lastChild(): Node | null {
    /**
     * The lastChild() method, when invoked, must traverse children with the 
     * context object and last.
     */
    return this._algo.treeWalker.traverseChildren(this, false)
  }

  /** @inheritdoc */
  nextSibling(): Node | null {
    /**
     * The nextSibling() method, when invoked, must traverse siblings with the 
     * context object and next.
     */
    return this._algo.treeWalker.traverseSiblings(this, true)
  }

  /** @inheritdoc */
  previousNode(): Node | null {
    /**
     * 1. Let node be the context object’s current.
     * 2. While node is not the context object’s root:
     */
    let node: Node | null = this._current

    while (node !== this.root) {
      /**
       * 2.1. Let sibling be node’s previous sibling.
       * 2.2. While sibling is non-null:
       */
      let sibling: Node | null = node.previousSibling
      while (sibling) {
        /**
         * 2.2.1. Set node to sibling.
         * 2.2.2. Let result be the result of filtering node within the context 
         * object.
         */
        node = sibling
        let result = this._algo.traversal.filter(this, node as Node)

        /**
         * 2.2.3. While result is not FILTER_REJECT and node has a child:
         */
        while (result !== FilterResult.Reject && node.lastChild) {
          /**
           * 2.2.3.1. Set node to node’s last child.
           * 2.2.3.2. Set result to the result of filtering node within the
           * context object.
           */
          node = node.lastChild
          result = this._algo.traversal.filter(this, node as Node)
        }

        /**
         * 2.2.4. If result is FILTER_ACCEPT, then set the context object’s
         * current to node and return node.
         */
        if (result === FilterResult.Accept) {
          this._current = node
          return node
        }

        /**
         * 2.2.5. Set sibling to node’s previous sibling.
         */
        sibling = node.previousSibling
      }

      /**
       * 2.3. If node is the context object’s root or node’s parent is null, 
       * then return null.
       */
      if (node === this.root || !node.parentNode) {
        return null
      }

      /**
       * 2.4. Set node to node’s parent.
       */
      node = node.parentNode

      /**
       * 2.5. If the return value of filtering node within the context object is
       * FILTER_ACCEPT, then set the context object’s current to node and
       * return node.
       */
      if (this._algo.traversal.filter(this, node as Node) === FilterResult.Accept) {
        this._current = node
        return node
      }
    }

    /**
     * 3. Return null.
     */
    return null
  }

  /** @inheritdoc */
  previousSibling(): Node | null {
    /**
     * The previousSibling() method, when invoked, must traverse siblings with 
     * the context object and previous.
     */
    return this._algo.treeWalker.traverseSiblings(this, false)
  }

  /** @inheritdoc */
  nextNode(): Node | null {
    /**
     * 1. Let node be the context object’s current.
     * 2. Let result be FILTER_ACCEPT.
     * 3. While true:
     */
    let node: Node | null = this._current
    let result = FilterResult.Accept

    while (true) {
      /**
       * 3.1. While result is not FILTER_REJECT and node has a child:
       */
      while (result !== FilterResult.Reject && node.firstChild) {
        /**
         * 3.1.1. Set node to its first child.
         * 3.1.2. Set result to the result of filtering node within the context 
         * object.
         * 3.1.3. If result is FILTER_ACCEPT, then set the context object’s 
         * current to node and return node.
         */
        node = node.firstChild
        result = this._algo.traversal.filter(this, node as Node)
        if (result === FilterResult.Accept) {
          this._current = node
          return node
        }
      }

      /**
       * 3.2. Let sibling be null.
       * 3.3. Let temporary be node.
       * 3.4. While temporary is non-null:
       */
      let sibling: Node | null = null
      let temporary: Node | null = node
      while (temporary !== null) {
        /**
         * 3.4.1. If temporary is the context object’s root, then return null.
         */
        if (temporary === this.root) {
          return null
        }
        /**
         * 3.4.2. Set sibling to temporary’s next sibling.
         * 3.4.3. If sibling is non-null, then break.
         */
        sibling = temporary.nextSibling
        if (sibling !== null) {
          node = sibling
          break
        }
        /**
         * 3.4.4. Set temporary to temporary’s parent.
         */
        temporary = temporary.parentNode
      }

      /**
       * 3.5. Set result to the result of filtering node within the context object.
       * 3.6. If result is FILTER_ACCEPT, then set the context object’s current 
       * to node and return node.
       */
      result = this._algo.traversal.filter(this, node as Node)
      if (result === FilterResult.Accept) {
        this._current = node
        return node
      }
    }
  }

  /**
   * Creates a new `TreeWalker`.
   * 
   * @param root - iterator's root node
   * @param current - current node
   */
  static _create(root: Node, current: Node): TreeWalkerImpl {
    return new TreeWalkerImpl(root, current)
  }

}
