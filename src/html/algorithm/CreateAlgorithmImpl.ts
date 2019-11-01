import { CreateAlgorithmImpl as DOMCreateAlgorithmImpl } from '../../algorithm'
import { DOMAlgorithm } from '../../algorithm/interfaces'
import { DocumentImpl } from '../DocumentImpl'
import { DocumentInternal, WindowInternal } from '../interfacesInternal'
import { CreateAlgorithm } from './interfaces'
import { WindowImpl } from '../WindowImpl'

/**
 * Contains algorithms for creating DOM objects.
 */
export class CreateAlgorithmImpl extends DOMCreateAlgorithmImpl implements CreateAlgorithm {

  /**
   * Initializes a new `CreateAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  document(): DocumentInternal {
    return new DocumentImpl()
  }

  /** @inheritdoc */
  window(): WindowInternal {
    return WindowImpl._create()
  }

}
