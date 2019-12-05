import { DOMAlgorithm, NodeAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import {
  Attr, Element, Node, Document, HTMLCollection, DOMTokenList
} from '../dom/interfaces'
import { Guard } from '../util'
import { namespace as infraNamespace } from '@oozcitak/infra'

/**
 * Contains node algorithms.
 */
export class NodeAlgorithmImpl extends SubAlgorithmImpl implements NodeAlgorithm {

  /**
   * Initializes a new `NodeAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  stringReplaceAll(str: string, parent: Node): void {
    /**
     * 1. Let node be null.
     * 2. If string is not the empty string, then set node to a new Text node 
     * whose data is string and node document is parent’s node document.
     * 3. Replace all with node within parent.
     */
    let node: Node | null = null
    if (str !== '') {
      node = this.dom.create.text(parent._nodeDocument, str)
    }
    this.dom.mutation.replaceAll(node, parent)
  }

  /** @inheritdoc */
  clone(node: Node, document: Document | null = null,
    cloneChildrenFlag: boolean = false): Node {
    /**
     * 1. If document is not given, let document be node’s node document.
     */
    if (document === null)
      document = node._nodeDocument

    let copy: Node

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
      copy = this.dom.element.createAnElement(document, node._localName,
        node._namespace, node._namespacePrefix, node._is, false)
      for (const attribute of node._attributeList) {
        const copyAttribute = this.clone(attribute, document)
        this.dom.element.append(copyAttribute as Attr, copy as Element)
      }
    } else {
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
      if (Guard.isDocumentNode(node)) {
        const doc = this.dom.create.document()
        doc._encoding = node._encoding
        doc._contentType = node._contentType
        doc._URL = node._URL
        doc._origin = node._origin
        doc._type = node._type
        doc._mode = node._mode
        copy = doc
      } else if (Guard.isDocumentTypeNode(node)) {
        const doctype = this.dom.create.documentType(document, node._name,
          node._publicId, node._systemId)
        copy = doctype
      } else if (Guard.isAttrNode(node)) {
        const attr = this.dom.create.attr(document, node.localName)
        attr._namespace = node._namespace
        attr._namespacePrefix = node._namespacePrefix
        attr._value = node._value
        copy = attr
      } else if (Guard.isExclusiveTextNode(node)) {
        copy = this.dom.create.text(document, node._data)
      } else if (Guard.isCDATASectionNode(node)) {
        copy = this.dom.create.cdataSection(document, node._data)
      } else if (Guard.isCommentNode(node)) {
        copy = this.dom.create.comment(document, node._data)
      } else if (Guard.isProcessingInstructionNode(node)) {
        copy = this.dom.create.processingInstruction(document,
          node._target, node._data)
      } else if (Guard.isDocumentFragmentNode(node)) {
        copy = this.dom.create.documentFragment(document)
      } else {
        copy = Object.create(node)
      }
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
    this.dom.runCloningSteps(copy, node, document, cloneChildrenFlag)

    /**
     * 6. If the clone children flag is set, clone all the children of node and
     * append them to copy, with document as specified and the clone children
     * flag being set.
     */
    if (cloneChildrenFlag) {
      for (const child of node._children) {
        const childCopy = this.clone(child, document, true)
        this.dom.mutation.append(childCopy, copy)
      }
    }

    /**
     * 7. Return copy.
     */
    return copy
  }

  /** @inheritdoc */
  equals(a: Node, b: Node): boolean {
    /**
     * 1. A and B’s nodeType attribute value is identical.
     */
    if (a._nodeType !== b._nodeType) return false

    /**
     * 2. The following are also equal, depending on A:
     * - DocumentType
     * Its name, public ID, and system ID.
     * - Element
     * Its namespace, namespace prefix, local name, and its attribute list’s size.
     * - Attr
     * Its namespace, local name, and value.
     * - ProcessingInstruction
     * Its target and data.
     * - Text
     * - Comment
     * Its data.
     */
    if (Guard.isDocumentTypeNode(a) && Guard.isDocumentTypeNode(b)) {
      if (a._name !== b._name || a._publicId !== b._publicId ||
        a._systemId !== b._systemId) return false
    } else if (Guard.isElementNode(a) && Guard.isElementNode(b)) {
      if (a._namespace !== b._namespace || a._namespacePrefix !== b._namespacePrefix ||
        a._localName !== b._localName ||
        a._attributeList.length !== b._attributeList.length) return false
    } else if (Guard.isAttrNode(a) && Guard.isAttrNode(b)) {
      if (a._namespace !== b._namespace || a._localName !== b._localName ||
        a._value !== b._value) return false
    } else if (Guard.isProcessingInstructionNode(a) && Guard.isProcessingInstructionNode(b)) {
      if (a._target !== b._target || a._data !== b._data) return false
    } else if (Guard.isCharacterDataNode(a) && Guard.isCharacterDataNode(b)) {
      if (a._data !== b._data) return false
    }

    /**
     * 3. If A is an element, each attribute in its attribute list has an attribute
     * that equals an attribute in B’s attribute list.
     */
    if (Guard.isElementNode(a) && Guard.isElementNode(b)) {
      if (a._attributeList.length !== b._attributeList.length) return false
      const attrMap = new Map<string, Attr>()
      for (const attr of a._attributeList) {
        const attrA = attr as Attr
        attrMap.set((attrA._namespace || '') + attrA._localName + attrA._value, attrA)
      }
      for (const attr of b._attributeList) {
        const attrB = attr as Attr
        const attrA = attrMap.get((attrB._namespace || '') + attrB._localName + attrB._value)
        if (!attrA) return false
        if (!this.equals(attrA, attrB)) return false
      }
    }

    /**
     * 4. A and B have the same number of children.
     * 5. Each child of A equals the child of B at the identical index.
     */
    if (a._children.size !== b._children.size) return false
    const itA = a._children[Symbol.iterator]()
    const itB = b._children[Symbol.iterator]()
    let resultA = itA.next()
    let resultB = itB.next()
    while (!resultA.done && !resultB.done) {
      const child1 = resultA.value
      const child2 = resultB.value
      if (!this.equals(child1, child2)) return false
      resultA = itA.next()
      resultB = itB.next()
    }

    return true
  }

  /** @inheritdoc */
  listOfElementsWithQualifiedName(qualifiedName: string, root: Node):
    HTMLCollection {

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
      return this.dom.create.htmlCollection(root)
    } else if (root._nodeDocument._type === "html") {
      return this.dom.create.htmlCollection(root, function (ele) {
        if (ele._namespace === infraNamespace.HTML &&
          ele._qualifiedName === qualifiedName.toLowerCase()) {
          return true
        } else if (ele._namespace !== infraNamespace.HTML &&
          ele._qualifiedName === qualifiedName) {
          return true
        } else {
          return false
        }
      })
    } else {
      return this.dom.create.htmlCollection(root, function (ele) {
        return (ele._qualifiedName === qualifiedName)
      })
    }

  }

  /** @inheritdoc */
  listOfElementsWithNamespace(namespace: string | null, localName: string,
    root: Node): HTMLCollection {
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
      return this.dom.create.htmlCollection(root)
    } else if (namespace === "*") {
      return this.dom.create.htmlCollection(root, function (ele) {
        return (ele._localName === localName)
      })
    } else if (localName === "*") {
      return this.dom.create.htmlCollection(root, function (ele) {
        return (ele._namespace === namespace)
      })
    } else {
      return this.dom.create.htmlCollection(root, function (ele) {
        return (ele._localName === localName && ele._namespace === namespace)
      })
    }
  }

  /** @inheritdoc */
  listOfElementsWithClassNames(classNames: string, root: Node):
    HTMLCollection {

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

    const classes = this.dom.orderedSet.parse(classNames)
    if (classes.size === 0) {
      return this.dom.create.htmlCollection(root, () => false)
    }

    const caseSensitive = (root._nodeDocument._mode !== "quirks")
    const algo = this
    return this.dom.create.htmlCollection(root, function (ele) {
      const eleClasses = ele.classList as DOMTokenList
      return algo.dom.orderedSet.contains(eleClasses._tokenSet, classes,
        caseSensitive)
    })

  }

  /** @inheritdoc */
  locateANamespacePrefix(element: Element,
    namespace: string | null): string | null {
    /**
     * 1. If element’s namespace is namespace and its namespace prefix is not 
     * null, then return its namespace prefix.
     */
    if (element._namespace === namespace && element._namespacePrefix !== null) {
      return element._namespacePrefix
    }

    /**
     * 2. If element has an attribute whose namespace prefix is "xmlns" and
     * value is namespace, then return element’s first such attribute’s 
     * local name.
     */
    for (const attr of element._attributeList) {
      const attrInt = attr as Attr
      if (attrInt._namespacePrefix === "xmlns" && attrInt._value === namespace) {
        return attrInt._localName
      }
    }

    /**
     * 3. If element’s parent element is not null, then return the result of 
     * running locate a namespace prefix on that element using namespace.
     */
    if (element.parentElement) {
      return this.locateANamespacePrefix(element.parentElement as Element,
        namespace)
    }


    /**
     * 4. Return null.
     */
    return null
  }

  /** @inheritdoc */
  locateANamespace(node: Node, prefix: string | null): string | null {
    if (Guard.isElementNode(node)) {
      /**
       * 1. If its namespace is not null and its namespace prefix is prefix,
       * then return namespace.
       */
      if (node._namespace !== null && node._namespacePrefix === prefix) {
        return node._namespace
      }
      /**
       * 2. If it has an attribute whose namespace is the XMLNS namespace, 
       * namespace prefix is "xmlns", and local name is prefix, or if prefix 
       * is null and it has an attribute whose namespace is the XMLNS namespace,
       * namespace prefix is null, and local name is "xmlns", then return its
       * value if it is not the empty string, and null otherwise.
       */
      for (const attr of node._attributeList) {
        const attrInt = attr as Attr
        if (attrInt._namespace === infraNamespace.XMLNS &&
          attrInt._namespacePrefix === "xmlns" &&
          attrInt._localName === prefix) {
          return attrInt._value || null
        }
        if (prefix === null && attrInt._namespace === infraNamespace.XMLNS &&
          attrInt._namespacePrefix === null && attrInt._localName === "xmlns") {
          return attrInt._value || null
        }
      }

      /**
       * 3. If its parent element is null, then return null.
       */
      if (node.parentElement === null) return null

      /**
       * 4. Return the result of running locate a namespace on its parent
       * element using prefix.
       */
      return this.locateANamespace(node.parentElement as Element, prefix)
    } else if (Guard.isDocumentNode(node)) {
      /**
       * 1. If its document element is null, then return null.
       * 2. Return the result of running locate a namespace on its document 
       * element using prefix.
       */
      if (node.documentElement === null) return null
      return this.locateANamespace(node.documentElement as Element, prefix)
    } else if (Guard.isDocumentTypeNode(node) || Guard.isDocumentFragmentNode(node)) {
      return null
    } else if (Guard.isAttrNode(node)) {
      /**
       * 1. If its element is null, then return null.
       * 2. Return the result of running locate a namespace on its element
       * using prefix.
       */
      if (node._element === null) return null
      return this.locateANamespace(node._element as Element, prefix)
    } else {
      /**
       * 1. If its parent element is null, then return null.
       * 2. Return the result of running locate a namespace on its parent
       * element using prefix.
       */
      if (node.parentElement === null) return null
      return this.locateANamespace(node.parentElement as Element, prefix)
    }

  }

}
