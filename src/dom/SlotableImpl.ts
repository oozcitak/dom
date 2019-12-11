import { Slotable, Slot, HTMLSlotElement } from "./interfaces"
import { shadowTree_findASlot } from "../algorithm"

/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */
export class SlotableImpl implements Slotable {

  __name: string | undefined
  __assignedSlot: Slot | null | undefined

  get _name(): string { return this.__name || '' }
  set _name(val: string) { this.__name = val }

  get _assignedSlot(): Slot | null { return this.__assignedSlot || null }
  set _assignedSlot(val: Slot | null) { this.__assignedSlot = val }

  /** @inheritdoc */
  get assignedSlot(): HTMLSlotElement | null {
    return shadowTree_findASlot(this, true) as HTMLSlotElement | null
  }

}
