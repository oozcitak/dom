import { dom } from "../"
import { HierarchyRequestError, NotFoundError } from "../dom/DOMException"
import { NodeType, Node, Element } from "../dom/interfaces"
import { Guard } from "../util"
import { isEmpty } from "@oozcitak/util"
import { set as infraSet } from "@oozcitak/infra"
import {
  customElement_enqueueACustomElementCallbackReaction,
  customElement_tryToUpgrade
} from "./CustomElementAlgorithm"
import {
  tree_isAncestorOf, tree_index, tree_rootNode, 
  tree_isDescendantOf, tree_getAncestorNodes,
  tree_getFirstDescendantNode, tree_getNextDescendantNode
} from "./TreeAlgorithm"
import { nodeIterator_iteratorList } from "./NodeIteratorAlgorithm"
import {
  shadowTree_assignASlot, shadowTree_signalASlotChange,
  shadowTree_assignSlotablesForATree, shadowTree_isConnected,
  shadowTree_isAssigned, shadowTree_assignSlotables
} from "./ShadowTreeAlgorithm"
import { observer_queueTreeMutationRecord } from "./MutationObserverAlgorithm"
import {
  dom_runChildTextContentChangeSteps, dom_runRemovingSteps,
  dom_runNodeIteratorPreRemovingSteps, dom_runInsertionSteps
} from "./DOMAlgorithm"
import { document_adopt } from "./DocumentAlgorithm"

