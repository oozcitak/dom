import { ListAlgorithmImpl } from './ListAlgorithmImpl'

/**
 * Contains algorithms for manipulating queues.
 * See: https://infra.spec.whatwg.org/#queues
 */
export class QueueAlgorithmImpl extends ListAlgorithmImpl {

  /**
   * Appends the given item to the queue.
   * 
   * @param list - a list
   * @param item - an item
   */
  static enqueue<T>(list: Array<T>, item: T): void {
    list.push(item)
  }

  /**
   * Removes and returns an item from the queue.
   * 
   * @param list - a list
   */
  static dequeue<T>(list: Array<T>): T | null {
    return list.shift() || null
  }

}
