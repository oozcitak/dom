import {
  DocumentInternal, DOMAlgorithmInternal, ElementInternal,
  HTMLCollectionInternal, NodeInternal, DOMTokenListInternal,
  DocumentFragmentInternal, TextInternal, CDATASectionInternal,
  CommentInternal, ProcessingInstructionInternal, AttrInternal,
  DOMImplementationInternal, DocumentTypeInternal, CloningStep, RangeInternal,
  MutationRecordInternal, MutationObserverInternal, NodeListInternal,
  NamedNodeMapInternal, ChildTextContentChangeStep, AdoptingStep, 
  NodeIteratorInternal, TreeWalkerInternal, NodeFilterInternal
} from './interfacesInternal'
import { Namespace, HTMLSpec } from './spec'
import { DOMException } from './DOMException'
import { isString } from '../util'
import { OrderedSet, Guard, List } from './util'
import {
  TextImpl, CDATASectionImpl, ProcessingInstructionImpl, DOMImplementationImpl,
  CommentImpl, DocumentImpl, DocumentFragmentImpl, HTMLCollectionImpl,
  NamedNodeMapImpl, ElementImpl, DocumentTypeImpl, AttrImpl, NodeListImpl,
  NodeListStaticImpl, RangeImpl, NodeIteratorImpl, TreeWalkerImpl, 
  NodeFilterImpl
} from '.'
import { NodeType } from './interfaces'

/**
 * Represents a document node.
 */
export class DOMAlgorithmImpl implements DOMAlgorithmInternal {

  cloningSteps: CloningStep[] = []
  adoptingSteps: AdoptingStep[] = []
  childTextContentChangeSteps: ChildTextContentChangeStep[] = []

  /** @inheritdoc */
  runCloningSteps(copy: NodeInternal, node: NodeInternal, document:
    DocumentInternal, cloneChildrenFlag?: boolean): void {
    for (const cloningStep of this.cloningSteps) {
      cloningStep.call(this, copy, node, document, cloneChildrenFlag)
    }
  }

  /** @inheritdoc */
  runAdoptingSteps(node: NodeInternal, oldDocument: DocumentInternal): void {
    for (const adoptingStep of this.adoptingSteps) {
      adoptingStep.call(this, node, oldDocument)
    }
  }

  /** @inheritdoc */
  runChildTextContentChangeSteps(parent: NodeInternal): void {
    for (const textChangeStep of this.childTextContentChangeSteps) {
      textChangeStep.call(this, parent)
    }
  }

  /** @inheritdoc */
  createAnElement(document: DocumentInternal, localName: string,
    namespace: string | null, prefix: string | null = null,
    is: string | null = null,
    synchronousCustomElementsFlag: boolean = false): ElementInternal {

    /**
     * 1. If prefix was not given, let prefix be null.
     * 2. If is was not given, let is be null.
     * 3. Let result be null.
     */
    let result: ElementInternal | null = null

    /**
     * 4. TODO: Let definition be the result of looking up a custom element 
     * definition given document, namespace, localName, and is.
     */
    let definition = null

    /**
     * TODO: 
     * 5. If definition is non-null, and definition’s name is not equal to 
     * its local name (i.e., definition represents a customized built-in
     * element), then:
     * 5.1. Let interface be the element interface for localName and the HTML
     * namespace.
     * 5.2. Set result to a new element that implements interface, with no 
     * attributes, namespace set to the HTML namespace, namespace prefix 
     * set to prefix, local name set to localName, custom element state set
     * to "undefined", custom element definition set to null, is value set
     * to is, and node document set to document.
     * 5.3. If the synchronous custom elements flag is set, upgrade element
     * using definition.
     * 5.4. Otherwise, enqueue a custom element upgrade reaction given result
     * and definition.
     * 6. Otherwise, if definition is non-null, then:
     * 6.1. If the synchronous custom elements flag is set, then run these
     * steps while catching any exceptions:
     * 6.1.1. Let C be definition’s constructor.
     * 6.1.2. Set result to the result of constructing C, with no arguments.
     * 6.1.3. Assert: result’s custom element state and custom element definition
     * are initialized.
     * 6.1.4. Assert: result’s namespace is the HTML namespace.
     * _Note:_ IDL enforces that result is an HTMLElement object, which all 
     * use the HTML namespace.
     * 6.1.5. If result’s attribute list is not empty, then throw a 
     * "NotSupportedError" DOMException.
     * 6.1.6. If result has children, then throw a "NotSupportedError" 
     * DOMException.
     * 6.1.7. If result’s parent is not null, then throw a
     * "NotSupportedError" DOMException.
     * 6.1.8. If result’s node document is not document, then throw a 
     * "NotSupportedError" DOMException.
     * 6.1.9. If result’s local name is not equal to localName, then throw 
     * a "NotSupportedError" DOMException.
     * 6.1.10. Set result’s namespace prefix to prefix.
     * 6.1.11. Set result’s is value to null.
     * 
     * If any of these steps threw an exception, then:
     * - Report the exception.
     * - Set result to a new element that implements the HTMLUnknownElement
     * interface, with no attributes, namespace set to the HTML namespace, 
     * namespace prefix set to prefix, local name set to localName, custom 
     * element state set to "failed", custom element definition set to null, 
     * is value set to null, and node document set to document.
     * 
     * 6.2. Otherwise:
     * 6.2.1. Set result to a new element that implements the HTMLElement 
     * interface, with no attributes, namespace set to the HTML namespace, 
     * namespace prefix set to prefix, local name set to localName, custom
     * element state set to "undefined", custom element definition set to 
     * null, is value set to null, and node document set to document.
     * 6.2.2. Enqueue a custom element upgrade reaction given result and 
     * definition.
     * 7. Otherwise:
     */

    /**
     * 7.1. Let interface be the element interface for localName and 
     * namespace.
     * 7.2. Set result to a new element that implements interface, with no
     * attributes, namespace set to namespace, namespace prefix set to prefix,
     * local name set to localName, custom element state set to 
     * "uncustomized", custom element definition set to null, is value set to
     * is, and node document set to document.
     */
    result = this.createElement(localName, namespace, prefix)
    result._attributeList = this.createNamedNodeMap(result)
    result._customElementState = "uncustomized"
    result._customElementDefinition = null
    result._is = is
    result._nodeDocument = document

    /**
     * 7.3. If namespace is the HTML namespace, and either localName is a 
     * valid custom element name or is is non-null, then set result’s 
     * custom element state to "undefined".
     */
    if (namespace === Namespace.HTML && (is !== null ||
      HTMLSpec.isValidCustomElementName(localName))) {
      result._customElementState = "undefined"
    }

    /**
     * 8. Returns result
     */
    return result
  }

