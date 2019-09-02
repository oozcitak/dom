import {
  EventInit, EventTarget, EventPhase, PotentialEventTarget, EventPathItem
} from './interfaces'
import { EventInternal } from './interfacesInternal'
import { DOMAlgorithm } from './algorithm/interfaces'
import { globalStore } from '../util'

/**
 * Represents a DOM event.
 */
export class EventImpl implements EventInternal {

  static readonly NONE: number = 0
  static readonly CAPTURING_PHASE: number = 1
  static readonly AT_TARGET: number = 2
  static readonly BUBBLING_PHASE: number = 3

  _target: PotentialEventTarget = null
  _relatedTarget: PotentialEventTarget = null
  _touchTargetList: PotentialEventTarget[] = []
  _path: EventPathItem[] = []
  _currentTarget: PotentialEventTarget = null
  _eventPhase: EventPhase = EventPhase.None

  _stopPropagationFlag: boolean = false
  _stopImmediatePropagationFlag: boolean = false
  _canceledFlag: boolean = false
  _inPassiveListenerFlag: boolean = false
  _composedFlag: boolean = false
  _initializedFlag: boolean = false
  _dispatchFlag: boolean = false

  _isTrustedFlag: boolean = false

  _type: string
  _bubbles: boolean = false
  _cancelable: boolean = false
  _timeStamp: number

  protected _algo: DOMAlgorithm

  /**
   * Initializes a new instance of `Event`.
   */
  public constructor(type: string, eventInit?: EventInit) {

    this._algo = globalStore.algorithm as DOMAlgorithm

    /**
     * TODO:
     * When a constructor of the Event interface, or of an interface that
     * inherits from the Event interface, is invoked, these steps must be run, 
     * given the arguments type and eventInitDict:
     * 1. Let event be the result of running the inner event creation steps with
     * this interface, null, now, and eventInitDict.
     * 2. Initialize event’s type attribute to type.
     * 3. Return event.
     */
    this._type = type
    if (eventInit) {
      this._bubbles = eventInit.bubbles || false
      this._cancelable = eventInit.cancelable || false
      this._composedFlag = eventInit.composed || false
    }
    this._initializedFlag = true
    this._timeStamp = new Date().getTime()
  }

  /** @inheritdoc */
  get type(): string { return this._type }

  /** @inheritdoc */
  get target(): EventTarget | null { return this._target }

  /** @inheritdoc */
  get srcElement(): EventTarget | null { return this._target }

  /** @inheritdoc */
  get currentTarget(): EventTarget | null { return this._currentTarget }

  /** @inheritdoc */
  composedPath(): EventTarget[] {

    /**
     * 1. Let composedPath be an empty list.
     * 2. Let path be the context object’s path.
     * 3. If path is empty, then return composedPath.
     * 4. Let currentTarget be the context object’s currentTarget attribute
     * value.
     * 5. Append currentTarget to composedPath.
     * 6. Let currentTargetIndex be 0.
     * 7. Let currentTargetHiddenSubtreeLevel be 0.
     */
    const composedPath: EventTarget[] = []

    const path = this._path

    if (path.length === 0) return composedPath

    const currentTarget = this.currentTarget
    if (currentTarget === null) {
      throw new Error("Event currentTarget is null.")
    }
    composedPath.push(currentTarget)

    let currentTargetIndex = 0
    let currentTargetHiddenSubtreeLevel = 0

    /**
     * 8. Let index be path’s size − 1.
     * 9. While index is greater than or equal to 0:
     */
    let index = path.length - 1
    while (index >= 0) {
      /**
       * 9.1. If path[index]'s root-of-closed-tree is true, then increase 
       * currentTargetHiddenSubtreeLevel by 1.
       * 9.2. If path[index]'s invocation target is currentTarget, then set 
       * currentTargetIndex to index and break.
       * 9.3. If path[index]'s slot-in-closed-tree is true, then decrease
       * currentTargetHiddenSubtreeLevel by 1.
       * 9.4. Decrease index by 1.
       */
      if (path[index].rootOfClosedTree) {
        currentTargetHiddenSubtreeLevel++
      }
      if (path[index].invocationTarget === currentTarget) {
        currentTargetIndex = index
        break
      }
      if (path[index].slotInClosedTree) {
        currentTargetHiddenSubtreeLevel--
      }
      index--
    }

    /**
     * 10. Let currentHiddenLevel and maxHiddenLevel be
     * currentTargetHiddenSubtreeLevel.
     */
    let currentHiddenLevel = currentTargetHiddenSubtreeLevel
    let maxHiddenLevel = currentTargetHiddenSubtreeLevel

    /**
     * 11. Set index to currentTargetIndex − 1.
     * 12. While index is greater than or equal to 0:
     */
    index = currentTargetIndex - 1
    while (index >= 0) {
      /**
       * 12.1. If path[index]'s root-of-closed-tree is true, then increase 
       * currentHiddenLevel by 1.
       * 12.2. If currentHiddenLevel is less than or equal to maxHiddenLevel, 
       * then prepend path[index]'s invocation target to composedPath.
       */
      if (path[index].rootOfClosedTree) {
        currentHiddenLevel++
      }

      if (currentHiddenLevel <= maxHiddenLevel) {
        composedPath.unshift(path[index].invocationTarget)
      }

      /**
       * 12.3. If path[index]'s slot-in-closed-tree is true, then:
       */
      if (path[index].slotInClosedTree) {
        /**
         * 12.3.1. Decrease currentHiddenLevel by 1.
         * 12.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set
         * maxHiddenLevel to currentHiddenLevel.
         */
        currentHiddenLevel--
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel
        }
      }

      /**
       * 12.4. Decrease index by 1.
       */
      index--
    }

