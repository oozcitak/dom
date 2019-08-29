import { ListAlgorithmImpl } from './ListAlgorithmImpl'
import { StackAlgorithmImpl } from './StackAlgorithmImpl'
import { QueueAlgorithmImpl } from './QueueAlgorithmImpl'
import { SetAlgorithmImpl } from './SetAlgorithmImpl'
import { StringAlgorithmImpl } from './StringAlgorithmImpl'
import { NamespaceImpl } from './NamespaceImpl'

/**
 * Contains algorithms as defined by the
 * [Infra Standard](https://infra.spec.whatwg.org).
 */
export const infra = {

  /**
   * Contains algorithms for manipulating lists.
   */
  list: ListAlgorithmImpl,

  /**
   * Contains algorithms for manipulating stacks.
   */
  stack: StackAlgorithmImpl,

  /**
   * Contains algorithms for manipulating queues.
   */
  queue: QueueAlgorithmImpl,

  /**
   * Contains algorithms for manipulating sets.
   */
  set: SetAlgorithmImpl,

  /**
   * Contains algorithms for manipulating strings.
   */
  string: StringAlgorithmImpl,

  /**
   * Defines namespaces.
   */
  namespace: NamespaceImpl,

}