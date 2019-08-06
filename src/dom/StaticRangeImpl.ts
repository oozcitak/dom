import { AbstractRangeImpl } from './AbstractRangeImpl'
import { DOMException } from './DOMException'
import { StaticRangeInternal } from './interfacesInternal'
import { Node, BoundaryPoint } from './interfaces'

/**
 * Represents a static range.
 */
export class StaticRangeImpl extends AbstractRangeImpl implements StaticRangeInternal {
  
  _start: BoundaryPoint
  _end: BoundaryPoint

  /**
   * Initializes a new instance of `StaticRange`.
   */
  constructor() {
    super()
    throw DOMException.NotSupportedError
  }

}
