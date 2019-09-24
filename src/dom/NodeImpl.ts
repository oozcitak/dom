import {
  Node, NodeList, Element, Document, NodeType,
  Position, GetRootNodeOptions, RegisteredObserver, TransientRegisteredObserver,
  Event, EventTarget
} from './interfaces'
import { EventTargetImpl } from './EventTargetImpl'
import {
  NodeInternal, DocumentInternal, TextInternal, AttrInternal, ElementInternal
} from './interfacesInternal'
import { globalStore } from '../util'
import { Guard } from './util'
import { DOMException } from './DOMException'
import { DocumentImpl } from './DocumentImpl'
import { NodeCompareCache } from './util/NodeCompareCache'

/**
 * Represents a generic XML node.
 */
export abstract class NodeImpl extends EventTargetImpl implements NodeInternal {

  static readonly ELEMENT_NODE: number = 1
  static readonly ATTRIBUTE_NODE: number = 2
  static readonly TEXT_NODE: number = 3
  static readonly CDATA_SECTION_NODE: number = 4
  static readonly ENTITY_REFERENCE_NODE: number = 5
  static readonly ENTITY_NODE: number = 6
  static readonly PROCESSING_INSTRUCTION_NODE: number = 7
  static readonly COMMENT_NODE: number = 8
  static readonly DOCUMENT_NODE: number = 9
  static readonly DOCUMENT_TYPE_NODE: number = 10
  static readonly DOCUMENT_FRAGMENT_NODE: number = 11
  static readonly NOTATION_NODE: number = 12

  static readonly DOCUMENT_POSITION_DISCONNECTED: number = 0x01
  static readonly DOCUMENT_POSITION_PRECEDING: number = 0x02
  static readonly DOCUMENT_POSITION_FOLLOWING: number = 0x04
  static readonly DOCUMENT_POSITION_CONTAINS: number = 0x08
  static readonly DOCUMENT_POSITION_CONTAINED_BY: number = 0x10
  static readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number = 0x20

  protected _childNodes: NodeList

  _nodeDocumentOverwrite: DocumentInternal | null = null
  get _nodeDocument(): DocumentInternal { return this._nodeDocumentOverwrite || globalStore.window.document as DocumentInternal }
  set _nodeDocument(val: DocumentInternal) { this._nodeDocumentOverwrite = val }
  _registeredObserverList:
    Array<RegisteredObserver | TransientRegisteredObserver> = []

  abstract _nodeType: NodeType
  _parent: Node | null = null
  _children: Set<Node> = new Set()
  _firstChild: Node | null = null
  _lastChild: Node | null = null
  _previousSibling: Node | null = null
  _nextSibling: Node | null = null

  /**
   * Initializes a new instance of `Node`.
   */
  protected constructor() {
    super()

    this._childNodes = this._algo.create.nodeList(this)
  }

  /** @inheritdoc */
  get nodeType(): NodeType { return this._nodeType }

  /** 
   * Returns a string appropriate for the type of node. 
   */
  get nodeName(): string {
    if (Guard.isElementNode(this)) {
      return this._htmlUppercasedQualifiedName
    } else if (Guard.isAttrNode(this)) {
      return this._qualifiedName
    } else if (Guard.isExclusiveTextNode(this)) {
      return "#text"
    } else if (Guard.isCDATASectionNode(this)) {
      return "#cdata-section"
    } else if (Guard.isProcessingInstructionNode(this)) {
      return this._target
    } else if (Guard.isCommentNode(this)) {
      return "#comment"
    } else if (Guard.isDocumentNode(this)) {
      return "#document"
    } else if (Guard.isDocumentTypeNode(this)) {
      return this._name
    } else if (Guard.isDocumentFragmentNode(this)) {
      return "#document-fragment"
    } else {
      return ""
    }
  }

  /**
   * Gets the absolute base URL of the node.
   */
  get baseURI(): string {
    /**
     * TODO:
     * The baseURI attribute’s getter must return node document’s document 
     * base URL, serialized.
     * See: https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url
     */
    return ""
  }

