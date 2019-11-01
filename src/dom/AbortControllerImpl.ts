import { AbortSignal } from "./interfaces"
import {
  AbortControllerInternal, AbortSignalInternal
} from "./interfacesInternal"
import { globalStore } from "../util"
import { DOMAlgorithm } from "../algorithm/interfaces"

/**
 * Represents a controller that allows to abort DOM requests.
 */
export class AbortControllerImpl implements AbortControllerInternal {

  _algo: DOMAlgorithm
  _signal: AbortSignalInternal

  /**
   * Initializes a new instance of `AbortController`.
   */
  constructor() {
    /**
     * 1. Let signal be a new AbortSignal object.
     * 2. Let controller be a new AbortController object whose signal is signal.
     * 3. Return controller.
     */
    this._algo = globalStore.algorithm as DOMAlgorithm
    this._signal = this._algo.create.abortSignal()
  }

  /** @inheritdoc */
  get signal(): AbortSignal { return this._signal }

  /** @inheritdoc */
  abort(): void {
    this._algo.abort.signalAbort(this._signal)
  }

}