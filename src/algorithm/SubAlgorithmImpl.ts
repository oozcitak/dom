import { DOMAlgorithm, SubAlgorithm } from './interfaces'

/**
 * Represents sub algorithms.
 */
export class SubAlgorithmImpl implements SubAlgorithm {

  private _dom: DOMAlgorithm

  /**
   * Initializes a new `SubAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  protected constructor(algorithm: DOMAlgorithm) {
    this._dom = algorithm
  }

  /** @inheritdoc */
  get dom(): DOMAlgorithm { return this._dom }

}
