import { Node } from '../dom/interfaces'
import { Guard } from './Guard'

/**
 * Contains type casts for DOM objects.
 */
export class Cast {

  /**
   * Casts the given object to a `Node`.
   * 
   * @param a - the object to cast
   */
  static asNode(a: any): Node {
    if (Guard.isNode(a)) {
      return a
    } else {
      throw new Error("Invalid object. Node expected.")
    }
  }
}