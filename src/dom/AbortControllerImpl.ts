import { AbortSignal, AbortController } from "./interfaces"
import { create_abortSignal } from "../algorithm/CreateAlgorithm"
import { abort_signalAbort } from "../algorithm/AbortAlgorithm"

/**
 * Represents a controller that allows to abort DOM requests.
 */
export class AbortControllerImpl implements AbortController {

  _signal: AbortSignal

  /**
   * Initializes a new instance of `AbortController`.
   */
  constructor() {
    /**
     * 1. Let signal be a new AbortSignal object.
     * 2. Let controller be a new AbortController object whose signal is signal.
     * 3. Return controller.
     */
    this._signal = create_abortSignal()
  }

  /** @inheritdoc */
  get signal(): AbortSignal { return this._signal }

  /** @inheritdoc */
  abort(): void {
    abort_signalAbort(this._signal)
  }

}