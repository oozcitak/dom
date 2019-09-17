import { SlotableInternal, SlotInternal } from './interfacesInternal'
import { HTMLSlotElement } from '../htmldom/interfaces'
import { DOMAlgorithm } from './algorithm/interfaces'
import { globalStore } from '../util'

/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */
export class SlotableImpl implements SlotableInternal {

  __name: string | undefined
  __assignedSlot: SlotInternal | null | undefined

  get _name(): string { return this.__name || '' }
  set _name(val: string) { this.__name = val }

  get _assignedSlot(): SlotInternal | null { return this.__assignedSlot || null }
  set _assignedSlot(val: SlotInternal | null) { this.__assignedSlot = val }

  /** @inheritdoc */
  get assignedSlot(): HTMLSlotElement | null {
    const algo = globalStore.algorithm as DOMAlgorithm
    return algo.shadowTree.findASlot(this, true) as HTMLSlotElement | null
  }

}