  /** 
   * Returns whether the node is rooted to a document node. 
   */
  get isConnected(): boolean {
    /**
     * The isConnected attribute’s getter must return true, if context object 
     * is connected, and false otherwise.
     */
    return Guard.isElementNode(this) && this._algo.shadowTree.isConnected(this)
  }

  /** 
   * Returns the parent document. 
   */
  get ownerDocument(): Document | null {
    /**
     * The ownerDocument attribute’s getter must return null, if the context
     * object is a document, and the context object’s node document otherwise.
     * _Note:_ The node document of a document is that document itself. All 
     * nodes have a node document at all times.
     */
    if (this._nodeType === NodeType.Document)
      return null
    else
      return this._nodeDocument
  }

  /**
   * Returns the root node.
   * 
   * @param options - if options has `composed = true` this function
   * returns the node's shadow-including root, otherwise it returns
   * the node's root node.
   */
  getRootNode(options?: GetRootNodeOptions): Node {
    /**
     * The getRootNode(options) method, when invoked, must return context
     * object’s shadow-including root if options’s composed is true,
     * and context object’s root otherwise.
     */
    return this._algo.tree.rootNode(this, !!options && options.composed)
  }

  /** 
   * Returns the parent node. 
   */
  get parentNode(): Node | null {
    /**
     * The parentNode attribute’s getter must return the context object’s parent.
     * _Note:_ An Attr node has no parent.
     */
    if (this._nodeType === NodeType.Attribute) {
      return null
    } else {
      return this._parent
    }
  }

  /** 
   * Returns the parent element. 
   */
  get parentElement(): Element | null {
    /**
     * The parentElement attribute’s getter must return the context object’s 
     * parent element.
     */
    if (this._parent && Guard.isElementNode(this._parent)) {
      return this._parent
    } else {
      return null
    }
  }

  /** 
   * Determines whether a node has any children.
   */
  hasChildNodes(): boolean {
    /**
     * The hasChildNodes() method, when invoked, must return true if the context
     * object has children, and false otherwise.
     */
    return (this.firstChild !== null)
  }

  /** 
   * Returns a {@link NodeList} of child nodes. 
   */
  get childNodes(): NodeList {
    /**
     * The childNodes attribute’s getter must return a NodeList rooted at the 
     * context object matching only children.
     */
    return this._childNodes
  }

  /** 
   * Returns the first child node. 
   */
  get firstChild(): Node | null {
    /**
     * The firstChild attribute’s getter must return the context object’s first
     * child.
     */
    return this._firstChild
  }

  /** 
   * Returns the last child node. 
   */
  get lastChild(): Node | null {
    /**
     * The lastChild attribute’s getter must return the context object’s last 
     * child.
     */
    return this._lastChild
  }

  /** 
   * Returns the previous sibling node. 
   */
  get previousSibling(): Node | null {
    /**
     * The previousSibling attribute’s getter must return the context object’s
     * previous sibling.
     * _Note:_ An Attr node has no siblings.
     */
    return this._previousSibling
  }

  /** 
   * Returns the next sibling node. 
   */
  get nextSibling(): Node | null {
    /**
     * The nextSibling attribute’s getter must return the context object’s 
     * next sibling.
     */
    return this._nextSibling
  }

  /** 
   * Gets or sets the data associated with a {@link CharacterData} node or the
   * value of an {@link @Attr} node. For other node types returns `null`. 
   */
  get nodeValue(): string | null {
    if (Guard.isAttrNode(this)) {
      return this._value
    } else if (Guard.isCharacterDataNode(this)) {
      return this._data
    } else {
      return null
    }
  }
  set nodeValue(value: string | null) {
    const algo = this._algo
    if (value === null) { value = '' }

    if (Guard.isAttrNode(this)) {
      algo.attr.setAnExistingAttributeValue(this, value)
    } else if (Guard.isCharacterDataNode(this)) {
      algo.characterData.replaceData(this, 0, this._data.length, value)
    }
  }