/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child.
 * 
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
export function mutation_ensurePreInsertionValidity(node: Node, parent: Node, child: Node | null): void {
  const parentNodeType = parent._nodeType
  const nodeNodeType = node._nodeType
  const childNodeType = child ? child._nodeType : null

  /**
   * 1. If parent is not a Document, DocumentFragment, or Element node,
   * throw a "HierarchyRequestError" DOMException.
   */
  if (parentNodeType !== NodeType.Document &&
    parentNodeType !== NodeType.DocumentFragment &&
    parentNodeType !== NodeType.Element)
    throw new HierarchyRequestError(`Only document, document fragment and element nodes can contain child nodes. Parent node is ${parent.nodeName}.`)

  /**
   * 2. If node is a host-including inclusive ancestor of parent, throw a
   * "HierarchyRequestError" DOMException.
   */
  if (tree_isAncestorOf(parent, node, true, true))
    throw new HierarchyRequestError(`The node to be inserted cannot be an ancestor of parent node. Node is ${node.nodeName}, parent node is ${parent.nodeName}.`)

  /**
   * 3. If child is not null and its parent is not parent, then throw a
   * "NotFoundError" DOMException.
   */
  if (child !== null && child._parent !== parent)
    throw new NotFoundError(`The reference child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`)

  /**
   * 4. If node is not a DocumentFragment, DocumentType, Element, Text, 
   * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError"
   * DOMException.
   */
  if (nodeNodeType !== NodeType.DocumentFragment &&
    nodeNodeType !== NodeType.DocumentType &&
    nodeNodeType !== NodeType.Element &&
    nodeNodeType !== NodeType.Text &&
    nodeNodeType !== NodeType.ProcessingInstruction &&
    nodeNodeType !== NodeType.CData &&
    nodeNodeType !== NodeType.Comment)
    throw new HierarchyRequestError(`Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is ${node.nodeName}.`)

  /**
   * 5. If either node is a Text node and parent is a document, or node is a
   * doctype and parent is not a document, throw a "HierarchyRequestError"
   * DOMException.
   */
  if (nodeNodeType === NodeType.Text &&
    parentNodeType === NodeType.Document)
    throw new HierarchyRequestError(`Cannot insert a text node as a child of a document node. Node is ${node.nodeName}.`)

  if (nodeNodeType === NodeType.DocumentType &&
    parentNodeType !== NodeType.Document)
    throw new HierarchyRequestError(`A document type node can only be inserted under a document node. Parent node is ${parent.nodeName}.`)

  /**
   * 6. If parent is a document, and any of the statements below, switched on
   * node, are true, throw a "HierarchyRequestError" DOMException.
   * - DocumentFragment node
   * If node has more than one element child or has a Text node child.
   * Otherwise, if node has one element child and either parent has an element
   * child, child is a doctype, or child is not null and a doctype is
   * following child.
   * - element
   * parent has an element child, child is a doctype, or child is not null and
   * a doctype is following child.
   * - doctype
   * parent has a doctype child, child is non-null and an element is preceding
   * child, or child is null and parent has an element child.
   */
  if (parentNodeType === NodeType.Document) {
    if (nodeNodeType === NodeType.DocumentFragment) {
      let eleCount = 0
      for (const childNode of node._children) {
        if (childNode._nodeType === NodeType.Element)
          eleCount++
        else if (childNode._nodeType === NodeType.Text)
          throw new HierarchyRequestError(`Cannot insert text a node as a child of a document node. Node is ${childNode.nodeName}.`)
      }

      if (eleCount > 1) {
        throw new HierarchyRequestError(`A document node can only have one document element node. Document fragment to be inserted has ${eleCount} element nodes.`)
      } else if (eleCount === 1) {
        for (const ele of parent._children) {
          if (ele._nodeType === NodeType.Element)
            throw new HierarchyRequestError(`The document node already has a document element node.`)
        }

        if (child) {
          if (childNodeType === NodeType.DocumentType)
            throw new HierarchyRequestError(`Cannot insert an element node before a document type node.`)

          let doctypeChild = child._nextSibling
          while (doctypeChild) {
            if (doctypeChild._nodeType === NodeType.DocumentType)
              throw new HierarchyRequestError(`Cannot insert an element node before a document type node.`)
            doctypeChild = doctypeChild._nextSibling
          }
        }
      }
    } else if (nodeNodeType === NodeType.Element) {
      for (const ele of parent._children) {
        if (ele._nodeType === NodeType.Element)
          throw new HierarchyRequestError(`Document already has a document element node. Node is ${node.nodeName}.`)
      }

      if (child) {
        if (childNodeType === NodeType.DocumentType)
          throw new HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`)

        let doctypeChild = child._nextSibling
        while (doctypeChild) {
          if (doctypeChild._nodeType === NodeType.DocumentType)
            throw new HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`)
          doctypeChild = doctypeChild._nextSibling
        }
      }
    } else if (nodeNodeType === NodeType.DocumentType) {
      for (const ele of parent._children) {
        if (ele._nodeType === NodeType.DocumentType)
          throw new HierarchyRequestError(`Document already has a document type node. Node is ${node.nodeName}.`)
      }

      if (child) {
        let elementChild = child._previousSibling
        while (elementChild) {
          if (elementChild._nodeType === NodeType.Element)
            throw new HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`)
          elementChild = elementChild._previousSibling
        }
      } else {
        let elementChild = parent._firstChild
        while (elementChild) {
          if (elementChild._nodeType === NodeType.Element)
            throw new HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`)
          elementChild = elementChild._nextSibling
        }
      }
    }
  }
}

/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child, then adopts the node to the tree and inserts it.
 * 
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
export function mutation_preInsert(node: Node, parent: Node,
  child: Node | null): Node {
  /**
   * 1. Ensure pre-insertion validity of node into parent before child.
   * 2. Let reference child be child.
   * 3. If reference child is node, set it to node’s next sibling.
   * 4. Adopt node into parent’s node document.
   * 5. Insert node into parent before reference child.
   * 6. Return node.
   */
  mutation_ensurePreInsertionValidity(node, parent, child)

  let referenceChild = child
  if (referenceChild === node)
    referenceChild = node._nextSibling

  document_adopt(node, parent._nodeDocument)
  mutation_insert(node, parent, referenceChild)

  return node
}

/**
 * Inserts a node into a parent node before the given child node.
 * 
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 * @param suppressObservers - whether to notify observers
 */
