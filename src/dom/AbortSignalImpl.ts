import { Event } from "./interfaces"
import { AbortSignalInternal } from "./interfacesInternal"
import { EventTargetImpl } from './EventTargetImpl'

/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */
export class AbortSignalImpl extends EventTargetImpl implements AbortSignalInternal {

  _abortedFlag: boolean = false
  _abortAlgorithms: Set<(...args: any[]) => any> = new Set()

  /**
   * Initializes a new instance of `AbortSignal`.
   */
  private constructor() {
    super()
  }

  /** @inheritdoc */
  get aborted(): boolean { return this._abortedFlag }

  /** @inheritdoc */
  onabort(event: Event): any { }

  /**
   * Creates a new `AbortSignal`.
   */
  static _create(): AbortSignalInternal {
    return new AbortSignalImpl()
  }

}