  /** @inheritdoc */
  validateAndExtract(namespace: string | null, qualifiedName: string):
    [string | null, string | null, string] {

    if (!namespace) namespace = null

    const parts = Namespace.extractQName(qualifiedName)
    const prefix = parts.prefix
    const localName = parts.localName

    if (prefix && !namespace)
      throw DOMException.NamespaceError

    if (prefix === "xml" && namespace !== Namespace.XML)
      throw DOMException.NamespaceError

    if (namespace !== Namespace.XMLNS &&
      (prefix === "xmlns" || qualifiedName === "xmlns"))
      throw DOMException.NamespaceError

    if (namespace === Namespace.XMLNS &&
      (prefix !== "xmlns" && qualifiedName !== "xmlns"))
      throw DOMException.NamespaceError

    return [namespace, prefix, localName]
  }

  /** @inheritdoc */
  internalCreateElementNS(document: DocumentInternal, namespace: string | null,
    qualifiedName: string, options?: string | { is: string }): ElementInternal {
    /**
     * 1. Let namespace, prefix, and localName be the result of passing 
     * namespace and qualifiedName to validate and extract.
     * 2. Let is be null.
     * 3. If options is a dictionary and options’s is is present, then set 
     * is to it.
     * 4. Return the result of creating an element given document, localName, 
     * namespace, prefix, is, and with the synchronous custom elements flag set.
     */

    const [ns, prefix, localName] =
      this.validateAndExtract(namespace, qualifiedName)

    let is: string | null = null
    if (options !== undefined) {
      if (isString(options)) {
        is = options
      } else {
        is = options.is
      }
    }

    return this.createAnElement(document, localName, ns, prefix, is, true)
  }

  /** @inheritdoc */
  listOfElementsWithQualifiedName(qualifiedName: string, root: NodeInternal):
    HTMLCollectionInternal {

    /** 
     * 1. If qualifiedName is "*" (U+002A), return a HTMLCollection rooted at
     * root, whose filter matches only descendant elements.
     * 2. Otherwise, if root’s node document is an HTML document, return a
     * HTMLCollection rooted at root, whose filter matches the following
     * descendant elements:
     * 2.1. Whose namespace is the HTML namespace and whose qualified name is
     * qualifiedName, in ASCII lowercase.
     * 2.2. Whose namespace is not the HTML namespace and whose qualified name
     * is qualifiedName.
     * 3. Otherwise, return a HTMLCollection rooted at root, whose filter
     * matches descendant elements whose qualified name is qualifiedName.
     */
    if (qualifiedName === "*") {
      return this.createHTMLCollection(root)
    } else if (root._nodeDocument._type === "html") {
      return this.createHTMLCollection(root, function (ele) {
        if (ele._namespace === Namespace.HTML &&
          ele._qualifiedName === qualifiedName.toLowerCase()) {
          return ele
        } else if (ele._namespace !== Namespace.HTML &&
          ele._qualifiedName === qualifiedName) {
          return ele
        }
      })
    } else {
      return this.createHTMLCollection(root, function (ele) {
        if (ele._qualifiedName === qualifiedName) {
          return ele
        }
      })
    }

  }

  /** @inheritdoc */
  listOfElementsWithNamespace(namespace: string | null, localName: string,
    root: NodeInternal): HTMLCollectionInternal {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. If both namespace and localName are "*" (U+002A), return a 
     * HTMLCollection rooted at root, whose filter matches descendant elements.
     * 3. Otherwise, if namespace is "*" (U+002A), return a HTMLCollection 
     * rooted at root, whose filter matches descendant elements whose local 
     * name is localName.
     * 4. Otherwise, if localName is "*" (U+002A), return a HTMLCollection 
     * rooted at root, whose filter matches descendant elements whose 
     * namespace is namespace.
     * 5. Otherwise, return a HTMLCollection rooted at root, whose filter 
     * matches descendant elements whose namespace is namespace and local 
     * name is localName.
     */
    if (namespace === '') namespace = null

    if (namespace === "*" && localName === "*") {
      return this.createHTMLCollection(root)
    } else if (namespace === "*") {
      return this.createHTMLCollection(root, function (ele) {
        if (ele._localName === localName) {
          return ele
        }
      })
    } else if (localName === "*") {
      return this.createHTMLCollection(root, function (ele) {
        if (ele._namespace === namespace) {
          return ele
        }
      })
    } else {
      return this.createHTMLCollection(root, function (ele) {
        if (ele._localName === localName && ele._namespace === namespace) {
          return ele
        }
      })
    }
  }

