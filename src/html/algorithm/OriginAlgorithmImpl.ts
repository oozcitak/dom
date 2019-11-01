import { DOMAlgorithm } from '../../algorithm/interfaces'
import { OriginAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from '../../algorithm'
import { Origin } from '../../dom/interfaces'
import { URLAlgorithm } from '@oozcitak/url'

/**
 * Contains algorithms for creating DOM objects.
 */
export class OriginAlgorithmImpl extends SubAlgorithmImpl implements OriginAlgorithm {

  /**
   * Initializes a new `OriginAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  serializationOfAnOrigin(origin: Origin): string {
    /**
     * 1. If origin is an opaque origin, then return "null".
     * 2. Otherwise, let result be origin's scheme.
     * 3. Append "://" to result.
     * 4. Append origin's host, serialized, to result.
     * 5. If origin's port is non-null, append a U+003A COLON character (:), 
     * and origin's port, serialized, to result.
     * 6. Return result.
     */
    if (origin === null) {
      return "null"
    } else {
      return origin[0] + // scheme
        '://' + new URLAlgorithm().hostSerializer(origin[1]) + // host
        (origin[2] === null ? '' : ':' + origin[2].toString()) // port
    }
  }
}
