import { Node, NodeList } from "./interfaces"
import { MutationRecordInternal, } from "./interfacesInternal"

/**
 * Represents a mutation record.
 */
export class MutationRecordImpl implements MutationRecordInternal {

  private _type: "attributes" | "characterData" | "childList"
  private _target: Node
  private _addedNodes: NodeList
  private _removedNodes: NodeList
  private _previousSibling: Node | null
  private _nextSibling: Node | null
  private _attributeName: string | null
  private _attributeNamespace: string | null
  private _oldValue: string | null

  /**
   * Initializes a new instance of `MutationRecord`.
   * 
   * @param type - type of mutation: `"attributes"` for an attribute
   * mutation, `"characterData"` for a mutation to a CharacterData node
   * and `"childList"` for a mutation to the tree of nodes.
   * @param target - node affected by the mutation.
   * @param addedNodes - list of added nodes.
   * @param removedNodes - list of removed nodes.
   * @param previousSibling - previous sibling of added or removed nodes.
   * @param nextSibling - next sibling of added or removed nodes.
   * @param attributeName - local name of the changed attribute, 
   * and `null` otherwise.
   * @param attributeNamespace - namespace of the changed attribute,
   * and `null` otherwise.
   * @param oldValue - value before mutation: attribute value for an attribute
   * mutation, node `data` for a mutation to a CharacterData node and `null`
   * for a mutation to the tree of nodes.
   */
  private constructor(type: "attributes" | "characterData" | "childList",
    target: Node, addedNodes: NodeList,
    removedNodes: NodeList, previousSibling: Node | null,
    nextSibling: Node | null, attributeName: string | null,
    attributeNamespace: string | null, oldValue: string | null) {

    this._type = type
    this._target = target
    this._addedNodes = addedNodes
    this._removedNodes = removedNodes
    this._previousSibling = previousSibling
    this._nextSibling = nextSibling
    this._attributeName = attributeName
    this._attributeNamespace = attributeNamespace
    this._oldValue = oldValue
  }

  /** @inheritdoc */
  get type(): "attributes" | "characterData" | "childList" { return this._type }

  /** @inheritdoc */
  get target(): Node { return this._target }

  /** @inheritdoc */
  get addedNodes(): NodeList { return this._addedNodes }

  /** @inheritdoc */
  get removedNodes(): NodeList { return this._removedNodes }

  /** @inheritdoc */
  get previousSibling(): Node | null { return this._previousSibling }

  /** @inheritdoc */
  get nextSibling(): Node | null { return this._nextSibling }

  /** @inheritdoc */
  get attributeName(): string | null { return this._attributeName }

  /** @inheritdoc */
  get attributeNamespace(): string | null { return this._attributeNamespace }

  /** @inheritdoc */
  get oldValue(): string | null { return this._oldValue }

  /**
   * Creates a new `MutationRecord`.
   * 
   * @param type - type of mutation: `"attributes"` for an attribute
   * mutation, `"characterData"` for a mutation to a CharacterData node
   * and `"childList"` for a mutation to the tree of nodes.
   * @param target - node affected by the mutation.
   * @param addedNodes - list of added nodes.
   * @param removedNodes - list of removed nodes.
   * @param previousSibling - previous sibling of added or removed nodes.
   * @param nextSibling - next sibling of added or removed nodes.
   * @param attributeName - local name of the changed attribute, 
   * and `null` otherwise.
   * @param attributeNamespace - namespace of the changed attribute,
   * and `null` otherwise.
   * @param oldValue - value before mutation: attribute value for an attribute
   * mutation, node `data` for a mutation to a CharacterData node and `null`
   * for a mutation to the tree of nodes.
   */
  static _create(type: "attributes" | "characterData" | "childList",
    target: Node, addedNodes: NodeList,
    removedNodes: NodeList, previousSibling: Node | null,
    nextSibling: Node | null, attributeName: string | null,
    attributeNamespace: string | null, oldValue: string | null) {

    return new MutationRecordImpl(type, target, addedNodes, removedNodes,
      previousSibling, nextSibling, attributeName, attributeNamespace,
      oldValue)
  }
}