  /** @inheritdoc */
  listOfElementsWithClassNames(classNames: string, root: NodeInternal):
    HTMLCollectionInternal {

    /**
     * 1. Let classes be the result of running the ordered set parser
     * on classNames.
     * 2. If classes is the empty set, return an empty HTMLCollection.
     * 3. Return a HTMLCollection rooted at root, whose filter matches
     * descendant elements that have all their classes in classes.
     * The comparisons for the classes must be done in an ASCII case-insensitive
     * manner if root’s node document’s mode is "quirks", and in a
     * case-sensitive manner otherwise. 
     */

    const classes = OrderedSet.parse(classNames)
    if (classes.size === 0) {
      return this.createHTMLCollection(root, (ele) => false)
    }

    const caseSensitive = (root._nodeDocument._mode !== "quirks")
    return this.createHTMLCollection(root, function (ele) {
      const eleClasses = ele.classList as DOMTokenListInternal
      return OrderedSet.contains(eleClasses._tokenSet, classes, caseSensitive)
    })

  }

  /** @inheritdoc */
  cloneNode(node: NodeInternal, document: DocumentInternal | null = null,
    cloneChildrenFlag: boolean = false): NodeInternal {
    /**
     * 1. If document is not given, let document be node’s node document.
     */
    if (document === null)
      document = node._nodeDocument

    let copy: NodeInternal

    if (Guard.isElementNode(node)) {
      /**
       * 2. If node is an element, then:
       * 2.1. Let copy be the result of creating an element, given document, 
       * node’s local name, node’s namespace, node’s namespace prefix, 
       * and node’s is value, with the synchronous custom elements flag unset.
       * 2.2. For each attribute in node’s attribute list:
       * 2.2.1. Let copyAttribute be a clone of attribute.
       * 2.2.2. Append copyAttribute to copy.
       */
      copy = this.createAnElement(document, node._localName,
        node._namespace, node._namespacePrefix, node._is, false)
      for (const attribute of node._attributeList) {
        const copyAttribute = this.cloneNode(attribute as AttrInternal, document)
        this.appendAnAttribute(copyAttribute as AttrInternal, copy as ElementInternal)
      }
    } else {
      if (Guard.isDocumentNode(node)) {
        const doc = this.createDocument()
        doc._encoding = node._encoding
        doc._contentType = node._contentType
        doc._URL = node._URL
        doc._origin = node._origin
        doc._type = node._type
        doc._mode = node._mode
        copy = doc
      } else if (Guard.isDocumentTypeNode(node)) {
        const doctype = this.createDocumentType()
        doctype._name = node._name
        doctype._publicId = node._publicId
        doctype._systemId = node._systemId
        copy = doctype
      } else if (Guard.isAttrNode(node)) {
        const attr = this.createAttrNode()
        attr._namespace = node._namespace
        attr._namespacePrefix = node._namespacePrefix
        attr._localName = node._localName
        attr._value = node._value
        copy = attr
      } else if (Guard.isTextNode(node)) {
        copy = this.createTextNode(node._data)
      } else if (Guard.isCommentNode(node)) {
        copy = this.createCommentNode(node._data)
      } else if (Guard.isProcessingInstructionNode(node)) {
        copy = this.createProcessingInstruction(node._target, node._data)
      } else {
        copy = Object.create(node)
      }
      /**
       * 3. Otherwise, let copy be a node that implements the same interfaces as
       * node, and fulfills these additional requirements, switching on node:
       * - Document
       * Set copy’s encoding, content type, URL, origin, type, and mode, to those
       * of node.
       * - DocumentType
       * Set copy’s name, public ID, and system ID, to those of node.
       * - Attr
       * Set copy’s namespace, namespace prefix, local name, and value, to
       * those of node.
       * - Text
       * - Comment
       * Set copy’s data, to that of node.
       * - ProcessingInstruction
       * Set copy’s target and data to those of node.
       * - Any other node
       */
    }

    /**
     * 4. Set copy’s node document and document to copy, if copy is a document,
     * and set copy’s node document to document otherwise.
     */
    if (Guard.isDocumentNode(copy)) {
      copy._nodeDocument = copy
      document = copy
    } else {
      copy._nodeDocument = document
    }

    /**
     * 5. Run any cloning steps defined for node in other applicable 
     * specifications and pass copy, node, document and the clone children flag
     * if set, as parameters.
     */
    this.runCloningSteps(copy, node, document, cloneChildrenFlag)

    /**
     * 6. If the clone children flag is set, clone all the children of node and
     * append them to copy, with document as specified and the clone children
     * flag being set.
     */
    if (cloneChildrenFlag) {
      for (const child of node.childNodes) {
        const childCopy = this.cloneNode(child as NodeInternal, document, true)
        this.appendNode(childCopy, copy)
      }
    }

    /**
     * 7. Return copy.
     */
    return copy
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
      referenceChild = node.nextSibling as NodeInternal

    this.adoptNode(node, parent._nodeDocument)
    this.insertNode(node, parent, referenceChild)

    return node
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
    if (this.isAncestorOf(parent, node, true, true))
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
  adoptNode(node: NodeInternal, document: DocumentInternal): void {
    /**
     * 1. Let oldDocument be node’s node document.
     * 2. If node’s parent is not null, remove node from its parent.
     */
    const oldDocument = node._nodeDocument

    if (node.parentNode)
      this.removeNode(node, node.parentNode as NodeInternal)

    /**
     * 3. If document is not oldDocument, then:
     */
    if (document !== oldDocument) {
      /**
       * 3.1. For each inclusiveDescendant in node’s shadow-including inclusive 
       * descendants:
       */
      for (const inclusiveDescendant of this.getDescendantNodes(node, true, true)) {
        /**
         * 3.1.1. Set inclusiveDescendant’s node document to document.
         * 3.1.2. If inclusiveDescendant is an element, then set the node 
         * document of each attribute in inclusiveDescendant’s attribute list
         * to document.
         */
        inclusiveDescendant._nodeDocument = document as DocumentInternal

        if (Guard.isElementNode(inclusiveDescendant)) {
          for (const attr of inclusiveDescendant.attributes) {
            (attr as AttrInternal)._nodeDocument = document
          }
        }

        /**
         * TODO: 
         * 3.2. For each inclusiveDescendant in node's shadow-including 
         * inclusive descendants that is custom, enqueue a custom
         * element callback reaction with inclusiveDescendant, 
         * callback name "adoptedCallback", and an argument list 
         * containing oldDocument and document.
         */

        /**
         * 3.3. For each inclusiveDescendant in node’s shadow-including 
         * inclusive descendants, in shadow-including tree order, run the 
         * adopting steps with inclusiveDescendant and oldDocument.
         */
        this.runAdoptingSteps(inclusiveDescendant, oldDocument)
      }
    }
  }

  /** @inheritdoc */
  insertNode(node: NodeInternal, parent: NodeInternal, child: NodeInternal | null,
    suppressObservers?: boolean): void {

    const count = (node.nodeType === NodeType.DocumentFragment ?
      node.childNodes.length : 1)

    if (child !== null) {
      /**
       * 1. For each live range whose start node is parent and start 
       * offset is greater than child's index, increase its start 
       * offset by count.
       * 2. For each live range whose end node is parent and end 
       * offset is greater than child's index, increase its end 
       * offset by count.
       */
      const doc = parent._nodeDocument
      const index = this.index(child)
      for (const item of doc._rangeList) {
        const range = item as RangeInternal
        if (range._start[0] === parent && range._start[1] > index) {
          range._start[1] += count
        }
        if (range._end[0] === parent && range._end[1] > index) {
          range._end[1] += count
        }
      }
    }

    const nodes: NodeInternal[] = []
    if (node.nodeType === NodeType.DocumentFragment) {
      for (const childNode of node.childNodes) {
        nodes.push(childNode as NodeInternal)
      }
      // remove child nodes
      while (node.firstChild) {
        this.removeNode(node.firstChild as NodeInternal, node, true)
      }
    } else {
      nodes.push(node)
    }

    this.queueTreeMutationRecord(node, [], nodes, null, null)

    const previousSibling = (child ? child.previousSibling : parent.lastChild) as NodeInternal | null

    for (const node of nodes) {
      if (!child)
        List.append(node, parent)
      else
        List.insert(node, parent, child)

      /**
       * TODO: If parent is a shadow host and node is a slotable, then 
       * assign a slot for node.
       */

      /**
       * If node is a Text node, run the child text content change 
       * steps for parent.
       */
      if (Guard.isTextNode(node)) {
        this.runChildTextContentChangeSteps(parent)
      }
      /**
       * TODO: If parent's root is a shadow root, and parent is a slot 
       * whose assigned nodes is the empty list, then run signal
       * a slot change for parent.
       * 
       * Run assign slotables for a tree with node's root.
       * 
       * For each shadow-including inclusive descendant 
       * inclusiveDescendant of node, in shadow-including tree
       * order:
       * 
       * 1. Run the insertion steps with inclusiveDescendant.
       * 2. If inclusiveDescendant is connected, then:
       *    - If inclusiveDescendant is custom, then enqueue a
       *      custom element callback reaction with
       *      inclusiveDescendant, callback name "connectedCallback",
       *      and an empty argument list.
       *    - Otherwise, try to upgrade inclusiveDescendant.
       */
    }

    this.queueTreeMutationRecord(parent, nodes, [], previousSibling, child)
  }

  /** @inheritdoc */
  appendNode(node: NodeInternal, parent: NodeInternal): NodeInternal {
    return this.preInsert(node, parent, null)
  }

  /** @inheritdoc */
  replaceNode(child: NodeInternal, node: NodeInternal,
    parent: NodeInternal): NodeInternal {

    // Only document, document fragment and element nodes can have
    // child nodes
    if (parent.nodeType !== NodeType.Document &&
      parent.nodeType !== NodeType.DocumentFragment &&
      parent.nodeType !== NodeType.Element)
      throw DOMException.HierarchyRequestError

    // node should not be an ancestor of parent
    if (this.isAncestorOf(parent, node, true, true))
      throw DOMException.HierarchyRequestError

    // removed child node should be a child node of parent
    if (child.parentNode !== parent)
      throw DOMException.NotFoundError

    // only document fragment, document type, element, text,
    // processing instruction or comment nodes can be child nodes
    if (node.nodeType !== NodeType.DocumentFragment &&
      node.nodeType !== NodeType.DocumentType &&
      node.nodeType !== NodeType.Element &&
      node.nodeType !== NodeType.Text &&
      node.nodeType !== NodeType.ProcessingInstruction &&
      node.nodeType !== NodeType.CData &&
      node.nodeType !== NodeType.Comment)
      throw DOMException.HierarchyRequestError

    // a document node cannot have text child nodes
    if (node.nodeType === NodeType.Text &&
      parent.nodeType === NodeType.Document)
      throw DOMException.HierarchyRequestError

    // a document type node can only be parented to a document
    // node
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

    let referenceChild = child.nextSibling as NodeInternal | null
    if (referenceChild === node) referenceChild = node.nextSibling as NodeInternal | null
    let previousSibling = child.previousSibling as NodeInternal | null

    this.adoptNode(node, (parent as NodeInternal)._nodeDocument)

    const removedNodes: NodeInternal[] = []

    if (child.parentNode) {
      removedNodes.push(child)
      this.removeNode(child, parent, true)
    }

    const nodes: NodeInternal[] = []
    if (node.nodeType === NodeType.DocumentFragment) {
      for (const childNode of node.childNodes) {
        nodes.push(childNode as NodeInternal)
      }
    } else {
      nodes.push(node)
    }

    this.insertNode(node, parent, referenceChild, true)

    this.queueTreeMutationRecord(parent, nodes, removedNodes, previousSibling, referenceChild)

    return child
  }

  /** @inheritdoc */
  replaceAllNode(node: NodeInternal | null, parent: NodeInternal): void {
    if (node) {
      this.adoptNode(node, parent._nodeDocument)
    }

    const removedNodes: NodeInternal[] = []
    for (const childNode of parent.childNodes) {
      removedNodes.push(childNode as NodeInternal)
    }

    const addedNodes: NodeInternal[] = []
    if (node && node.nodeType === NodeType.DocumentFragment) {
      for (const childNode of node.childNodes) {
        addedNodes.push(childNode as NodeInternal)
      }
    } else if (node) {
      addedNodes.push(node)
    }

    for (const childNode of removedNodes) {
      this.removeNode(childNode, parent, true)
    }

    if (node) {
      this.insertNode(node, parent, null, true)
    }

    this.queueTreeMutationRecord(parent, addedNodes, removedNodes, null, null)
  }

  /** @inheritdoc */
  preRemoveNode(node: NodeInternal, parent: NodeInternal): NodeInternal {
    if (node.parentNode !== parent)
      throw DOMException.NotFoundError

    this.removeNode(node, parent)

    return node
  }

  /** @ignore */
  removeNode(node: NodeInternal, parent: NodeInternal, suppressObservers?: boolean): void {
    /**
     * For each live range whose start node is an inclusive
     * descendant of node, set its start to (parent, index).
     * 
     * For each live range whose end node is an inclusive descendant
     * of node, set its end to (parent, index).
     * 
     * For each live range whose start node is parent and start 
     * offset is greater than index, decrease its start offset by 1.
     * 
     * For each live range whose end node is parent and end offset 
     * is greater than index, decrease its end offset by 1.
     */
    const index = this.index(node)
    const doc = (parent as NodeInternal)._nodeDocument as DocumentInternal
    for (const item of doc._rangeList) {
      const range = item as RangeInternal
      if (this.isDescendantOf(node, range._start[0] as NodeInternal, true)) {
        range._start = [parent, index]
      }
      if (this.isDescendantOf(node, range._end[0] as NodeInternal, true)) {
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
     * TODO: For each NodeIterator object iterator whose root's node 
     * document is node's node document, run the NodeIterator 
     * pre-removing steps given node and iterator.
     */

    const oldPreviousSibling = node.previousSibling as NodeInternal | null
    const oldNextSibling = node.nextSibling as NodeInternal | null

    List.remove(node, parent)

    /**
     * TODO: If node is assigned, then run assign slotables for node's 
     * assigned slot.
     *
     * If parent's root is a shadow root, and parent is a slot whose
     * assigned nodes is the empty list, then run signal a slot 
     * change for parent.
     * 
     * If node has an inclusive descendant that is a slot, then:
     *   1. Run assign slotables for a tree with parent's root.
     *   2. Run assign slotables for a tree with node.
     * 
     * Run the removing steps with node and parent.
     * 
     * If node is custom, then enqueue a custom element callback 
     * reaction with node, callback name "disconnectedCallback", 
     * and an empty argument list.
     * 
     * For each shadow-including descendant descendant of node, 
     * in shadow-including tree order, then:
     *   1. Run the removing steps with descendant.
     *   2. If descendant is custom, then enqueue a custom element 
     *      callback reaction with descendant, callback name 
     *      "disconnectedCallback", and an empty argument list.
     * 
     * For each inclusive ancestor inclusiveAncestor of parent, and 
     * then for each registered of inclusiveAncestor's registered 
     * observer list, if registered's options's subtree is true, 
     * then append a new transient registered observer whose 
     * observer is registered's observer, options is registered's 
     * options, and source is registered to node's registered
     * observer list.
     */

    this.queueTreeMutationRecord(parent, [], [node],
      oldPreviousSibling, oldNextSibling)

    if (Guard.isTextNode(node)) {
      this.runChildTextContentChangeSteps(parent)
    }
  }

  /** @inheritdoc */
  queueMutationRecord(type: string, target: NodeInternal, name: string | null,
    namespace: string | null, oldValue: string | null,
    addedNodes: NodeInternal[], removedNodes: NodeInternal[],
    previousSibling: NodeInternal | null, nextSibling: NodeInternal | null): void {

    const interestedObservers = new Map<MutationObserverInternal, string | null>()
    for (const node of this.getAncestorNodes(target, true)) {
      for (const registered of node._registeredObserverList) {
        const options = registered.options

        if (node !== target && !options.subtree) continue
        if (type === "attributes" && !options.attributes) continue
        if (type === "attributes" && options.attributeFilter &&
          (!options.attributeFilter.includes(name || '') || namespace !== null)) continue
        if (type === "characterData" && !options.characterData) continue
        if (type === "childList" && !options.childList) continue

        const mo = registered.observer as MutationObserverInternal
        if (!interestedObservers.has(mo)) {
          interestedObservers.set(mo, null)
        }
        if ((type === "attributes" && options.attributeOldValue) ||
          (type === "characterData" && options.characterDataOldValue)) {
          interestedObservers.set(mo, oldValue)
        }
      }
    }
    for (const [observer, mappedOldValue] of interestedObservers) {
      const record: MutationRecordInternal = {
        type: type,
        target: target,
        attributeName: name,
        attributeNamespace: namespace,
        oldValue: mappedOldValue,
        addedNodes: this.createNodeListStatic(target, addedNodes),
        removedNodes: this.createNodeListStatic(target, removedNodes),
        previousSibling: previousSibling,
        nextSibling: nextSibling
      }

      const queue: MutationRecordInternal[] = observer._recordQueue
      queue.push(record)
    }

    // TODO: Queue a mutation observer microtask.
    // See: https://dom.spec.whatwg.org/#queue-a-mutation-observer-compound-microtask
  }

  /** @inheritdoc */
  queueTreeMutationRecord(target: NodeInternal,
    addedNodes: NodeInternal[], removedNodes: NodeInternal[],
    previousSibling: NodeInternal | null, nextSibling: NodeInternal | null): void {

    this.queueMutationRecord("childList", target, null, null, null,
      addedNodes, removedNodes, previousSibling, nextSibling)
  }

  /** @inheritdoc */
  queueAttributeMutationRecord(target: NodeInternal, name: string | null,
    namespace: string | null, oldValue: string | null): void {

    this.queueMutationRecord("attributes", target, name, namespace,
      oldValue, [], [], null, null)
  }

  /** @inheritdoc */
  appendAnAttribute(attribute: AttrInternal, element: ElementInternal): void {
    /**
     * TODO: 
     * 1. Queue an attribute mutation record for element with attribute’s
     * local name, attribute’s namespace, and null.
     * TODO:
     * 2. If element is custom, then enqueue a custom element callback reaction
     * with element, callback name "attributeChangedCallback", and an argument
     * list containing attribute’s local name, null, attribute’s value, and
     * attribute’s namespace.
     * TODO:
     * 3. Run the attribute change steps with element, attribute’s local name,
     * null, attribute’s value, and attribute’s namespace.
     * 4. Append attribute to element’s attribute list.
     * 5. Set attribute’s element to element.
     */
    element._attributeList.setNamedItem(attribute)
    attribute._element = element
  }

  /** @inheritdoc */
  createDOMImplementation(): DOMImplementationInternal {
    return new DOMImplementationImpl()
  }

  /** @inheritdoc */
  createDocument(): DocumentInternal {
    return new DocumentImpl()
  }

  /** @inheritdoc */
  createDocumentType(): DocumentTypeInternal {
    return DocumentTypeImpl._create()
  }

  /** @inheritdoc */
  createElement(localName: string, namespace: string | null = null,
    prefix: string | null = null): ElementInternal {
    return ElementImpl._create(localName, namespace, prefix)
  }

  /** @inheritdoc */
  createDocumentFragment(): DocumentFragmentInternal {
    return new DocumentFragmentImpl()
  }

  /** @inheritdoc */
  createAttrNode(): AttrInternal {
    return AttrImpl._create()
  }

  /** @inheritdoc */
  createTextNode(data: string = ''): TextInternal {
    return new TextImpl(data)
  }

  /** @inheritdoc */
  createCommentNode(data?: string): CommentInternal {
    return new CommentImpl(data)
  }

  /** @inheritdoc */
  createCDATASection(data: string = ''): CDATASectionInternal {
    return CDATASectionImpl._create(data)
  }

  /** @inheritdoc */
  createComment(data: string = ''): CommentInternal {
    return new CommentImpl(data)
  }

  /** @inheritdoc */
  createProcessingInstruction(target: string, data: string = ''):
    ProcessingInstructionInternal {
    return ProcessingInstructionImpl._create(target, data)
  }

  /** @inheritdoc */
  createHTMLCollection(root: NodeInternal,
    filter: ((element: ElementInternal) => any) = (() => true)): HTMLCollectionInternal {
    return HTMLCollectionImpl._create(root, filter)
  }

  /** @inheritdoc */
  createNodeList(root: NodeInternal): NodeListInternal {
    return NodeListImpl._create(root)
  }

  /** @inheritdoc */
  createNodeListStatic(root: NodeInternal, items: NodeInternal[]): NodeListInternal {
    return NodeListStaticImpl._create(root, items)
  }

  /** @inheritdoc */
  createNamedNodeMap(element: ElementInternal): NamedNodeMapInternal {
    return NamedNodeMapImpl._create(element)
  }

  /** @inheritdoc */
  createRange(): RangeInternal {
    return RangeImpl._create()
  }

  /** @inheritdoc */
  createNodeIterator(root: NodeInternal, reference: NodeInternal,
    pointerBeforeReference: boolean): NodeIteratorInternal {

    return NodeIteratorImpl._create(root, reference, pointerBeforeReference)
  }

  /** @inheritdoc */
  createTreeWalker(root: NodeInternal, current: NodeInternal): TreeWalkerInternal {
    return TreeWalkerImpl._create(root, current)
  }

  /** @inheritdoc */
  createNodeFilter(): NodeFilterInternal {
    return NodeFilterImpl._create()
  }

  /** @inheritdoc */
  *getDescendantNodes(node: NodeInternal, self: boolean = false,
    shadow: boolean = false, filter:
      ((childNode: NodeInternal) => any) = () => true):
    IterableIterator<NodeInternal> {

    if (self && filter(node))
      yield node

    // traverse shadow tree
    if (shadow && Guard.isElementNode(node)) {
      if (node.shadowRoot) {
        let child = node.shadowRoot.firstChild as NodeInternal | null
        while (child) {
          yield* this.getDescendantNodes(child, true, shadow, filter)
          child = child.nextSibling as NodeInternal | null
        }
      }
    }

    // traverse child nodes
    let child = node.firstChild as NodeInternal | null
    while (child) {
      yield* this.getDescendantNodes(child, true, shadow, filter)
      child = child.nextSibling as NodeInternal | null
    }
  }

  /** @inheritdoc */
  *getDescendantElements(node: NodeInternal, self: boolean = false,
    shadow: boolean = false, filter:
      ((childNode: ElementInternal) => any) = (() => true)):
    IterableIterator<ElementInternal> {

    for (const child of this.getDescendantNodes(node, self, shadow,
      (node) => { return Guard.isElementNode(node) })) {
      const ele = child as ElementInternal
      if (filter(ele))
        yield ele
    }
  }

  /** @inheritdoc */
  *getSiblingNodes(node: NodeInternal, self: boolean = false,
    filter: ((childNode: NodeInternal) => any) = (() => true)):
    IterableIterator<NodeInternal> {

    if (node.parentNode) {
      let child = node.parentNode.firstChild as NodeInternal | null
      while (child) {
        if (!filter || !!filter(child)) {
          if (child === node) {
            if (self) yield child
          } else {
            yield child
          }
        }
        child = child.nextSibling as NodeInternal | null
      }
    }
  }

  /** @inheritdoc */
  *getAncestorNodes(node: NodeInternal, self: boolean = false,
    filter: ((ancestorNode: NodeInternal) => any) = (() => true)):
    IterableIterator<NodeInternal> {

    if (self && filter(node))
      yield node

    let parent = node.parentNode
    while (parent !== null) {
      if (filter(node))
        yield node
      parent = parent.parentNode
    }
  }

  /** @inheritdoc */
  getFollowingNode(root: NodeInternal, node: NodeInternal): NodeInternal | null {
    if (node.firstChild) {
      return node.firstChild as NodeInternal
    } else if (node.nextSibling) {
      return node.nextSibling as NodeInternal
    } else {
      while (true) {
        const parent = node.parentNode as NodeInternal | null
        if (parent === null || parent === root) {
          return null
        } else if (parent.nextSibling) {
          return parent.nextSibling as NodeInternal
        } else {
          node = parent
        }
      }
    }
  }

  /** @inheritdoc */
  getPrecedingNode(root: NodeInternal, node: NodeInternal): NodeInternal | null {
    if (node === root) {
      return null
    }
    if (node.previousSibling) {
      node = node.previousSibling as NodeInternal
      if (node.lastChild) {
        return node.lastChild as NodeInternal
      } else {
        return node
      }
    } else {
      return node.parentNode as NodeInternal | null
    }
  }

  /**
   * Determines if the node tree is constrained. A node tree is 
   * constrained as follows, expressed as a relationship between the 
   * type of node and its allowed children:
   *  - Document (In tree order)
   *    * Zero or more nodes each of which is ProcessingInstruction 
   *      or Comment.
   *    * Optionally one DocumentType node.
   *    * Zero or more nodes each of which is ProcessingInstruction
   *      or Comment.
   *    * Optionally one Element node.
   *    * Zero or more nodes each of which is ProcessingInstruction
   *      or Comment.
   *  - DocumentFragment, Element
   *    * Zero or more nodes each of which is Element, Text, 
   *      ProcessingInstruction, or Comment.
   *  - DocumentType, Text, ProcessingInstruction, Comment
   *    * None.
   * 
   * @param node - the root of the tree
   */
  isConstrained(node: NodeInternal): boolean {
    switch (node.nodeType) {
      case NodeType.Document:
        let hasDocType = false
        let hasElement = false
        for (const childNode of node.childNodes) {
          switch (childNode.nodeType) {
            case NodeType.ProcessingInstruction:
            case NodeType.Comment:
              break
            case NodeType.DocumentType:
              if (hasDocType || hasElement) return false
              hasDocType = true
              break
            case NodeType.Element:
              if (hasElement) return false
              hasElement = true
              break
            default:
              return false
          }
        }
        break
      case NodeType.DocumentFragment:
      case NodeType.Element:
        for (const childNode of node.childNodes) {
          switch (childNode.nodeType) {
            case NodeType.Element:
            case NodeType.Text:
            case NodeType.ProcessingInstruction:
            case NodeType.CData:
            case NodeType.Comment:
              break
            default:
              return false
          }
        }
        break
      case NodeType.DocumentType:
      case NodeType.Text:
      case NodeType.ProcessingInstruction:
      case NodeType.CData:
      case NodeType.Comment:
        return (!node.hasChildNodes())
    }

    for (const childNode of node.childNodes) {
      // recursively check child nodes
      if (!this.isConstrained(childNode as NodeInternal))
        return false
    }
    return true
  }

  /** @inheritdoc */
  nodeLength(node: NodeInternal): number {
    if (Guard.isDocumentTypeNode(node)) {
      return 0
    } else if (Guard.isCharacterDataNode(node)) {
      return node._data.length
    } else {
      return node.childNodes.length
    }
  }

  /** @inheritdoc */
  isEmpty(node: NodeInternal): boolean {
    return (this.nodeLength(node) === 0)
  }

  /** @inheritdoc */
  rootNode(node: NodeInternal, shadow = false): NodeInternal {
    if (shadow) {
      const root = this.rootNode(node, false)
      if (Guard.isShadowRoot(root))
        return this.rootNode(root._host as ElementInternal, true)
      else
        return root
    } else {
      if (!node.parentNode)
        return node
      else
        return this.rootNode(node.parentNode as NodeInternal)
    }
  }

  /** @inheritdoc */
  isDescendantOf(node: NodeInternal, other: NodeInternal,
    self: boolean = false, shadow: boolean = false): boolean {

    for (const child of this.getDescendantNodes(node, self, shadow)) {
      if (child === other)
        return true
    }

    return false
  }

  /** @inheritdoc */
  isAncestorOf(node: NodeInternal, other: NodeInternal,
    self: boolean = false, shadow: boolean = false): boolean {

    return this.isDescendantOf(other, node, self, shadow)
  }

  /** @inheritdoc */
  isSiblingOf(node: NodeInternal, other: NodeInternal,
    self: boolean = false): boolean {

    if (node === other) {
      if (self) return true
    } else {
      return (node.parentNode !== null &&
        node.parentNode === other.parentNode)
    }

    return false
  }

  /** @inheritdoc */
  isPreceding(node: NodeInternal, other: NodeInternal): boolean {
    const nodePos = this.treePosition(node)
    const otherPos = this.treePosition(other)

    if (nodePos === -1 || otherPos === -1)
      return false
    else if (this.rootNode(node) !== this.rootNode(other))
      return false
    else
      return otherPos < nodePos
  }

  /** @inheritdoc */
  isFollowing(node: NodeInternal, other: NodeInternal): boolean {
    const nodePos = this.treePosition(node)
    const otherPos = this.treePosition(other)

    if (nodePos === -1 || otherPos === -1)
      return false
    else if (this.rootNode(node) !== this.rootNode(other))
      return false
    else
      return otherPos > nodePos
  }

  /** @inheritdoc */
  isChildOf(node: NodeInternal, other: NodeInternal): boolean {
    if (node.parentNode === null || other.parentNode === null) {
      return false
    }

    if (node.parentNode !== other.parentNode) {
      return false
    }

    for (const child of node.childNodes) {
      if (child === other)
        return true
    }

    return false
  }

  /** @inheritdoc */
  firstChild(node: NodeInternal): NodeInternal | null {
    return node.firstChild as NodeInternal | null
  }

  /** @inheritdoc */
  lastChild(node: NodeInternal): NodeInternal | null {
    return node.lastChild as NodeInternal | null
  }

  /** @inheritdoc */
  treePosition(node: NodeInternal): number {
    const root = this.rootNode(node)

    let pos = 0
    for (const childNode of this.getDescendantNodes(root)) {
      pos++
      if (childNode === node) return pos
    }

    return -1
  }

  /** @inheritdoc */
  index(node: NodeInternal): number {
    let n = 0

    while (node.previousSibling !== null) {
      n++
      node = node.previousSibling as NodeInternal
    }

    return n
  }

  /** @inheritdoc */
  retarget(a: any, b: any): any {
    /**
     * To retarget an object A against an object B, repeat these steps until
     * they return an object:
     * 1. If one of the following is true
     * - A is not a node
     * - A's root is not a shadow root
     * - B is a node and A's root is a shadow-including inclusive ancestor
     * of B
     * then return A.
     * 2. Set A to A's root's host.
     */

    while (true) {
      if (!Guard.isNode(a)) {
        return a
      }

      const rootOfA = this.rootNode(a)
      if (!Guard.isShadowRoot(rootOfA)) {
        return a
      }

      if (Guard.isNode(b) && this.isAncestorOf(rootOfA, b, true, true)) {
        return a
      }

      a = rootOfA.host
    }
  }

}
