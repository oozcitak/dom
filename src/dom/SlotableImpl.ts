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

  _name: string = ''
  _assignedSlot: SlotInternal | null = null

  /** @inheritdoc */
  get assignedSlot(): HTMLSlotElement | null {
    const algo = globalStore.algorithm as DOMAlgorithm
    return algo.shadowTree.findASlot(this, true) as HTMLSlotElement | null
  }

}
