import { AbortSignal } from "../dom/interfaces"
import { event_fireAnEvent } from "./EventAlgorithm"

/**
 * Adds an algorithm to the given abort signal.
 * 
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
export function abort_add(algorithm: ((...args: any[]) => any), signal: AbortSignal): void {
  /**
   * 1. If signal’s aborted flag is set, then return.
   * 2. Append algorithm to signal’s abort algorithms.
   */
  if (signal._abortedFlag) return
  signal._abortAlgorithms.add(algorithm)
}

/**
 * Removes an algorithm from the given abort signal.
 * 
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
export function abort_remove(algorithm: ((...args: any[]) => any), signal: AbortSignal): void {
  /**
   * To remove an algorithm algorithm from an AbortSignal signal, remove 
   * algorithm from signal’s abort algorithms.
   */
  signal._abortAlgorithms.delete(algorithm)
}

/**
 * Signals abort on the given abort signal.
 * 
 * @param signal - abort signal
 */
export function abort_signalAbort(signal: AbortSignal): void {
  /**
   * 1. If signal’s aborted flag is set, then return.
   * 2. Set signal’s aborted flag.
   * 3. For each algorithm in signal’s abort algorithms: run algorithm.
   * 4. Empty signal’s abort algorithms.
   * 5. Fire an event named abort at signal.
   */
  if (signal._abortedFlag) return
  signal._abortedFlag = true
  signal._abortAlgorithms.forEach(algorithm => algorithm.call(signal))
  signal._abortAlgorithms.clear()
  event_fireAnEvent("abort", signal)
}