  /** 
   * Returns the concatenation of data of all the {@link Text}
   * node descendants in tree order. When set, replaces the text 
   * contents of the node with the given value. 
   */
  get textContent(): string | null {
    const algo = this._algo
    if (Guard.isDocumentFragmentNode(this) || Guard.isElementNode(this)) {
      return algo.text.descendantTextContent(this)
    } else if (Guard.isAttrNode(this)) {
      return this._value
    } else if (Guard.isCharacterDataNode(this)) {
      return this._data
    } else {
      return null
    }
  }
  set textContent(value: string | null) {
    const algo = this._algo
    if (value === null) { value = '' }
    if (Guard.isDocumentFragmentNode(this) || Guard.isElementNode(this)) {
      algo.node.stringReplaceAll(value, this)
    } else if (Guard.isAttrNode(this)) {
      algo.attr.setAnExistingAttributeValue(this, value)
    } else if (Guard.isCharacterDataNode(this)) {
      algo.characterData.replaceData(this, 0, algo.tree.nodeLength(this), value)
    }
  }

  /**
   * Puts all {@link Text} nodes in the full depth of the sub-tree
   * underneath this node into a "normal" form where only markup 
   * (e.g., tags, comments, processing instructions, CDATA sections,
   * and entity references) separates {@link Text} nodes, i.e., there
   * are no adjacent Text nodes.
   */
  normalize(): void {
    /**
     * The normalize() method, when invoked, must run these steps for each 
     * descendant exclusive Text node node of context object:
     */
    const algo = this._algo
    const descendantNodes: TextInternal[] = []
    for (const node of algo.tree.getDescendantNodes(this)) {
      if (Guard.isExclusiveTextNode(node)) {
        descendantNodes.push(node)
      }
    }

    for (const node of descendantNodes) {
      if (node._parent === null) continue

      /**
       * 1. Let length be node’s length.
       * 2. If length is zero, then remove node and continue with the next 
       * exclusive Text node, if any.
       */
      let length = algo.tree.nodeLength(node)
      if (length === 0) {
        algo.mutation.remove(node, node._parent as NodeInternal)
        continue
      }
      /**
       * 3. Let data be the concatenation of the data of node’s contiguous 
       * exclusive Text nodes (excluding itself), in tree order.
       */
      const textSiblings: TextInternal[] = []
      let data = ''
      for (const sibling of algo.text.contiguousExclusiveTextNodes(node)) {
        textSiblings.push(sibling)
        data += sibling._data
      }

      /**
       * 4. Replace data with node node, offset length, count 0, and data data.
       */
      algo.characterData.replaceData(node, length, 0, data)

      /**
       * 5. Let currentNode be node’s next sibling.
       * 6. While currentNode is an exclusive Text node:
       */
      let currentNode = node.nextSibling
      while (currentNode !== null && Guard.isExclusiveTextNode(currentNode)) {
        /**
         * 6.1. For each live range whose start node is currentNode, add length
         * to its start offset and set its start node to node.
         * 6.2. For each live range whose end node is currentNode, add length to
         * its end offset and set its end node to node.
         * 6.3. For each live range whose start node is currentNode’s parent and
         * start offset is currentNode’s index, set its start node to node and
         * its start offset to length.
         * 6.4. For each live range whose end node is currentNode’s parent and
         * end offset is currentNode’s index, set its end node to node and its
         * end offset to length.
         */
        const index = algo.tree.index(currentNode)
        for (const range of algo.range.ranges()) {
          if (range._start[0] === currentNode) {
            range._start[0] = node
            range._start[1] += length
          }
          if (range._end[0] === currentNode) {
            range._end[0] = node
            range._end[1] += length
          }
          if (range._start[0] === currentNode._parent && range._start[1] === index) {
            range._start[0] = node
            range._start[1] = length
          }
          if (range._end[0] === currentNode._parent && range._end[1] === index) {
            range._end[0] = node
            range._end[1] = length
          }
        }
        /**
         * 6.5. Add currentNode’s length to length.
         * 6.6. Set currentNode to its next sibling.
         */
        length += algo.tree.nodeLength(currentNode)
        currentNode = currentNode.nextSibling
      }

      /**
       * 7. Remove node’s contiguous exclusive Text nodes (excluding itself), 
       * in tree order.
       */
      for (const sibling of textSiblings) {
        if (sibling._parent === null) continue
        algo.mutation.remove(sibling, sibling._parent as NodeInternal)
      }
    }
  }

