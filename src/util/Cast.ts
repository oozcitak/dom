import { NodeInternal } from '../dom/interfacesInternal'
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
  static asNode(a: any): NodeInternal {
    if (Guard.isNode(a)) {
      return a
    } else {
      throw new Error("Invalid object. Node expected.")
    }
  }
}