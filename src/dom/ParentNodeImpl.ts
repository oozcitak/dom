import { Node, HTMLCollection, NodeList, Element } from './interfaces'
import { ParentNodeInternal, NodeInternal } from './interfacesInternal'
import { DOMAlgorithm } from './algorithm/interfaces'
import { Cast, Guard, globalStore } from '../util'

/**
 * Represents a mixin that extends parent nodes that can have children.
 * This mixin is implemented by {@link Element}, {@link Document} and
 * {@link DocumentFragment}.
 */
export class ParentNodeImpl implements ParentNodeInternal {

  /** @inheritdoc */
  get children(): HTMLCollection {
    /**
     * The children attribute’s getter must return an HTMLCollection collection 
     * rooted at context object matching only element children.
     */
    const algo = globalStore.algorithm as DOMAlgorithm
    return algo.create.htmlCollection(Cast.asNode(this))
  }

  /** @inheritdoc */
  get firstElementChild(): Element | null {
    /**
     * The firstElementChild attribute’s getter must return the first child 
     * that is an element, and null otherwise.
     */
    let node = Cast.asNode(this).firstChild

    while (node) {
      if (Guard.isElementNode(node))
        return node
      else
        node = node.nextSibling
    }
    return null
  }

  /** @inheritdoc */
  get lastElementChild(): Element | null {
    /**
     * The lastElementChild attribute’s getter must return the last child that
     * is an element, and null otherwise.
     */
    let node = Cast.asNode(this).lastChild

    while (node) {
      if (Guard.isElementNode(node))
        return node
      else
        node = node.previousSibling
    }
    return null
  }

  /** @inheritdoc */
  get childElementCount(): number {
    /**
     * The childElementCount attribute’s getter must return the number of 
     * children of context object that are elements.
     */
    let node = Cast.asNode(this).firstChild
    let count = 0

    while (node) {
      if (Guard.isElementNode(node))
        count++

      node = node.nextSibling
    }

    return count
  }

  /** @inheritdoc */
  prepend(...nodes: (Node | string)[]): void {
    /**
     * 1. Let node be the result of converting nodes into a node given nodes 
     * and context object’s node document.
     * 2. Pre-insert node into context object before the context object’s first 
     * child.
     */
    const algo = globalStore.algorithm as DOMAlgorithm
    const node = Cast.asNode(this)

    const childNode = algo.parentNode.convertNodesIntoANode(
      nodes as (NodeInternal | string)[], node._nodeDocument)
    algo.mutation.preInsert(childNode, node, node.firstChild as NodeInternal | null)
  }

  /** @inheritdoc */
  append(...nodes: (Node | string)[]): void {
    /**
     * 1. Let node be the result of converting nodes into a node given nodes 
     * and context object’s node document.
     * 2. Append node to context object.
     */
    const algo = globalStore.algorithm as DOMAlgorithm
    const node = Cast.asNode(this)

    const childNode = algo.parentNode.convertNodesIntoANode(
      nodes as (NodeInternal | string)[], node._nodeDocument)
    algo.mutation.append(childNode, node)
  }

  /** @inheritdoc */
  querySelector(selectors: string): Element | null {
    /**
     * The querySelector(selectors) method, when invoked, must return the first
     * result of running scope-match a selectors string selectors against
     * context object, if the result is not an empty list, and null otherwise.
     */
    const algo = globalStore.algorithm as DOMAlgorithm
    const node = Cast.asNode(this)

    const result = algo.selectors.scopeMatchASelectorsString(selectors, node)
    return (result.length === 0 ? null : result[0])
  }

  /** @inheritdoc */
  querySelectorAll(selectors: string): NodeList {
    /**
     * The querySelectorAll(selectors) method, when invoked, must return the 
     * static result of running scope-match a selectors string selectors against
     * context object.
     */
    const algo = globalStore.algorithm as DOMAlgorithm
    const node = Cast.asNode(this)

    const result = algo.selectors.scopeMatchASelectorsString(selectors, node)
    return algo.create.nodeListStatic(node, result)
  }

}
