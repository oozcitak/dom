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
export class infra {

  /**
   * Contains algorithms for manipulating lists.
   */
  static list = ListAlgorithmImpl

  /**
   * Contains algorithms for manipulating stacks.
   */
  static stack = StackAlgorithmImpl

  /**
   * Contains algorithms for manipulating queues.
   */
  static queue = QueueAlgorithmImpl

  /**
   * Contains algorithms for manipulating sets.
   */
  static set = SetAlgorithmImpl

  /**
   * Contains algorithms for manipulating strings.
   */
  static string = StringAlgorithmImpl

  /**
   * Defines namespaces.
   */
  static namespace = NamespaceImpl

}