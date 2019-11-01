import { DOMAlgorithm, DocumentAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import {
  AttrInternal, ElementInternal, DocumentInternal, NodeInternal
} from '../dom/interfacesInternal'
import { isString, Guard } from '../util'
import { ElementImpl } from '../dom'

/**
 * Contains document algorithms.
 */
export class DocumentAlgorithmImpl extends SubAlgorithmImpl implements DocumentAlgorithm {

  /**
   * Initializes a new `DocumentAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  elementInterface(name: string, namespace: string | null):
    (new (...args: any[]) => ElementInternal) {
    return ElementImpl
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
      this.dom.namespace.validateAndExtract(namespace, qualifiedName)

    let is: string | null = null
    if (options !== undefined) {
      if (isString(options)) {
        is = options
      } else {
        is = options.is
      }
    }

    return this.dom.element.createAnElement(document, localName, ns, prefix,
      is, true)
  }

  /** @inheritdoc */
  adopt(node: NodeInternal, document: DocumentInternal): void {
    /**
     * 1. Let oldDocument be node’s node document.
     * 2. If node’s parent is not null, remove node from its parent.
     */
    const oldDocument = node._nodeDocument

    if (node.parentNode)
      this.dom.mutation.remove(node, node.parentNode as NodeInternal)

    /**
     * 3. If document is not oldDocument, then:
     */
    if (document !== oldDocument) {
      /**
       * 3.1. For each inclusiveDescendant in node’s shadow-including inclusive 
       * descendants:
       */
      for (const inclusiveDescendant of this.dom.tree.getDescendantNodes(node,
        true, true)) {
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
         * 3.2. For each inclusiveDescendant in node's shadow-including 
         * inclusive descendants that is custom, enqueue a custom
         * element callback reaction with inclusiveDescendant, 
         * callback name "adoptedCallback", and an argument list 
         * containing oldDocument and document.
         */
        if (Guard.isElementNode(inclusiveDescendant) && 
          inclusiveDescendant._customElementState === "custom") {
          this.dom.customElement.enqueueACustomElementCallbackReaction(
            inclusiveDescendant, "adoptedCallback", [oldDocument, document])
        }

        /**
         * 3.3. For each inclusiveDescendant in node’s shadow-including 
         * inclusive descendants, in shadow-including tree order, run the 
         * adopting steps with inclusiveDescendant and oldDocument.
         */
        this.dom.runAdoptingSteps(inclusiveDescendant, oldDocument)
      }
    }
  }

}
