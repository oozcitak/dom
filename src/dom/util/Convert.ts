import { Node, Document, Element } from '../interfaces'
import { TextImpl } from '../TextImpl'
import { DocumentFragmentImpl } from '../DocumentFragmentImpl'
import { OrderedSet } from './OrderedSet'
import { isString } from '../../util'
import { DocumentInternal } from '../../htmldom/interfacesInternal'

/**
 * Includes conversion methods.
 */
export class Convert {

  /**
   * Converts the given nodes or strings into a node (if `nodes` has
   * only one element) or a document fragment.
   * 
   * @param nodes - the array of nodes or strings
   */
  static nodesIntoNode(nodes: (Node | string)[], document: Document): Node {
    if (nodes.length === 1 && isString(nodes[0])) {
      const node = new TextImpl(<string>nodes[0])
      node._nodeDocument = document as DocumentInternal
      return node
    } else {
      const fragment = new DocumentFragmentImpl()
      fragment._nodeDocument = document as DocumentInternal

      for (const child of nodes) {
        if (typeof child === 'string')
          fragment.appendChild(new TextImpl(child))
        else
          fragment.appendChild(child)
      }

      return fragment
    }
  }

  /**
   * Converts the space separated tokens of an attribute's value to
   * a set.
   * 
   * @param ownerElement - the element owning the attribute
   * @param localName - the name of the attribute
   * 
   * @returns a {@link Set} of tokens
   */
  static attValueToSet(ownerElement: Element, localName: string): Set<string> {
    const attValue = ownerElement.getAttribute(localName) || ''
    return OrderedSet.parse(attValue)
  }

  /**
   * Converts the given set to a space separated token list and sets it
   * as the value of an attribute.
   * 
   * @param ownerElement - the element owning the attribute
   * @param localName - the name of the attribute
   * 
   * @returns a {@link Set} of tokens
   */
  static setToAttValue(ownerElement: Element, localName: string, set: Set<string>) {
    if (!ownerElement.hasAttribute(localName) && set.size === 0)
      return

    const attValue = OrderedSet.serialize(set)
    ownerElement.setAttribute(localName, attValue)
  }
}