import { Node, ChildNode } from './interfaces'
import { globalStore, Cast } from '../util'
import { DOMAlgorithm } from '../algorithm/interfaces'

/**
 * Represents a mixin that extends child nodes that can have siblings
 * including doctypes. This mixin is implemented by {@link Element},
 * {@link CharacterData} and {@link DocumentType}.
 */
export class ChildNodeImpl implements ChildNode {

  /** @inheritdoc */
  before(...nodes: (Node | string)[]): void {
    /**
     * 1. Let parent be context object’s parent.
     * 2. If parent is null, then return.
     */
    const algo = globalStore.algorithm
    const context = Cast.asNode(this)
    const parent = context._parent
    if (parent === null) return

    /**
     * 3. Let viablePreviousSibling be context object’s first preceding
     * sibling not in nodes, and null otherwise.
     */
    let viablePreviousSibling = context._previousSibling
    let flag = true
    while (flag && viablePreviousSibling) {
      flag = false
      for (const child of nodes) {
        if (child === viablePreviousSibling) {
          viablePreviousSibling = viablePreviousSibling._previousSibling
          flag = true
          break
        }
      }
    }

    /**
     * 4. Let node be the result of converting nodes into a node, given nodes
     * and context object’s node document.
     */
    const node = algo.parentNode.convertNodesIntoANode(nodes,
      context._nodeDocument)

    /**
     * 5. If viablePreviousSibling is null, set it to parent’s first child,
     * and to viablePreviousSibling’s next sibling otherwise.
     */
    if (viablePreviousSibling === null)
      viablePreviousSibling = parent._firstChild
    else
      viablePreviousSibling = viablePreviousSibling._nextSibling

    /**
     * 6. Pre-insert node into parent before viablePreviousSibling.
     */
    algo.mutation.preInsert(node, parent, viablePreviousSibling)
  }

  /** @inheritdoc */
  after(...nodes: (Node | string)[]): void {

    /**
     * 1. Let parent be context object’s parent.
     * 2. If parent is null, then return.
     */
    const algo = globalStore.algorithm
    const context = Cast.asNode(this)
    const parent = context.parentNode
    if (!parent) return

    /**
     * 3. Let viableNextSibling be context object’s first following sibling not 
     * in nodes, and null otherwise.
     */
    let viableNextSibling = context._nextSibling
    let flag = true
    while (flag && viableNextSibling) {
      flag = false
      for (const child of nodes) {
        if (child === viableNextSibling) {
          viableNextSibling = viableNextSibling._nextSibling
          flag = true
          break
        }
      }
    }

    /**
     * 4. Let node be the result of converting nodes into a node, given nodes 
     * and context object’s node document.
     */
    const node = algo.parentNode.convertNodesIntoANode(nodes,
      context._nodeDocument)

    /**
     * 5. Pre-insert node into parent before viableNextSibling.
     */
    algo.mutation.preInsert(node, parent, viableNextSibling)
  }

  /** @inheritdoc */
  replaceWith(...nodes: (Node | string)[]): void {

    /**
     * 1. Let parent be context object’s parent.
     * 2. If parent is null, then return.
     */
    const algo = globalStore.algorithm
    const context = Cast.asNode(this)
    const parent = context._parent
    if (!parent) return

    /**
     * 3. Let viableNextSibling be context object’s first following sibling not 
     * in nodes, and null otherwise.
     */
    let viableNextSibling = context._nextSibling
    let flag = true
    while (flag && viableNextSibling) {
      flag = false
      for (const child of nodes) {
        if (child === viableNextSibling) {
          viableNextSibling = viableNextSibling._nextSibling
          flag = true
          break
        }
      }
    }

    /**
     * 4. Let node be the result of converting nodes into a node, given nodes 
     * and context object’s node document.
     */
    const node = algo.parentNode.convertNodesIntoANode(nodes,
      context._nodeDocument)

    /**
     * 5. If context object’s parent is parent, replace the context object with
     * node within parent.
     * _Note:_ Context object could have been inserted into node.
     * 6. Otherwise, pre-insert node into parent before viableNextSibling.
     */
    if (context._parent === parent)
      algo.mutation.replace(context, node, parent)
    else
      algo.mutation.preInsert(node, parent, viableNextSibling)
  }

  /** @inheritdoc */
  remove(): void {
    /**
     * 1. If context object’s parent is null, then return.
     * 2. Remove the context object from context object’s parent.
     */
    const algo = globalStore.algorithm
    const context = Cast.asNode(this)
    const parent = context._parent
    if (!parent) return

    algo.mutation.remove(context, parent)
  }

}
