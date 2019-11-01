import { DOMAlgorithmImpl } from '../../algorithm'
import { 
  HTMLAlgorithm, CreateAlgorithm, OriginAlgorithm 
} from './interfaces'
import { CreateAlgorithmImpl } from './CreateAlgorithmImpl'
import { OriginAlgorithmImpl } from './OriginAlgorithmImpl'

/**
 * Contains HTML manipulation algorithms as described in the 
 * [HTML Living Standard](https://html.spec.whatwg.org/).
 */
export class HTMLAlgorithmImpl extends DOMAlgorithmImpl implements HTMLAlgorithm {

  protected _create: CreateAlgorithm
  protected _origin: OriginAlgorithm
  
  /**
   * Initializes a new instance of `HTMLAlgorithm`.
   */
  public constructor() {
    super()

    this._create = new CreateAlgorithmImpl(this)
    this._origin = new OriginAlgorithmImpl(this)
  }

  /** @inheritdoc */
  get create(): CreateAlgorithm { return this._create }

  /** @inheritdoc */
  get origin(): OriginAlgorithm { return this._origin }
    
}
