import { MutationAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { DOMException } from '../DOMException'
import { NodeInternal, ElementInternal, SlotInternal } from '../interfacesInternal'
import { NodeType } from '../interfaces'
import { Guard } from '../util'
import { isEmpty } from '../../util'
import { set as infraSet } from '@oozcitak/infra'

/**
 * Contains mutation algorithms.
 */
export class MutationAlgorithmImpl extends SubAlgorithmImpl implements MutationAlgorithm {

  /**
   * Initializes a new `MutationAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  ensurePreInsertionValidity(node: NodeInternal, parent: NodeInternal,
    child: NodeInternal | null): void {
    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */
    if (parent.nodeType !== NodeType.Document &&
      parent.nodeType !== NodeType.DocumentFragment &&
      parent.nodeType !== NodeType.Element)
      throw DOMException.HierarchyRequestError

    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a
     * "HierarchyRequestError" DOMException.
     */
    if (this.dom.tree.isAncestorOf(parent, node, true, true))
      throw DOMException.HierarchyRequestError

    /**
     * 3. If child is not null and its parent is not parent, then throw a
     * "NotFoundError" DOMException.
     */
    if (child !== null && child.parentNode !== parent)
      throw DOMException.NotFoundError

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
      throw DOMException.HierarchyRequestError

    /**
     * 5. If either node is a Text node and parent is a document, or node is a
     * doctype and parent is not a document, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (node.nodeType === NodeType.Text &&
      parent.nodeType === NodeType.Document)
      throw DOMException.HierarchyRequestError

    if (node.nodeType === NodeType.DocumentType &&
      parent.nodeType !== NodeType.Document)
      throw DOMException.HierarchyRequestError

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
    if (parent.nodeType === NodeType.Document) {
      if (node.nodeType === NodeType.DocumentFragment) {
        let eleCount = 0
        for (const childNode of node.childNodes) {
          if (childNode.nodeType === NodeType.Element)
            eleCount++
          else if (childNode.nodeType === NodeType.Text)
            throw DOMException.HierarchyRequestError

          if (eleCount > 1)
            throw DOMException.HierarchyRequestError
        }

        if (eleCount === 1) {
          for (const ele of parent.childNodes) {
            if (ele.nodeType === NodeType.Element)
              throw DOMException.HierarchyRequestError
          }

          if (child) {
            if (child.nodeType === NodeType.DocumentType)
              throw DOMException.HierarchyRequestError

            let doctypeChild = child.nextSibling
            while (doctypeChild) {
              if (doctypeChild.nodeType === NodeType.DocumentType)
                throw DOMException.HierarchyRequestError
              doctypeChild = doctypeChild.nextSibling
            }
          }
        }
      } else if (node.nodeType === NodeType.Element) {
        for (const ele of parent.childNodes) {
          if (ele.nodeType === NodeType.Element)
            throw DOMException.HierarchyRequestError
        }

        if (child) {
          if (child.nodeType === NodeType.DocumentType)
            throw DOMException.HierarchyRequestError

          let doctypeChild = child.nextSibling
          while (doctypeChild) {
            if (doctypeChild.nodeType === NodeType.DocumentType)
              throw DOMException.HierarchyRequestError
            doctypeChild = doctypeChild.nextSibling
          }
        }
      } else if (node.nodeType === NodeType.DocumentType) {
        for (const ele of parent.childNodes) {
          if (ele.nodeType === NodeType.DocumentType)
            throw DOMException.HierarchyRequestError
        }

        if (child) {
          let elementChild = child.previousSibling
          while (elementChild) {
            if (elementChild.nodeType === NodeType.Element)
              throw DOMException.HierarchyRequestError
            elementChild = elementChild.previousSibling
          }
        } else {
          let elementChild = parent.firstChild
          while (elementChild) {
            if (elementChild.nodeType === NodeType.Element)
              throw DOMException.HierarchyRequestError
            elementChild = elementChild.nextSibling
          }
        }
      }
    }
  }

  /** @inheritdoc */
  preInsert(node: NodeInternal, parent: NodeInternal,
    child: NodeInternal | null): NodeInternal {
    /**
     * 1. Ensure pre-insertion validity of node into parent before child.
     * 2. Let reference child be child.
     * 3. If reference child is node, set it to node’s next sibling.
     * 4. Adopt node into parent’s node document.
     * 5. Insert node into parent before reference child.
     * 6. Return node.
     */
    this.ensurePreInsertionValidity(node, parent, child)

    let referenceChild = child
    if (referenceChild === node)
      referenceChild = node.nextSibling as NodeInternal | null

    this.dom.document.adopt(node, parent._nodeDocument)
    this.insert(node, parent, referenceChild)

    return node
  }

  /** @inheritdoc */
  insert(node: NodeInternal, parent: NodeInternal, child: NodeInternal | null,
    suppressObservers?: boolean): void {

    /**
     * 1. Let count be the number of children of node if it is a 
     * DocumentFragment node, and one otherwise.
     */
    const count = (node.nodeType === NodeType.DocumentFragment ?
      node.childNodes.length : 1)

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
      const index = this.dom.tree.index(child)
      for (const range of this.dom.range.rangeList) {
        if (range._start[0] === parent && range._start[1] > index) {
          range._start[1] += count
        }
        if (range._end[0] === parent && range._end[1] > index) {
          range._end[1] += count
        }
      }
    }

    /**
     * 3. Let nodes be node’s children, if node is a DocumentFragment node; 
     * otherwise « node ».
     * 4. If node is a DocumentFragment node, remove its children with the 
     * suppress observers flag set.
     */
    const nodes: NodeInternal[] = []
    if (node.nodeType === NodeType.DocumentFragment) {
      for (const childNode of node.childNodes) {
        nodes.push(childNode as NodeInternal)
      }
      // remove child nodes
      while (node.firstChild) {
        this.remove(node.firstChild as NodeInternal, node, true)
      }
    } else {
      nodes.push(node)
    }

    /**
     * 5. If node is a DocumentFragment node, then queue a tree mutation record 
     * for node with « », nodes, null, and null.
     */
    if (Guard.isDocumentFragmentNode(node)) {
      this.dom.observer.queueTreeMutationRecord(node, [], nodes, null, null)
    }

    /**
     * 6. Let previousSibling be child’s previous sibling or parent’s last 
     * child if child is null.
     */
    const previousSibling = (child ? child.previousSibling : parent.lastChild) as NodeInternal | null

    let index = child === null ? -1 : this.dom.tree.index(child)
    /**
     * 7. For each node in nodes, in tree order:
     */
    for (const node of nodes) {
      /**
       * 7.1. If child is null, then append node to parent’s children.
       * 7.2. Otherwise, insert node into parent’s children before child’s
       * index.
       */
      if (!parent._children.has(node)) {

        node._parent = parent
        if (child === null) {
          infraSet.append(parent._children, node)
        } else {
          infraSet.insert(parent._children, node, index)
          index++
        }

        // assign siblings and children for quick lookups
        if (parent.firstChild === null) {
          node._previousSibling = null
          node._nextSibling = null

          parent._firstChild = node
          parent._lastChild = node
        } else {
          const prev = (child ? child.previousSibling : parent.lastChild) as NodeInternal | null
          const next = (child ? child : null)

          node._previousSibling = prev
          node._nextSibling = next

          if (prev) prev._nextSibling = node
          if (next) next._previousSibling = node

          if (!prev) parent._firstChild = node
          if (!next) parent._lastChild = node
        }
      }

      /**
       * 7.3. If parent is a shadow host and node is a slotable, then 
       * assign a slot for node.
       */
      if ((parent as ElementInternal)._shadowRoot !== null && Guard.isSlotable(node)) {
        this.dom.shadowTree.assignASlot(node)
      }

      /**
       * 7.4. If node is a Text node, run the child text content change 
       * steps for parent.
       */
      if (Guard.isTextNode(node)) {
        this.dom.runChildTextContentChangeSteps(parent)
      }

      /**
       * 7.5. If parent's root is a shadow root, and parent is a slot 
       * whose assigned nodes is the empty list, then run signal
       * a slot change for parent.
       */
      if (Guard.isShadowRoot(this.dom.tree.rootNode(parent)) &&
        Guard.isSlot(parent) && isEmpty(parent._assignedNodes)) {
        this.dom.shadowTree.signalASlotChange(parent)
      }

      /**
       * 7.6. Run assign slotables for a tree with node's root.
       */
      this.dom.shadowTree.assignSlotablesForATree(this.dom.tree.rootNode(node))

      /**
       * 7.7. For each shadow-including inclusive descendant 
       * inclusiveDescendant of node, in shadow-including tree
       * order:
       */
      for (const inclusiveDescendant of this.dom.tree.getDescendantNodes(node, true, true)) {
        /**
         * 7.7.1. Run the insertion steps with inclusiveDescendant.
         */
        this.dom.runInsertionSteps(inclusiveDescendant)

        /**
         * 7.7.2. If inclusiveDescendant is connected, then:
         */
        if (Guard.isElementNode(inclusiveDescendant) && 
          this.dom.shadowTree.isConnected(inclusiveDescendant)) {
          if (Guard.isCustomElementNode(inclusiveDescendant)) {
            /**
             * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
             * element callback reaction with inclusiveDescendant, callback name 
             * "connectedCallback", and an empty argument list.
             */
            this.dom.customElement.enqueueACustomElementCallbackReaction(
              inclusiveDescendant, "connectedCallback", [])
          } else {
            /**
             * TODO:
             * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
             */
          }      
        }
      }
    }

    /**
     * 8. If suppress observers flag is unset, then queue a tree mutation record
     * for parent with nodes, « », previousSibling, and child.
     */
    if (!suppressObservers) {
      this.dom.observer.queueTreeMutationRecord(parent, nodes, [],
        previousSibling, child)
    }
  }

  /** @inheritdoc */
  append(node: NodeInternal, parent: NodeInternal): NodeInternal {
    /**
     * To append a node to a parent, pre-insert node into parent before null.
     */
    return this.preInsert(node, parent, null)
  }

  /** @inheritdoc */
  replace(child: NodeInternal, node: NodeInternal,
    parent: NodeInternal): NodeInternal {

    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */
    if (parent.nodeType !== NodeType.Document &&
      parent.nodeType !== NodeType.DocumentFragment &&
      parent.nodeType !== NodeType.Element)
      throw DOMException.HierarchyRequestError

    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a 
     * "HierarchyRequestError" DOMException.
     */
    if (this.dom.tree.isAncestorOf(parent, node, true, true))
      throw DOMException.HierarchyRequestError

    /**
     * 3. If child’s parent is not parent, then throw a "NotFoundError" 
     * DOMException.
     */
    if (child.parentNode !== parent)
      throw DOMException.NotFoundError

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
      throw DOMException.HierarchyRequestError

    /**
     * 5. If either node is a Text node and parent is a document, or node is a 
     * doctype and parent is not a document, throw a "HierarchyRequestError" 
     * DOMException.
     */
    if (node.nodeType === NodeType.Text &&
      parent.nodeType === NodeType.Document)
      throw DOMException.HierarchyRequestError

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
    if (node.nodeType === NodeType.DocumentType &&
      parent.nodeType !== NodeType.Document)
      throw DOMException.HierarchyRequestError

    if (parent.nodeType === NodeType.Document) {
      if (node.nodeType === NodeType.DocumentFragment) {
        let eleCount = 0
        for (const childNode of node.childNodes) {
          if (childNode.nodeType === NodeType.Element)
            eleCount++
          else if (childNode.nodeType === NodeType.Text)
            throw DOMException.HierarchyRequestError

          if (eleCount > 1)
            throw DOMException.HierarchyRequestError
        }

        if (eleCount === 1) {
          for (const ele of parent.childNodes) {
            if (ele.nodeType === NodeType.Element && ele !== child)
              throw DOMException.HierarchyRequestError
          }

          let doctypeChild = child.nextSibling
          while (doctypeChild) {
            if (doctypeChild.nodeType === NodeType.DocumentType)
              throw DOMException.HierarchyRequestError
            doctypeChild = doctypeChild.nextSibling
          }
        }
      } else if (node.nodeType === NodeType.Element) {
        for (const ele of parent.childNodes) {
          if (ele.nodeType === NodeType.Element && ele !== child)
            throw DOMException.HierarchyRequestError
        }

        let doctypeChild = child.nextSibling
        while (doctypeChild) {
          if (doctypeChild.nodeType === NodeType.DocumentType)
            throw DOMException.HierarchyRequestError
          doctypeChild = doctypeChild.nextSibling
        }
      } else if (node.nodeType === NodeType.DocumentType) {
        for (const ele of parent.childNodes) {
          if (ele.nodeType === NodeType.DocumentType && ele !== child)
            throw DOMException.HierarchyRequestError
        }

        let elementChild = child.previousSibling
        while (elementChild) {
          if (elementChild.nodeType === NodeType.Element)
            throw DOMException.HierarchyRequestError
          elementChild = elementChild.previousSibling
        }
      }
    }

    /**
     * 7. Let reference child be child’s next sibling.
     * 8. If reference child is node, set it to node’s next sibling.
     * 8. Let previousSibling be child’s previous sibling.
     */
    let referenceChild = child.nextSibling as NodeInternal | null
    if (referenceChild === node) referenceChild = node.nextSibling as NodeInternal | null
    let previousSibling = child.previousSibling as NodeInternal | null

    /**
     * 10. Adopt node into parent’s node document.
     * 11. Let removedNodes be the empty list.
     */
    this.dom.document.adopt(node, (parent as NodeInternal)._nodeDocument)
    const removedNodes: NodeInternal[] = []

    /**
     * 12. If child’s parent is not null, then:
     */
    if (child.parentNode !== null) {
      /**
       * 12.1. Set removedNodes to [child].
       * 12.2. Remove child from its parent with the suppress observers flag 
       * set.
       */
      removedNodes.push(child)
      this.remove(child, parent, true)
    }

    /**
     * 13. Let nodes be node’s children if node is a DocumentFragment node; 
     * otherwise [node].
     */
    const nodes: NodeInternal[] = []
    if (node.nodeType === NodeType.DocumentFragment) {
      for (const childNode of node.childNodes) {
        nodes.push(childNode as NodeInternal)
      }
    } else {
      nodes.push(node)
    }

    /**
     * 14. Insert node into parent before reference child with the suppress 
     * observers flag set.
     */
    this.insert(node, parent, referenceChild, true)

    /**
     * 15. Queue a tree mutation record for parent with nodes, removedNodes, 
     * previousSibling, and reference child.
     */
    this.dom.observer.queueTreeMutationRecord(parent, nodes, removedNodes,
      previousSibling, referenceChild)

    /**
     * 16. Return child.
     */
    return child
  }

  /** @inheritdoc */
  replaceAll(node: NodeInternal | null, parent: NodeInternal): void {
    /**
     * 1. If node is not null, adopt node into parent’s node document.
     */
    if (node !== null) {
      this.dom.document.adopt(node, parent._nodeDocument)
    }

    /**
     * 2. Let removedNodes be parent’s children.
     */
    const removedNodes: NodeInternal[] = []
    for (const childNode of parent.childNodes) {
      removedNodes.push(childNode as NodeInternal)
    }

    /**
     * 3. Let addedNodes be the empty list.
     * 4. If node is DocumentFragment node, then set addedNodes to node’s 
     * children.
     * 5. Otherwise, if node is non-null, set addedNodes to [node].
     */
    const addedNodes: NodeInternal[] = []
    if (node && node.nodeType === NodeType.DocumentFragment) {
      for (const childNode of node.childNodes) {
        addedNodes.push(childNode as NodeInternal)
      }
    } else if (node !== null) {
      addedNodes.push(node)
    }

    /**
     * 6. Remove all parent’s children, in tree order, with the suppress 
     * observers flag set.
     */
    for (const childNode of removedNodes) {
      this.remove(childNode, parent, true)
    }

    /**
     * 7. If node is not null, then insert node into parent before null with the 
     * suppress observers flag set.
     */
    if (node !== null) {
      this.insert(node, parent, null, true)
    }

    /**
     * 8. Queue a tree mutation record for parent with addedNodes, removedNodes, 
     * null, and null.
     */
    this.dom.observer.queueTreeMutationRecord(parent, addedNodes, removedNodes,
      null, null)
  }

  /** @inheritdoc */
  preRemove(child: NodeInternal, parent: NodeInternal): NodeInternal {
    /**
     * 1. If child’s parent is not parent, then throw a "NotFoundError" 
     * DOMException.
     * 2. Remove child from parent.
     * 3. Return child.
     */
    if (child.parentNode !== parent)
      throw DOMException.NotFoundError

    this.remove(child, parent)

    return child
  }

  /** @inheritdoc */
  remove(node: NodeInternal, parent: NodeInternal, suppressObservers?: boolean): void {
    /**
     * 1. Let index be node’s index.
     */
    const index = this.dom.tree.index(node)

    /**
     * 2. For each live range whose start node is an inclusive descendant of 
     * node, set its start to (parent, index).
     * 3. For each live range whose end node is an inclusive descendant of 
     * node, set its end to (parent, index).
     */
    for (const range of this.dom.range.rangeList) {
      if (this.dom.tree.isDescendantOf(node, range._start[0] as NodeInternal, true)) {
        range._start = [parent, index]
      }
      if (this.dom.tree.isDescendantOf(node, range._end[0] as NodeInternal, true)) {
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
    for (const range of this.dom.range.rangeList) {
      if (range._start[0] === parent && range._start[1] > index) {
        range._start[1] -= 1
      }
      if (range._end[0] === parent && range._end[1] > index) {
        range._end[1] -= 1
      }
    }

    /**
     * 6. For each NodeIterator object iterator whose root’s node document is 
     * node’s node document, run the NodeIterator pre-removing steps given node
     * and iterator.
     */
    for (const iterator of this.dom.nodeIterator.iteratorList) {
      if ((iterator._root as NodeInternal)._nodeDocument === node._nodeDocument) {
        this.dom.runNodeIteratorPreRemovingSteps(iterator, node)
      }
    }

    /**
     * 7. Let oldPreviousSibling be node’s previous sibling.
     * 8. Let oldNextSibling be node’s next sibling.
     */
    const oldPreviousSibling = node.previousSibling as NodeInternal | null
    const oldNextSibling = node.nextSibling as NodeInternal | null

    /**
     * 9. Remove node from its parent’s children.
     */
    node._parent = null
    parent._children.delete(node)

    // assign siblings and children for quick lookups
    const prev = node.previousSibling as NodeInternal | null
    const next = node.nextSibling as NodeInternal | null

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
    if (Guard.isSlotable(node) && this.dom.shadowTree.isAssigned(node)) {
      this.dom.shadowTree.assignSlotables(node._assignedSlot as SlotInternal)
    }

    /**
     * 11. If parent’s root is a shadow root, and parent is a slot whose 
     * assigned nodes is the empty list, then run signal a slot change for 
     * parent.
     */
    if (Guard.isShadowRoot(this.dom.tree.rootNode(parent)) &&
      Guard.isSlot(parent) && isEmpty(parent._assignedNodes)) {
      this.dom.shadowTree.signalASlotChange(parent)
    }

    /**
     * 12. If node has an inclusive descendant that is a slot, then:
     * 12.1. Run assign slotables for a tree with parent's root.
     * 12.2. Run assign slotables for a tree with node.
     */
    let hasSlotDescendant = false
    for (const descendant of this.dom.tree.getDescendantElements(node, true)) {
      if (Guard.isSlot(descendant)) {
        hasSlotDescendant = true
        break
      }
    }
    if (hasSlotDescendant) {
      this.dom.shadowTree.assignSlotablesForATree(this.dom.tree.rootNode(parent))
      this.dom.shadowTree.assignSlotablesForATree(node)
    }

    /**
     * 13. Run the removing steps with node and parent.
     */
    this.dom.runRemovingSteps(node, parent)

    /**
     * 14. If node is custom, then enqueue a custom element callback 
     * reaction with node, callback name "disconnectedCallback", 
     * and an empty argument list.
     */
    if (Guard.isCustomElementNode(node)) {
      this.dom.customElement.enqueueACustomElementCallbackReaction(
        node, "disconnectedCallback", [])
    }

    /**
     * 15. For each shadow-including descendant descendant of node, 
     * in shadow-including tree order, then:
     */
    for (const descendant of this.dom.tree.getDescendantNodes(node, false, true)) {
      /**
       * 15.1. Run the removing steps with descendant.
       */
      this.dom.runRemovingSteps(descendant)

      /**
       * 15.2. If descendant is custom, then enqueue a custom element 
       * callback reaction with descendant, callback name 
       * "disconnectedCallback", and an empty argument list.
       */
      if (Guard.isCustomElementNode(descendant)) {
        this.dom.customElement.enqueueACustomElementCallbackReaction(
          descendant, "disconnectedCallback", [])
      }  
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
    for (const inclusiveAncestor of this.dom.tree.getAncestorNodes(parent, true)) {
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

    /**
     * 17. If suppress observers flag is unset, then queue a tree mutation 
     * record for parent with « », « node », oldPreviousSibling, and 
     * oldNextSibling.
     */
    if (!suppressObservers) {
      this.dom.observer.queueTreeMutationRecord(parent, [], [node],
        oldPreviousSibling, oldNextSibling)
    }

    /**
     * 18. If node is a Text node, then run the child text content change steps 
     * for parent.
     */
    if (Guard.isTextNode(node)) {
      this.dom.runChildTextContentChangeSteps(parent)
    }
  }

}