export function mutation_insert(node: Node, parent: Node, child: Node | null,
  suppressObservers?: boolean): void {

  // Optimized common case
  if (child === null && node.nodeType !== NodeType.DocumentFragment && node._children.size === 0) {
    mutation_insert_single(node, parent, suppressObservers)
    return
  }

  /**
   * 1. Let count be the number of children of node if it is a 
   * DocumentFragment node, and one otherwise.
   */
  const count = (node.nodeType === NodeType.DocumentFragment ?
    node._children.size : 1)

  /**
   * 2. If child is non-null, then:
   */
  if (child !== null) {
    /**
     * 2.1. For each live range whose start node is parent and start 
     * offset is greater than child's index, increase its start 
     * offset by count.
     * 2.2. For each live range whose end node is parent and end 
     * offset is greater than child's index, increase its end 
     * offset by count.
     */
    if (dom.rangeList.length !== 0) {
      const index = tree_index(child)
      for (const range of dom.rangeList) {
        if (range._start[0] === parent && range._start[1] > index) {
          range._start[1] += count
        }
        if (range._end[0] === parent && range._end[1] > index) {
          range._end[1] += count
        }
      }
    }
  }

  /**
   * 3. Let nodes be node’s children, if node is a DocumentFragment node; 
   * otherwise « node ».
   */
  const nodes = node.nodeType === NodeType.DocumentFragment ?
    new Array<Node>(...node._children) : [node]

  /**
   * 4. If node is a DocumentFragment node, remove its children with the 
   * suppress observers flag set.
   */
  if (node.nodeType === NodeType.DocumentFragment) {
    while (node._firstChild) {
      mutation_remove(node._firstChild, node, true)
    }
  }

  /**
   * 5. If node is a DocumentFragment node, then queue a tree mutation record 
   * for node with « », nodes, null, and null.
   */
  if (dom.features.mutationObservers) {
    if (node.nodeType === NodeType.DocumentFragment) {
      observer_queueTreeMutationRecord(node, [], nodes, null, null)
    }
  }

  /**
   * 6. Let previousSibling be child’s previous sibling or parent’s last 
   * child if child is null.
   */
  const previousSibling = (child ? child._previousSibling : parent._lastChild)

  let index = child === null ? -1 : tree_index(child)
  /**
   * 7. For each node in nodes, in tree order:
   */
  for (const node of nodes) {
    /**
     * 7.1. If child is null, then append node to parent’s children.
     * 7.2. Otherwise, insert node into parent’s children before child’s
     * index.
     */
    node._parent = parent
    if (child === null) {
      infraSet.append(parent._children, node)
    } else {
      infraSet.insert(parent._children, node, index)
      index++
    }

    // assign siblings and children for quick lookups
    if (parent._firstChild === null) {
      node._previousSibling = null
      node._nextSibling = null

      parent._firstChild = node
      parent._lastChild = node
    } else {
      const prev = (child ? child._previousSibling : parent._lastChild)
      const next = (child ? child : null)

      node._previousSibling = prev
      node._nextSibling = next

      if (prev) prev._nextSibling = node
      if (next) next._previousSibling = node

      if (!prev) parent._firstChild = node
      if (!next) parent._lastChild = node
    }

    /**
     * 7.3. If parent is a shadow host and node is a slotable, then 
     * assign a slot for node.
     */
    if (dom.features.slots) {
      if ((parent as Element)._shadowRoot !== null && Guard.isSlotable(node)) {
        shadowTree_assignASlot(node)
      }
    }

    /**
     * 7.4. If node is a Text node, run the child text content change 
     * steps for parent.
     */
    if (dom.features.steps) {
      if (Guard.isTextNode(node)) {
        dom_runChildTextContentChangeSteps(parent)
      }
    }

    /**
     * 7.5. If parent's root is a shadow root, and parent is a slot 
     * whose assigned nodes is the empty list, then run signal
     * a slot change for parent.
     */
    if (dom.features.slots) {
      if (Guard.isShadowRoot(tree_rootNode(parent)) &&
        Guard.isSlot(parent) && isEmpty(parent._assignedNodes)) {
        shadowTree_signalASlotChange(parent)
      }
    }

    /**
     * 7.6. Run assign slotables for a tree with node's root.
     */
    if (dom.features.slots) {
      shadowTree_assignSlotablesForATree(tree_rootNode(node))
    }

    /**
     * 7.7. For each shadow-including inclusive descendant 
     * inclusiveDescendant of node, in shadow-including tree
     * order:
     */
    let inclusiveDescendant = tree_getFirstDescendantNode(node, true, true)
    while (inclusiveDescendant !== null) {
      /**
       * 7.7.1. Run the insertion steps with inclusiveDescendant.
       */
      if (dom.features.steps) {
        dom_runInsertionSteps(inclusiveDescendant)
      }

      if (dom.features.customElements) {
        /**
         * 7.7.2. If inclusiveDescendant is connected, then:
         */
        if (Guard.isElementNode(inclusiveDescendant) &&
          shadowTree_isConnected(inclusiveDescendant)) {
          if (Guard.isCustomElementNode(inclusiveDescendant)) {
            /**
             * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
             * element callback reaction with inclusiveDescendant, callback name 
             * "connectedCallback", and an empty argument list.
             */
            customElement_enqueueACustomElementCallbackReaction(
              inclusiveDescendant, "connectedCallback", [])
          } else {
            /**
             * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
             */
            customElement_tryToUpgrade(inclusiveDescendant)
          }
        }
      }

      inclusiveDescendant = tree_getNextDescendantNode(node, inclusiveDescendant, true, true)
    }
  }

  /**
   * 8. If suppress observers flag is unset, then queue a tree mutation record
   * for parent with nodes, « », previousSibling, and child.
   */
  if (dom.features.mutationObservers) {
    if (!suppressObservers) {
      observer_queueTreeMutationRecord(parent, nodes, [],
        previousSibling, child)
    }
  }
}

