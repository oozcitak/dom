import { Node, BoundaryPoint, AbstractRange } from "./interfaces"

/**
 * Represents an abstract range with a start and end boundary point.
 */
export abstract class AbstractRangeImpl implements AbstractRange {

  abstract _start: BoundaryPoint
  abstract _end: BoundaryPoint

  get _startNode(): Node { return this._start[0] }
  get _startOffset(): number { return this._start[1] }
  get _endNode(): Node { return this._end[0] }
  get _endOffset(): number { return this._end[1] }

  get _collapsed(): boolean {
    return (this._start[0] === this._end[0] &&
      this._start[1] === this._end[1])
  }

  /** @inheritdoc */
  get startContainer(): Node { return this._startNode }

  /** @inheritdoc */
  get startOffset(): number { return this._startOffset }

  /** @inheritdoc */
  get endContainer(): Node { return this._endNode }

  /** @inheritdoc */
  get endOffset(): number { return this._endOffset }

  /** @inheritdoc */
  get collapsed(): boolean { return this._collapsed }

}
