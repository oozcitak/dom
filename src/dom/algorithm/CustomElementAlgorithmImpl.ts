import { CustomElementAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { ElementInternal } from '../interfacesInternal'

/**
 * Contains event algorithms.
 */
export class CustomElementAlgorithmImpl extends SubAlgorithmImpl implements CustomElementAlgorithm {

  /**
   * Initializes a new `CustomElementAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  enqueueACustomElementCallbackReaction(element: ElementInternal,
    callbackName: string, args: any[]): void {
    // TODO: Implement in HTML DOM
  }

}
