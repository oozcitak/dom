import { 
  DOMAlgorithm, SubAlgorithm, CreateAlgorithm as DOMCreateAlgorithm
} from '../../algorithm/interfaces'
import { WindowInternal } from '../interfacesInternal'
import { Origin } from '../../dom/interfaces'

/**
 * Contains HTML manipulation algorithms as described in the 
 * [HTML Living Standard](https://html.spec.whatwg.org/).
 */
export interface HTMLAlgorithm extends DOMAlgorithm {

  /**
   * Contains tree manipulation algorithms.
   */
  readonly create: CreateAlgorithm

  /**
   * Contains algorithms for origins.
   */
  readonly origin: OriginAlgorithm
}

/**
 * Contains algorithms for creating DOM objects.
 */
export interface CreateAlgorithm extends DOMCreateAlgorithm {

  /** 
   * Creates a `Window` node.
   */
  window(): WindowInternal
  
}

/**
 * Contains algorithms for origins.
 */
export interface OriginAlgorithm extends SubAlgorithm {

  /** 
   * Returns the serialization of an origin in to a string.
   * 
   * @param origin - an origin
   */
  serializationOfAnOrigin(origin: Origin): string
  
}