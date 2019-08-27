import { ListAlgorithmImpl } from './ListAlgorithmImpl'

/**
 * Contains algorithms for manipulating stacks.
 * See: https://infra.spec.whatwg.org/#stacks
 */
export class StackAlgorithmImpl extends ListAlgorithmImpl {

  /**
   * Pushes the given item to the stack.
   * 
   * @param list - a list
   * @param item - an item
   */
  static push<T>(list: Array<T>, item: T): void {
    list.push(item)
  }

  /**
   * Pops and returns an item from the stack.
   * 
   * @param list - a list
   */
  static pop<T>(list: Array<T>): T | null {
    return list.pop() || null
  }

}