  /**
   * Returns a duplicate of this node, i.e., serves as a generic copy 
   * constructor for nodes. The duplicate node has no parent 
   * ({@link parentNode} returns `null`).
   *
   * @param deep - if `true`, recursively clone the subtree under the 
   * specified node. If `false`, clone only the node itself (and its 
   * attributes, if it is an {@link Element}).
   */
  cloneNode(deep: boolean = false): Node {
    /**
     * 1. If context object is a shadow root, then throw a "NotSupportedError" 
     * DOMException.
     * 2. Return a clone of the context object, with the clone children flag set 
     * if deep is true.
     */
    if (Guard.isShadowRoot(this))
      throw DOMException.NotSupportedError

    return this._algo.node.clone(this, null, deep)
  }

  /**
   * Determines if the given node is equal to this one.
   * 
   * @param node - the node to compare with
   */
  isEqualNode(node: Node | null = null): boolean {
    /**
     * The isEqualNode(otherNode) method, when invoked, must return true if
     * otherNode is non-null and context object equals otherNode, and false 
     * otherwise.
     */
    return (node !== null && this._algo.node.equals(this, node as NodeInternal))
  }

  /**
   * Determines if the given node is reference equal to this one.
   * 
   * @param node - the node to compare with
   */
  isSameNode(node: Node | null = null): boolean {
    /**
     * The isSameNode(otherNode) method, when invoked, must return true if 
     * otherNode is context object, and false otherwise.
     */
    return (this === node)
  }

  /**
   * Returns a bitmask indicating the position of the given `node`
   * relative to this node.
   */
  compareDocumentPosition(other: Node): Position {
    const algo = this._algo

    /**
     * 1. If context object is other, then return zero.
     * 2. Let node1 be other and node2 be context object.
     * 3. Let attr1 and attr2 be null.
     * attr1’s element.
     */
    if (other === this) return 0

    let node1: NodeInternal | null = other as NodeInternal | null
    let node2: NodeInternal | null = this as NodeInternal | null

    let attr1: AttrInternal | null = null
    let attr2: AttrInternal | null = null

    /**
     * 4. If node1 is an attribute, then set attr1 to node1 and node1 to 
     * attr1’s element.
     */
    if (Guard.isAttrNode(node1)) {
      attr1 = node1
      node1 = attr1._element as ElementInternal | null
    }

    /**
     * 5. If node2 is an attribute, then:
     */
    if (Guard.isAttrNode(node2)) {
      /**
       * 5.1. Set attr2 to node2 and node2 to attr2’s element.
       */
      attr2 = node2
      node2 = attr2._element as ElementInternal | null

      /**
       * 5.2. If attr1 and node1 are non-null, and node2 is node1, then:
       */
      if (attr1 && node1 && (node1 === node2)) {
        /**
         * 5.2. For each attr in node2’s attribute list:
         */
        for (const attr of (node2 as ElementInternal)._attributeList) {
          /**
           * 5.2.1. If attr equals attr1, then return the result of adding
           * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and
           * DOCUMENT_POSITION_PRECEDING.
           * 5.2.2. If attr equals attr2, then return the result of adding
           * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and 
           * DOCUMENT_POSITION_FOLLOWING.
           */
          if (algo.node.equals(attr as AttrInternal, attr1)) {
            return Position.ImplementationSpecific | Position.Preceding
          } else if (algo.node.equals(attr as AttrInternal, attr2)) {
            return Position.ImplementationSpecific | Position.Following
          }
        }
      }
    }

    /**
     * 6. If node1 or node2 is null, or node1’s root is not node2’s root, then
     * return the result of adding DOCUMENT_POSITION_DISCONNECTED, 
     * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either 
     * DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING, 
     * with the constraint that this is to be consistent, together.
     */
    if (node1 === null || node2 === null ||  
      algo.tree.rootNode(node1) !== algo.tree.rootNode(node2)) {
      // nodes are disconnected
      // return a random result but cache the value for consistency
      return Position.Disconnected | Position.ImplementationSpecific |
        (NodeCompareCache.instance.check(this, other as NodeInternal) ? Position.Preceding : Position.Following)
    }

    /**
     * 7. If node1 is an ancestor of node2 and attr1 is null, or node1 is node2
     * and attr2 is non-null, then return the result of adding 
     * DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
     */
    if ((!attr1 && algo.tree.isAncestorOf(node2, node1)) ||
      (attr2 && (node1 === node2))) {
      return Position.Contains | Position.Preceding
    }

    /**
     * 8. If node1 is a descendant of node2 and attr2 is null, or node1 is node2
     * and attr1 is non-null, then return the result of adding 
     * DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
     */
    if ((!attr2 && algo.tree.isDescendantOf(node2, node1)) ||
      (attr1 && (node1 === node2))) {
      return Position.ContainedBy | Position.Following
    }

    /**
     * 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
     */
    if (algo.tree.isPreceding(node2, node1))
      return Position.Preceding

    /**
     * 10. Return DOCUMENT_POSITION_FOLLOWING.
     */
    return Position.Following
  }

