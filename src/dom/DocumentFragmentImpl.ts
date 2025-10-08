import {
  Node, Element, NodeType, HTMLCollection, NodeList, DocumentFragment, Document
} from "./interfaces"
import { NodeImpl } from "./NodeImpl"
import { idl_defineConst } from "../algorithm/WebIDLAlgorithm"

/**
 * Represents a document fragment in the XML tree.
 */
export class DocumentFragmentImpl extends NodeImpl implements DocumentFragment {

  _nodeType = NodeType.DocumentFragment
  _children: any = new Set<Node>()

  _host: Element | null

  /**
   * Initializes a new instance of `DocumentFragment`.
   *
   * @param host - shadow root's host element
   */
  public constructor(host: Element | null = null) {
    super()

    this._host = host
  }

  // MIXIN: NonElementParentNode
  /* istanbul ignore next */
  getElementById(elementId: string): Element | null { throw new Error("Mixin: NonElementParentNode not implemented.") }

  // MIXIN: ParentNode
  /* istanbul ignore next */
  get children(): HTMLCollection { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  get firstElementChild(): Element | null { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  get lastElementChild(): Element | null { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  get childElementCount(): number { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  prepend(...nodes: (Node | string)[]): void { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  append(...nodes: (Node | string)[]): void { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  querySelector(selectors: string): Element | null { throw new Error("Mixin: ParentNode not implemented.") }
  /* istanbul ignore next */
  querySelectorAll(selectors: string): NodeList { throw new Error("Mixin: ParentNode not implemented.") }

  /**
   * Creates a new `DocumentFragment`.
   *
   * @param document - owner document
   * @param host - shadow root's host element
   */
  static _create(document: Document, host: Element | null = null):
    DocumentFragmentImpl {
    const node = new DocumentFragmentImpl(host)
    node._nodeDocument = document
    return node
  }

}

/**
 * Initialize prototype properties
 */
idl_defineConst(DocumentFragmentImpl.prototype, "_nodeType", NodeType.DocumentFragment)
