import { Node, Document } from "../dom/interfaces"
import { isString } from "@oozcitak/util"
import { create_text, create_documentFragment } from "./CreateAlgorithm"

/**
 * Converts the given nodes or strings into a node (if `nodes` has
 * only one element) or a document fragment.
 * 
 * @param nodes - the array of nodes or strings,
 * @param document - owner document
 */
export function parentNode_convertNodesIntoANode(nodes: (Node | string)[],
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
      const text = create_text(document, item)
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
    node = create_documentFragment(document)
    const ns = node
    nodes.forEach(item => ns.appendChild(item as Node))
  }

  /**
   * 5. Return node.
   */
  return node
}
