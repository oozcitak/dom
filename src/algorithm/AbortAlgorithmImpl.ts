import { DOMAlgorithm, AbortAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { AbortSignal } from '../dom/interfaces'

/**
 * Contains abort algorithms.
 */
export class AbortAlgorithmImpl extends SubAlgorithmImpl implements AbortAlgorithm {

  /**
   * Initializes a new `AbortAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  add(algorithm: ((...args: any[]) => any), signal: AbortSignal): void {
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Append algorithm to signal’s abort algorithms.
     */
    if (signal._abortedFlag) return
    signal._abortAlgorithms.add(algorithm)
  }

  /** @inheritdoc */
  remove(algorithm: ((...args: any[]) => any), signal: AbortSignal): void {
    /**
     * To remove an algorithm algorithm from an AbortSignal signal, remove 
     * algorithm from signal’s abort algorithms.
     */
    signal._abortAlgorithms.delete(algorithm)
  }

  /** @inheritdoc */
  signalAbort(signal: AbortSignal): void {
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Set signal’s aborted flag.
     * 3. For each algorithm in signal’s abort algorithms: run algorithm.
     * 4. Empty signal’s abort algorithms.
     * 5. Fire an event named abort at signal.
     */
    if(signal._abortedFlag) return
    signal._abortedFlag = true
    for (const algorithm of signal._abortAlgorithms) {
      algorithm.call(this)
    }
    signal._abortAlgorithms.clear()
    this.dom.event.fireAnEvent("abort", signal)
  }

}