/**
 * Inserts a node into a parent node. Optimized routine for the common case where
 * node is not a document fragment node and it has no child nodes.
 * 
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param suppressObservers - whether to notify observers
 */
function mutation_insert_single(node: Node, parent: Node,
  suppressObservers?: boolean): void {

  /**
   * 1. Let count be the number of children of node if it is a 
   * DocumentFragment node, and one otherwise.
   * 2. If child is non-null, then:
   * 2.1. For each live range whose start node is parent and start 
   * offset is greater than child's index, increase its start 
   * offset by count.
   * 2.2. For each live range whose end node is parent and end 
   * offset is greater than child's index, increase its end 
   * offset by count.
   * 3. Let nodes be node’s children, if node is a DocumentFragment node; 
   * otherwise « node ».
   * 4. If node is a DocumentFragment node, remove its children with the 
   * suppress observers flag set.
   * 5. If node is a DocumentFragment node, then queue a tree mutation record 
   * for node with « », nodes, null, and null.
   */

  /**
   * 6. Let previousSibling be child’s previous sibling or parent’s last 
   * child if child is null.
   */
  const previousSibling = parent._lastChild

  /**
   * 7. For each node in nodes, in tree order:
   * 7.1. If child is null, then append node to parent’s children.
   * 7.2. Otherwise, insert node into parent’s children before child’s
   * index.
   */
  node._parent = parent
  infraSet.append(parent._children, node)

  // assign siblings and children for quick lookups
  if (parent._firstChild === null) {
    node._previousSibling = null
    node._nextSibling = null

    parent._firstChild = node
    parent._lastChild = node
  } else {
    const prev = parent._lastChild

    node._previousSibling = prev
    node._nextSibling = null

    if (prev) prev._nextSibling = node

    if (!prev) parent._firstChild = node
    parent._lastChild = node
  }

  /**
   * 7.3. If parent is a shadow host and node is a slotable, then 
   * assign a slot for node.
   */
  if (dom.features.slots) {
    if ((parent as Element)._shadowRoot !== null && Guard.isSlotable(node)) {
      shadowTree_assignASlot(node)
    }
  }

  /**
   * 7.4. If node is a Text node, run the child text content change 
   * steps for parent.
   */
  if (dom.features.steps) {
    if (Guard.isTextNode(node)) {
      dom_runChildTextContentChangeSteps(parent)
    }
  }

  /**
   * 7.5. If parent's root is a shadow root, and parent is a slot 
   * whose assigned nodes is the empty list, then run signal
   * a slot change for parent.
   */
  if (dom.features.slots) {
    if (Guard.isShadowRoot(tree_rootNode(parent)) &&
      Guard.isSlot(parent) && isEmpty(parent._assignedNodes)) {
      shadowTree_signalASlotChange(parent)
    }
  }

  /**
   * 7.6. Run assign slotables for a tree with node's root.
   */
  if (dom.features.slots) {
    shadowTree_assignSlotablesForATree(tree_rootNode(node))
  }

  /**
   * 7.7. For each shadow-including inclusive descendant 
   * inclusiveDescendant of node, in shadow-including tree
   * order:
   * 7.7.1. Run the insertion steps with inclusiveDescendant.
   */
  if (dom.features.steps) {
    dom_runInsertionSteps(node)
  }

  if (dom.features.customElements) {
    /**
     * 7.7.2. If inclusiveDescendant is connected, then:
     */
    if (Guard.isElementNode(node) &&
      shadowTree_isConnected(node)) {
      if (Guard.isCustomElementNode(node)) {
        /**
         * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
         * element callback reaction with inclusiveDescendant, callback name 
         * "connectedCallback", and an empty argument list.
         */
        customElement_enqueueACustomElementCallbackReaction(
          node, "connectedCallback", [])
      } else {
        /**
         * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
         */
        customElement_tryToUpgrade(node)
      }
    }
  }

  /**
   * 8. If suppress observers flag is unset, then queue a tree mutation record
   * for parent with nodes, « », previousSibling, and child.
   */
  if (dom.features.mutationObservers) {
    if (!suppressObservers) {
      observer_queueTreeMutationRecord(parent, [node], [],
        previousSibling, null)
    }
  }
}

