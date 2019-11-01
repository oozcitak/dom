import { ParentNodeAlgorithm, DOMAlgorithm } from './interfaces'
import { Node, Document } from '../dom/interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { isString } from '../util'

/**
 * Contains parent node algorithms.
 */
export class ParentNodeAlgorithmImpl extends SubAlgorithmImpl implements ParentNodeAlgorithm {

  /**
   * Initializes a new `ParentNodeAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  convertNodesIntoANode(nodes: (Node | string)[],
    document: Document): Node {

    /**
     * 1. Let node be null.
     * 2. Replace each string in nodes with a new Text node whose data is the 
     * string and node document is document.
     */
    let node: Node | null = null
    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i]
      if (isString(item)) {
        const text = this.dom.create.text(document, item)
        nodes[i] = text
      }
    }

    /**
     * 3. If nodes contains one node, set node to that node.
     * 4. Otherwise, set node to a new DocumentFragment whose node document is
     * document, and then append each node in nodes, if any, to it.
     */
    if (nodes.length === 1) {
      node = nodes[0] as Node
    } else {
      node = this.dom.create.documentFragment(document)
      for (const item of nodes) {
        node.appendChild(item as Node)
      }
    }

    /**
     * 5. Return node.
     */
    return node
  }

}
