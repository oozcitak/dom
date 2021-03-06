import { Element, Node, CharacterData } from "./interfaces"
import { NodeImpl } from "./NodeImpl"
import {
  characterData_replaceData, characterData_substringData
} from "../algorithm"

/**
 * Represents a generic text node.
 */
export abstract class CharacterDataImpl extends NodeImpl implements CharacterData {

  _data: string

  /**
   * Initializes a new instance of `CharacterData`.
   *
   * @param data - the text content
   */
  protected constructor(data: string) {
    super()

    this._data = data
  }

  /** @inheritdoc */
  get data(): string { return this._data }
  set data(value: string) {
    characterData_replaceData(this, 0, this._data.length, value)
  }

  /** @inheritdoc */
  get length(): number { return this._data.length }

  /** @inheritdoc */
  substringData(offset: number, count: number): string {
    /**
     * The substringData(offset, count) method, when invoked, must return the 
     * result of running substring data with node context object, offset offset, and count count.
     */
    return characterData_substringData(this, offset, count)
  }

  /** @inheritdoc */
  appendData(data: string): void {
    /**
     * The appendData(data) method, when invoked, must replace data with node 
     * context object, offset context object’s length, count 0, and data data.
     */
    return characterData_replaceData(this, this._data.length, 0, data)
  }

  /** @inheritdoc */
  insertData(offset: number, data: string): void {
    /**
     * The insertData(offset, data) method, when invoked, must replace data with 
     * node context object, offset offset, count 0, and data data.
     */
    characterData_replaceData(this, offset, 0, data)
  }

  /** @inheritdoc */
  deleteData(offset: number, count: number): void {
    /**
     * The deleteData(offset, count) method, when invoked, must replace data 
     * with node context object, offset offset, count count, and data the 
     * empty string.
     */
    characterData_replaceData(this, offset, count, '')
  }

  /** @inheritdoc */
  replaceData(offset: number, count: number, data: string): void {
    /**
     * The replaceData(offset, count, data) method, when invoked, must replace 
     * data with node context object, offset offset, count count, and data data.
     */
    characterData_replaceData(this, offset, count, data)
  }


  // MIXIN: NonDocumentTypeChildNode
  /* istanbul ignore next */
  get previousElementSibling(): Element | null { throw new Error("Mixin: NonDocumentTypeChildNode not implemented.") }
  /* istanbul ignore next */
  get nextElementSibling(): Element | null { throw new Error("Mixin: NonDocumentTypeChildNode not implemented.") }

  // MIXIN: ChildNode
  /* istanbul ignore next */
  before(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  after(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  replaceWith(...nodes: (Node | string)[]): void { throw new Error("Mixin: ChildNode not implemented.") }
  /* istanbul ignore next */
  remove(): void { throw new Error("Mixin: ChildNode not implemented.") }

}