/**
 * Appends a node to the children of a parent node.
 * 
 * @param node - a node
 * @param parent - the parent to receive node
 */
export function mutation_append(node: Node, parent: Node): Node {
  /**
   * To append a node to a parent, pre-insert node into parent before null.
   */
  return mutation_preInsert(node, parent, null)
}

/**
 * Replaces a node with another node.
 * 
 * @param child - child node to remove
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
export function mutation_replace(child: Node, node: Node,
  parent: Node): Node {

  /**
   * 1. If parent is not a Document, DocumentFragment, or Element node,
   * throw a "HierarchyRequestError" DOMException.
   */
  if (parent.nodeType !== NodeType.Document &&
    parent.nodeType !== NodeType.DocumentFragment &&
    parent.nodeType !== NodeType.Element)
    throw new HierarchyRequestError(`Only document, document fragment and element nodes can contain child nodes. Parent node is ${parent.nodeName}.`)

  /**
   * 2. If node is a host-including inclusive ancestor of parent, throw a 
   * "HierarchyRequestError" DOMException.
   */
  if (tree_isAncestorOf(parent, node, true, true))
    throw new HierarchyRequestError(`The node to be inserted cannot be an ancestor of parent node. Node is ${node.nodeName}, parent node is ${parent.nodeName}.`)

  /**
   * 3. If child’s parent is not parent, then throw a "NotFoundError" 
   * DOMException.
   */
  if (child._parent !== parent)
    throw new NotFoundError(`The reference child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`)

  /**
   * 4. If node is not a DocumentFragment, DocumentType, Element, Text, 
   * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError" 
   * DOMException.
   */
  if (node.nodeType !== NodeType.DocumentFragment &&
    node.nodeType !== NodeType.DocumentType &&
    node.nodeType !== NodeType.Element &&
    node.nodeType !== NodeType.Text &&
    node.nodeType !== NodeType.ProcessingInstruction &&
    node.nodeType !== NodeType.CData &&
    node.nodeType !== NodeType.Comment)
    throw new HierarchyRequestError(`Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is ${node.nodeName}.`)

  /**
   * 5. If either node is a Text node and parent is a document, or node is a 
   * doctype and parent is not a document, throw a "HierarchyRequestError" 
   * DOMException.
   */
  if (node.nodeType === NodeType.Text &&
    parent.nodeType === NodeType.Document)
    throw new HierarchyRequestError(`Cannot insert a text node as a child of a document node. Node is ${node.nodeName}.`)

  if (node.nodeType === NodeType.DocumentType &&
    parent.nodeType !== NodeType.Document)
    throw new HierarchyRequestError(`A document type node can only be inserted under a document node. Parent node is ${parent.nodeName}.`)

  /**
   * 6. If parent is a document, and any of the statements below, switched on 
   * node, are true, throw a "HierarchyRequestError" DOMException.
   * - DocumentFragment node
   * If node has more than one element child or has a Text node child.
   * Otherwise, if node has one element child and either parent has an element
   * child that is not child or a doctype is following child.
   * - element
   * parent has an element child that is not child or a doctype is
   * following child.
   * - doctype
   * parent has a doctype child that is not child, or an element is
   * preceding child.
   */
  if (parent.nodeType === NodeType.Document) {
    if (node.nodeType === NodeType.DocumentFragment) {
      let eleCount = 0
      for (const childNode of node._children) {
        if (childNode.nodeType === NodeType.Element)
          eleCount++
        else if (childNode.nodeType === NodeType.Text)
          throw new HierarchyRequestError(`Cannot insert text a node as a child of a document node. Node is ${childNode.nodeName}.`)
      }

      if (eleCount > 1) {
        throw new HierarchyRequestError(`A document node can only have one document element node. Document fragment to be inserted has ${eleCount} element nodes.`)
      } else if (eleCount === 1) {
        for (const ele of parent._children) {
          if (ele.nodeType === NodeType.Element && ele !== child)
            throw new HierarchyRequestError(`The document node already has a document element node.`)
        }

        let doctypeChild = child._nextSibling
        while (doctypeChild) {
          if (doctypeChild.nodeType === NodeType.DocumentType)
            throw new HierarchyRequestError(`Cannot insert an element node before a document type node.`)
          doctypeChild = doctypeChild._nextSibling
        }
      }
    } else if (node.nodeType === NodeType.Element) {
      for (const ele of parent._children) {
        if (ele.nodeType === NodeType.Element && ele !== child)
          throw new HierarchyRequestError(`Document already has a document element node. Node is ${node.nodeName}.`)
      }

      let doctypeChild = child._nextSibling
      while (doctypeChild) {
        if (doctypeChild.nodeType === NodeType.DocumentType)
          throw new HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`)
        doctypeChild = doctypeChild._nextSibling
      }
    } else if (node.nodeType === NodeType.DocumentType) {
      for (const ele of parent._children) {
        if (ele.nodeType === NodeType.DocumentType && ele !== child)
          throw new HierarchyRequestError(`Document already has a document type node. Node is ${node.nodeName}.`)
      }

      let elementChild = child._previousSibling
      while (elementChild) {
        if (elementChild.nodeType === NodeType.Element)
          throw new HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`)
        elementChild = elementChild._previousSibling
      }
    }
  }

  /**
   * 7. Let reference child be child’s next sibling.
   * 8. If reference child is node, set it to node’s next sibling.
   * 8. Let previousSibling be child’s previous sibling.
   */
  let referenceChild = child._nextSibling
  if (referenceChild === node) referenceChild = node._nextSibling
  let previousSibling = child._previousSibling

  /**
   * 10. Adopt node into parent’s node document.
   * 11. Let removedNodes be the empty list.
   */
  document_adopt(node, parent._nodeDocument)
  const removedNodes: Node[] = []

  /**
   * 12. If child’s parent is not null, then:
   */
  if (child._parent !== null) {
    /**
     * 12.1. Set removedNodes to [child].
     * 12.2. Remove child from its parent with the suppress observers flag 
     * set.
     */
    removedNodes.push(child)
    mutation_remove(child, child._parent, true)
  }

  /**
   * 13. Let nodes be node’s children if node is a DocumentFragment node; 
   * otherwise [node].
   */
  const nodes: Node[] = []
  if (node.nodeType === NodeType.DocumentFragment) {
    for (const childNode of node._children) {
      nodes.push(childNode)
    }
  } else {
    nodes.push(node)
  }

  /**
   * 14. Insert node into parent before reference child with the suppress 
   * observers flag set.
   */
  mutation_insert(node, parent, referenceChild, true)

  /**
   * 15. Queue a tree mutation record for parent with nodes, removedNodes, 
   * previousSibling, and reference child.
   */
  if (dom.features.mutationObservers) {
    observer_queueTreeMutationRecord(parent, nodes, removedNodes,
      previousSibling, referenceChild)
  }

  /**
   * 16. Return child.
   */
  return child
}