  /**
   * Returns `true` if given node is an inclusive descendant of this
   * node, and `false` otherwise (including when other node is `null`).
   * 
   * @param other - the node to check
   */
  contains(other: Node | null): boolean {
    /**
     * The contains(other) method, when invoked, must return true if other is an
     * inclusive descendant of context object, and false otherwise (including 
     * when other is null).
     */
    if (other === null) return false
    return this._algo.tree.isDescendantOf(this, other as NodeInternal, true)
  }

  /**
   * Returns the prefix for a given namespace URI, if present, and 
   * `null` if not.
   * 
   * @param namespace - the namespace to search
   */
  lookupPrefix(namespace: string | null): string | null {
    /**
     * 1. If namespace is null or the empty string, then return null.
     * 2. Switch on the context object:
     */
    if (!namespace) return null
    if (Guard.isElementNode(this)) {
      /**
       * Return the result of locating a namespace prefix for it using 
       * namespace.
       */
      return this._algo.node.locateANamespacePrefix(this, namespace)
    } else if (Guard.isDocumentNode(this)) {
      /**
       * Return the result of locating a namespace prefix for its document
       * element, if its document element is non-null, and null otherwise.
       */
      if (this.documentElement === null) {
        return null
      } else {
        return this._algo.node.locateANamespacePrefix(
          this.documentElement as ElementInternal, namespace)
      }
    } else if (Guard.isDocumentTypeNode(this) || Guard.isDocumentFragmentNode(this)) {
      return null
    } else if (Guard.isAttrNode(this)) {
      /**
       * Return the result of locating a namespace prefix for its element, 
       * if its element is non-null, and null otherwise.
       */
      if (this._element === null) {
        return null
      } else {
        return this._algo.node.locateANamespacePrefix(
          this._element as ElementInternal, namespace)
      }
    } else {
      /**
       * Return the result of locating a namespace prefix for its parent 
       * element, if its parent element is non-null, and null otherwise.
       */
      if (this.parentElement === null) {
        return null
      } else {
        return this._algo.node.locateANamespacePrefix(
          this.parentElement as ElementInternal, namespace)
      }
    }
  }

