import { dom } from "../dom"
import { Element, Document, Node } from "../dom/interfaces"
import { Guard } from "../util"
import { isString } from "@oozcitak/util"
import { ElementImpl } from "../dom/ElementImpl"
import { customElement_enqueueACustomElementCallbackReaction } from "./CustomElementAlgorithm"
import { tree_getFirstDescendantNode, tree_getNextDescendantNode } from "./TreeAlgorithm"
import { namespace_validateAndExtract } from "./NamespaceAlgorithm"
import { dom_runAdoptingSteps } from "./DOMAlgorithm"
import { element_createAnElement } from "./ElementAlgorithm"
import { mutation_remove } from "./MutationAlgorithm"

/**
 * Returns an element interface for the given name and namespace.
 * 
 * @param name - element name
 * @param namespace - namespace
 */
export function document_elementInterface(name: string, namespace: string | null):
  (new (...args: any[]) => Element) {
  return ElementImpl
}

/**
 * Creates a new element node.
 * See: https://dom.spec.whatwg.org/#internal-createelementns-steps
 * 
 * @param document - owner document
 * @param namespace - element namespace
 * @param qualifiedName - qualified name
 * @param options - element options
 */
export function document_internalCreateElementNS(document: Document, namespace: string | null,
  qualifiedName: string, options?: string | { is: string }): Element {
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
    namespace_validateAndExtract(namespace, qualifiedName)

  let is: string | null = null
  if (options !== undefined) {
    if (isString(options)) {
      is = options
    } else {
      is = options.is
    }
  }

  return element_createAnElement(document, localName, ns, prefix, is, true)
}

/**
 * Removes `node` and its subtree from its document and changes
 * its owner document to `document` so that it can be inserted
 * into `document`.
 * 
 * @param node - the node to move
 * @param document - document to receive the node and its subtree
 */
export function document_adopt(node: Node, document: Document): void {
  // Optimize for common case of inserting a fresh node
  if (node._nodeDocument === document && node._parent === null) {
    return
  }

  /**
   * 1. Let oldDocument be node’s node document.
   * 2. If node’s parent is not null, remove node from its parent.
   */
  const oldDocument = node._nodeDocument

  if (node._parent)
    mutation_remove(node, node._parent)

  /**
   * 3. If document is not oldDocument, then:
   */
  if (document !== oldDocument) {
    /**
     * 3.1. For each inclusiveDescendant in node’s shadow-including inclusive 
     * descendants:
     */
    let inclusiveDescendant = tree_getFirstDescendantNode(node, true, true)
    while (inclusiveDescendant !== null) {
      /**
       * 3.1.1. Set inclusiveDescendant’s node document to document.
       * 3.1.2. If inclusiveDescendant is an element, then set the node 
       * document of each attribute in inclusiveDescendant’s attribute list
       * to document.
       */
      inclusiveDescendant._nodeDocument = document as Document

      if (Guard.isElementNode(inclusiveDescendant)) {
        inclusiveDescendant._attributeList._asArray().forEach(attr =>
          attr._nodeDocument = document)
      }

      /**
       * 3.2. For each inclusiveDescendant in node's shadow-including 
       * inclusive descendants that is custom, enqueue a custom
       * element callback reaction with inclusiveDescendant, 
       * callback name "adoptedCallback", and an argument list 
       * containing oldDocument and document.
       */
      if (dom.features.customElements) {
        if (Guard.isElementNode(inclusiveDescendant) &&
          inclusiveDescendant._customElementState === "custom") {
          customElement_enqueueACustomElementCallbackReaction(
            inclusiveDescendant, "adoptedCallback", [oldDocument, document])
        }
      }

      /**
       * 3.3. For each inclusiveDescendant in node’s shadow-including 
       * inclusive descendants, in shadow-including tree order, run the 
       * adopting steps with inclusiveDescendant and oldDocument.
       */
      if (dom.features.steps) {
        dom_runAdoptingSteps(inclusiveDescendant, oldDocument)
      }

      inclusiveDescendant = tree_getNextDescendantNode(node, inclusiveDescendant, true, true)
    }
  }
}