/**
 * Replaces all nodes of a parent with the given node.
 * 
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
export function mutation_replaceAll(node: Node | null, parent: Node): void {
  /**
   * 1. If node is not null, adopt node into parent’s node document.
   */
  if (node !== null) {
    document_adopt(node, parent._nodeDocument)
  }

  /**
   * 2. Let removedNodes be parent’s children.
   */
  const removedNodes: Node[] = []
  for (const childNode of parent._children) {
    removedNodes.push(childNode)
  }

  /**
   * 3. Let addedNodes be the empty list.
   * 4. If node is DocumentFragment node, then set addedNodes to node’s 
   * children.
   * 5. Otherwise, if node is non-null, set addedNodes to [node].
   */
  const addedNodes: Node[] = []
  if (node && node.nodeType === NodeType.DocumentFragment) {
    for (const childNode of node._children) {
      addedNodes.push(childNode)
    }
  } else if (node !== null) {
    addedNodes.push(node)
  }

  /**
   * 6. Remove all parent’s children, in tree order, with the suppress 
   * observers flag set.
   */
  for (const childNode of removedNodes) {
    mutation_remove(childNode, parent, true)
  }

  /**
   * 7. If node is not null, then insert node into parent before null with the 
   * suppress observers flag set.
   */
  if (node !== null) {
    mutation_insert(node, parent, null, true)
  }

  /**
   * 8. Queue a tree mutation record for parent with addedNodes, removedNodes, 
   * null, and null.
   */
  if (dom.features.mutationObservers) {
    observer_queueTreeMutationRecord(parent, addedNodes, removedNodes,
      null, null)
  }
}