  /**
   * Returns the namespace URI for a given prefix if present, and `null`
   * if not.
   * 
   * @param prefix - the prefix to search
   */
  lookupNamespaceURI(prefix: string | null): string | null {
    /**
     * 1. If prefix is the empty string, then set it to null.
     * 2. Return the result of running locate a namespace for the context object
     * using prefix.
     */
    return this._algo.node.locateANamespace(this, prefix || null)
  }

  /**
   * Returns `true` if the namespace is the default namespace on this
   * node or `false` if not.
   * 
   * @param namespace - the namespace to check
   */
  isDefaultNamespace(namespace: string | null): boolean {
    /**
     * 1. If namespace is the empty string, then set it to null.
     * 2. Let defaultNamespace be the result of running locate a namespace for
     * context object using null.
     * 3. Return true if defaultNamespace is the same as namespace, and false otherwise.
     */
    if (!namespace) namespace = null
    const defaultNamespace = this._algo.node.locateANamespace(this, null)
    return (defaultNamespace === namespace)
  }

  /**
   * Inserts the node `newChild` before the existing child node
   * `refChild`. If `refChild` is `null`, inserts `newChild` at the end
   * of the list of children.
   *
   * If `newChild` is a {@link DocumentFragment} object, all of its 
   * children are inserted, in the same order, before `refChild`.
   *
   * If `newChild` is already in the tree, it is first removed.
   *
   * @param newChild - the node to insert
   * @param refChild - the node before which the new node must be
   *   inserted
   * 
   * @returns the newly inserted child node
   */
  insertBefore(newChild: Node, refChild: Node | null): Node {
    /**
     * The insertBefore(node, child) method, when invoked, must return the 
     * result of pre-inserting node into context object before child.
     */
    return this._algo.mutation.preInsert(newChild as NodeInternal, this,
      refChild as NodeInternal | null)
  }

  /**
   * Adds the node `newChild` to the end of the list of children of this
   * node, and returns it. If `newChild` is already in the tree, it is
   * first removed.
   *
   * If `newChild` is a {@link DocumentFragment} object, the entire 
   * contents of the document fragment are moved into the child list of
   * this node.
   *
   * @param newChild - the node to add
   * 
   * @returns the newly inserted child node
   */
  appendChild(newChild: Node): Node {
    /**
     * The appendChild(node) method, when invoked, must return the result of 
     * appending node to context object.
     */
    return this._algo.mutation.append(newChild as NodeInternal, this)
  }

  /**
   * Replaces the child node `oldChild` with `newChild` in the list of 
   * children, and returns the `oldChild` node. If `newChild` is already
   * in the tree, it is first removed.
   *
   * @param newChild - the new node to put in the child list
   * @param oldChild - the node being replaced in the list
   * 
   * @returns the removed child node
   */
  replaceChild(newChild: Node, oldChild: Node): Node {
    /**
     * The replaceChild(node, child) method, when invoked, must return the 
     * result of replacing child with node within context object.
     */
    return this._algo.mutation.replace(oldChild as NodeInternal,
      newChild as NodeInternal, this)
  }

  /**
  * Removes the child node indicated by `oldChild` from the list of
  * children, and returns it.
  *
  * @param oldChild - the node being removed from the list
  * 
  * @returns the removed child node
  */
  removeChild(oldChild: Node): Node {
    /**
     * The removeChild(child) method, when invoked, must return the result of 
     * pre-removing child from context object.
     */
    return this._algo.mutation.preRemove(oldChild as NodeInternal, this)
  }

  /**
   * Gets the parent event target for the given event.
   * 
   * @param event - an event
   */
  _getTheParent(event: Event): EventTarget | null {
    /**
     * A node’s get the parent algorithm, given an event, returns the node’s 
     * assigned slot, if node is assigned, and node’s parent otherwise.
     */
    if (Guard.isSlotable(this) && this._algo.shadowTree.isAssigned(this)) {
      return this._assignedSlot
    } else {
      return this._parent
    }
  }

}
