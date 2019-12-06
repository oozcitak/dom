import { AbstractRangeImpl } from './AbstractRangeImpl'
import { InvalidNodeTypeError } from './DOMException'
import { BoundaryPoint, StaticRangeInit, StaticRange } from './interfaces'
import { Guard } from '../util'

/**
 * Represents a static range.
 */
export class StaticRangeImpl extends AbstractRangeImpl implements StaticRange {
  
  _start: BoundaryPoint
  _end: BoundaryPoint

  /**
   * Initializes a new instance of `StaticRange`.
   */
  constructor(init: StaticRangeInit ) {
    super()
    /**
     * 1. If init’s startContainer or endContainer is a DocumentType or Attr 
     * node, then throw an "InvalidNodeTypeError" DOMException.
     * 2. Let staticRange be a new StaticRange object.
     * 3. Set staticRange’s start to (init’s startContainer, init’s startOffset)
     * and end to (init’s endContainer, init’s endOffset).
     * 4. Return staticRange.
     */
    if (Guard.isDocumentTypeNode(init.startContainer) || Guard.isAttrNode(init.startContainer) ||
      Guard.isDocumentTypeNode(init.endContainer) || Guard.isAttrNode(init.endContainer)) {
      throw new InvalidNodeTypeError()
    }
    this._start = [init.startContainer, init.startOffset]
    this._end = [init.endContainer, init.endOffset]
  }

}