/**
 * Ensures pre-removal validity of a child node from a parent, then
 * removes it.
 * 
 * @param child - child node to remove
 * @param parent - parent node
 */
export function mutation_preRemove(child: Node, parent: Node): Node {
  /**
   * 1. If child’s parent is not parent, then throw a "NotFoundError" 
   * DOMException.
   * 2. Remove child from parent.
   * 3. Return child.
   */
  if (child._parent !== parent)
    throw new NotFoundError(`The child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`)

  mutation_remove(child, parent)

  return child
}

/**
 * Removes a child node from its parent.
 * 
 * @param node - node to remove
 * @param parent - parent node
 * @param suppressObservers - whether to notify observers
 */
export function mutation_remove(node: Node, parent: Node, suppressObservers?: boolean): void {

  if (dom.rangeList.length !== 0) {
    /**
     * 1. Let index be node’s index.
     */
    const index = tree_index(node)

    /**
     * 2. For each live range whose start node is an inclusive descendant of 
     * node, set its start to (parent, index).
     * 3. For each live range whose end node is an inclusive descendant of 
     * node, set its end to (parent, index).
     */
    for (const range of dom.rangeList) {
      if (tree_isDescendantOf(node, range._start[0], true)) {
        range._start = [parent, index]
      }
      if (tree_isDescendantOf(node, range._end[0], true)) {
        range._end = [parent, index]
      }
      if (range._start[0] === parent && range._start[1] > index) {
        range._start[1]--
      }
      if (range._end[0] === parent && range._end[1] > index) {
        range._end[1]--
      }
    }

    /**
     * 4. For each live range whose start node is parent and start offset is 
     * greater than index, decrease its start offset by 1.
     * 5. For each live range whose end node is parent and end offset is greater 
     * than index, decrease its end offset by 1.
     */
    for (const range of dom.rangeList) {
      if (range._start[0] === parent && range._start[1] > index) {
        range._start[1] -= 1
      }
      if (range._end[0] === parent && range._end[1] > index) {
        range._end[1] -= 1
      }
    }
  }

  /**
   * 6. For each NodeIterator object iterator whose root’s node document is 
   * node’s node document, run the NodeIterator pre-removing steps given node
   * and iterator.
   */
  if (dom.features.steps) {
    for (const iterator of nodeIterator_iteratorList()) {
      if (iterator._root._nodeDocument === node._nodeDocument) {
        dom_runNodeIteratorPreRemovingSteps(iterator, node)
      }
    }
  }

  /**
   * 7. Let oldPreviousSibling be node’s previous sibling.
   * 8. Let oldNextSibling be node’s next sibling.
   */
  const oldPreviousSibling = node._previousSibling
  const oldNextSibling = node._nextSibling

  /**
   * 9. Remove node from its parent’s children.
   */
  node._parent = null
  parent._children.delete(node)

  // assign siblings and children for quick lookups
  const prev = node._previousSibling
  const next = node._nextSibling

  node._previousSibling = null
  node._nextSibling = null

  if (prev) prev._nextSibling = next
  if (next) next._previousSibling = prev

  if (!prev) parent._firstChild = next
  if (!next) parent._lastChild = prev

  /**
   * 10. If node is assigned, then run assign slotables for node’s assigned 
   * slot.
   */
  if (dom.features.slots) {
    if (Guard.isSlotable(node) && node._assignedSlot !== null && shadowTree_isAssigned(node)) {
      shadowTree_assignSlotables(node._assignedSlot)
    }
  }

  /**
   * 11. If parent’s root is a shadow root, and parent is a slot whose 
   * assigned nodes is the empty list, then run signal a slot change for 
   * parent.
   */
  if (dom.features.slots) {
    if (Guard.isShadowRoot(tree_rootNode(parent)) &&
      Guard.isSlot(parent) && isEmpty(parent._assignedNodes)) {
      shadowTree_signalASlotChange(parent)
    }
  }

  /**
   * 12. If node has an inclusive descendant that is a slot, then:
   * 12.1. Run assign slotables for a tree with parent's root.
   * 12.2. Run assign slotables for a tree with node.
   */
  if (dom.features.slots) {
    const descendant = tree_getFirstDescendantNode(node, true, false, (e) => Guard.isSlot(e))
    if (descendant !== null) {
      shadowTree_assignSlotablesForATree(tree_rootNode(parent))
      shadowTree_assignSlotablesForATree(node)
    }
  }

  /**
   * 13. Run the removing steps with node and parent.
   */
  if (dom.features.steps) {
    dom_runRemovingSteps(node, parent)
  }

  /**
   * 14. If node is custom, then enqueue a custom element callback 
   * reaction with node, callback name "disconnectedCallback", 
   * and an empty argument list.
   */
  if (dom.features.customElements) {
    if (Guard.isCustomElementNode(node)) {
      customElement_enqueueACustomElementCallbackReaction(
        node, "disconnectedCallback", [])
    }
  }

  /**
   * 15. For each shadow-including descendant descendant of node, 
   * in shadow-including tree order, then:
   */
  let descendant = tree_getFirstDescendantNode(node, false, true)
  while (descendant !== null) {
    /**
     * 15.1. Run the removing steps with descendant.
     */
    if (dom.features.steps) {
      dom_runRemovingSteps(descendant, node)
    }

    /**
     * 15.2. If descendant is custom, then enqueue a custom element 
     * callback reaction with descendant, callback name 
     * "disconnectedCallback", and an empty argument list.
     */
    if (dom.features.customElements) {
      if (Guard.isCustomElementNode(descendant)) {
        customElement_enqueueACustomElementCallbackReaction(
          descendant, "disconnectedCallback", [])
      }
    }

    descendant = tree_getNextDescendantNode(node, descendant, false, true)
  }

  /**
   * 16. For each inclusive ancestor inclusiveAncestor of parent, and 
   * then for each registered of inclusiveAncestor's registered 
   * observer list, if registered's options's subtree is true, 
   * then append a new transient registered observer whose 
   * observer is registered's observer, options is registered's 
   * options, and source is registered to node's registered
   * observer list.
   */
  if (dom.features.mutationObservers) {
    for (const inclusiveAncestor of tree_getAncestorNodes(parent, true)) {
      for (const registered of inclusiveAncestor._registeredObserverList) {
        if (registered.options.subtree) {
          node._registeredObserverList.push({
            observer: registered.observer,
            options: registered.options,
            source: registered
          })
        }
      }
    }
  }

  /**
   * 17. If suppress observers flag is unset, then queue a tree mutation 
   * record for parent with « », « node », oldPreviousSibling, and 
   * oldNextSibling.
   */
  if (dom.features.mutationObservers) {
    if (!suppressObservers) {
      observer_queueTreeMutationRecord(parent, [], [node],
        oldPreviousSibling, oldNextSibling)
    }
  }

  /**
   * 18. If node is a Text node, then run the child text content change steps 
   * for parent.
   */
  if (dom.features.steps) {
    if (Guard.isTextNode(node)) {
      dom_runChildTextContentChangeSteps(parent)
    }
  }
}