    /**
     * 13. Set currentHiddenLevel and maxHiddenLevel to
     * currentTargetHiddenSubtreeLevel.
     */
    currentHiddenLevel = currentTargetHiddenSubtreeLevel
    maxHiddenLevel = currentTargetHiddenSubtreeLevel

    /**
     * 14. Set index to currentTargetIndex + 1.
     * 15. While index is less than path’s size:
     */
    index = currentTargetIndex + 1
    while (index < path.length) {
      /**
       * 15.1. If path[index]'s slot-in-closed-tree is true, then increase 
       * currentHiddenLevel by 1.
       * 15.2. If currentHiddenLevel is less than or equal to maxHiddenLevel, 
       * then append path[index]'s invocation target to composedPath.
       */
      if (path[index].slotInClosedTree) {
        currentHiddenLevel++
      }

      if (currentHiddenLevel <= maxHiddenLevel) {
        composedPath.push(path[index].invocationTarget)
      }

      /**
       * 15.3. If path[index]'s root-of-closed-tree is true, then:
       */
      if (path[index].rootOfClosedTree) {
        /**
         * 15.3.1. Decrease currentHiddenLevel by 1.
         * 15.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set 
         * maxHiddenLevel to currentHiddenLevel.
         */
        currentHiddenLevel--
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel
        }
      }

      /**
       * 15.4. Increase index by 1.
       */
      index++
    }

    /**
     * 16. Return composedPath.
     */
    return composedPath
  }

  /** @inheritdoc */
  get eventPhase(): EventPhase { return this._eventPhase }

  /** @inheritdoc */
  stopPropagation(): void { this._stopPropagationFlag = true }

  /** @inheritdoc */
  get cancelBubble(): boolean { return this._stopPropagationFlag }
  set cancelBubble(value: boolean) { if (value) this.stopPropagation() }

  /** @inheritdoc */
  stopImmediatePropagation(): void {
    this._stopPropagationFlag = true
    this._stopImmediatePropagationFlag = true
  }

  /** @inheritdoc */
  get bubbles(): boolean { return this._bubbles }

  /** @inheritdoc */
  get cancelable(): boolean { return this._cancelable }

  /** @inheritdoc */
  get returnValue(): boolean { return !this._canceledFlag }
  set returnValue(value: boolean) {
    if (!value) {
      this._algo.event.setTheCanceledFlag(this)
    }
  }

  /** @inheritdoc */
  preventDefault(): void {
    this._algo.event.setTheCanceledFlag(this)
  }

  /** @inheritdoc */
  get defaultPrevented(): boolean { return this._canceledFlag }

  /** @inheritdoc */
  get composed(): boolean { return this._composedFlag }

  /** @inheritdoc */
  get isTrusted(): boolean { return this._isTrustedFlag }

  /** @inheritdoc */
  get timeStamp(): number { return this._timeStamp }

  /** @inheritdoc */
  initEvent(type: string, bubbles = false, cancelable = false): void {
    /**
     * 1. If the context object’s dispatch flag is set, then return.
     */
    if (this._dispatchFlag) return
    
    /**
     * 2. Initialize the context object with type, bubbles, and cancelable.
     */
    this._algo.event.initialize(this, type, bubbles, cancelable)
  }

}
