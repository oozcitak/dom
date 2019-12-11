import { dom } from "../"
import { CharacterData } from "../dom/interfaces"
import { Guard } from "../util"
import { IndexSizeError } from "../dom/DOMException"
import { tree_nodeLength } from "./TreeAlgorithm"
import { observer_queueMutationRecord } from "./MutationObserverAlgorithm"
import { dom_runChildTextContentChangeSteps } from "./DOMAlgorithm"

/**
 * Replaces character data.
 * 
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to replace
 * @param data - new data
 */
export function characterData_replaceData(node: CharacterData, offset: number, count: number,
  data: string): void {

  /**
   * 1. Let length be node’s length.
   * 2. If offset is greater than length, then throw an "IndexSizeError"
   * DOMException.
   * 3. If offset plus count is greater than length, then set count to length 
   * minus offset.
   */
  const length = tree_nodeLength(node)

  if (offset > length) {
    throw new IndexSizeError(`Offset exceeds character data length. Offset: ${offset}, Length: ${length}, Node is ${node.nodeName}.`)
  }

  if (offset + count > length) {
    count = length - offset
  }

  /**
   * 4. Queue a mutation record of "characterData" for node with null, null, 
   * node’s data, « », « », null, and null.
   */
  if (dom.features.mutationObservers) {
    observer_queueMutationRecord("characterData", node, null, null,
      node.data, [], [], null, null)
  }

  /**
   * 5. Insert data into node’s data after offset code units.
   * 6. Let delete offset be offset + data’s length.
   * 7. Starting from delete offset code units, remove count code units from 
   * node’s data.
   */
  const newData = node.data.substring(0, offset) + data +
    node.data.substring(offset + count)
  node._data = newData

  /**
   * 8. For each live range whose start node is node and start offset is 
   * greater than offset but less than or equal to offset plus count, set its 
   * start offset to offset.
   * 9. For each live range whose end node is node and end offset is greater 
   * than offset but less than or equal to offset plus count, set its end 
   * offset to offset.
   * 10. For each live range whose start node is node and start offset is 
   * greater than offset plus count, increase its start offset by data’s 
   * length and decrease it by count.
   * 11. For each live range whose end node is node and end offset is greater 
   * than offset plus count, increase its end offset by data’s length and 
   * decrease it by count.
   */
  for (const range of dom.rangeList) {
    if (range._start[0] === node && range._start[1] > offset && range._start[1] <= offset + count) {
      range._start[1] += offset
    }
    if (range._end[0] === node && range._end[1] > offset && range._end[1] <= offset + count) {
      range._end[1] += offset
    }
    if (range._start[0] === node && range._start[1] > offset + count) {
      range._start[1] += data.length - count
    }
    if (range._end[0] === node && range._end[1] > offset + count) {
      range._end[1] += data.length - count
    }
  }

  /**
   * 12. If node is a Text node and its parent is not null, run the child 
   * text content change steps for node’s parent.
   */
  if (dom.features.steps) {
    if (Guard.isTextNode(node) && node._parent !== null) {
      dom_runChildTextContentChangeSteps(node._parent)
    }
  }
}

/**
 * Returns `count` number of characters from `node`'s data starting at
 * the given `offset`.
 * 
 * @param node - a character data node
 * @param offset - start offset
 * @param count - count of characters to return
 */
export function characterData_substringData(node: CharacterData, offset: number, count: number): string {
  /**
   * 1. Let length be node’s length.
   * 2. If offset is greater than length, then throw an "IndexSizeError" 
   * DOMException.
   * 3. If offset plus count is greater than length, return a string whose 
   * value is the code units from the offsetth code unit to the end of node’s 
   * data, and then return.
   * 4. Return a string whose value is the code units from the offsetth code 
   * unit to the offset+countth code unit in node’s data.
   */
  const length = tree_nodeLength(node)

  if (offset > length) {
    throw new IndexSizeError(`Offset exceeds character data length. Offset: ${offset}, Length: ${length}, Node is ${node.nodeName}.`)
  }

  if (offset + count > length) {
    return node.data.substr(offset)
  } else {
    return node.data.substr(offset, count)
  }
}
