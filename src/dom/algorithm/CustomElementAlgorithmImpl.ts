import { CustomElementAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { ElementInternal, DocumentInternal } from '../interfacesInternal'
import { CustomElementDefinition } from '../interfaces'

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

  enqueueACustomElementUpgradeReaction(element: ElementInternal,
    definition: CustomElementDefinition): void {
    // TODO: Implement in HTML DOM
  }

  /** @inheritdoc */
  enqueueACustomElementCallbackReaction(element: ElementInternal,
    callbackName: string, args: any[]): void {
    // TODO: Implement in HTML DOM
  }

  /** @inheritdoc */
  upgrade(definition: CustomElementDefinition, element: ElementInternal): void {
    // TODO: Implement in HTML DOM
  }

  /** @inheritdoc */
  tryToUpgrade(element: ElementInternal): void {
    // TODO: Implement in HTML DOM
  }
  
  /** @inheritdoc */
  lookUpACustomElementDefinition(document: DocumentInternal, namespace: string,
    localName: string | null, is: string | null): CustomElementDefinition | null {
    // TODO: Implement in HTML DOM
    return null
  }
}
