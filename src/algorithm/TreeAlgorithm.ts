import { Guard } from '../util'
import { NodeType, Element, Node } from '../dom/interfaces'

/**
 * Gets the next descendant of the given node of the tree rooted at `root`
 * in depth-first pre-order.
 * 
 * @param root - root node of the tree
 * @param node - a node
 * @param shadow - whether to visit shadow tree nodes
 */
function _getNextDescendantNode(root: Node, node: Node, shadow: boolean = false): Node | null {
	// traverse shadow tree
	if (shadow && Guard.isElementNode(node) && Guard.isShadowRoot(node.shadowRoot)) {
		if (node.shadowRoot._firstChild) return node.shadowRoot._firstChild
	}

	// traverse child nodes
	if(node._firstChild) return node._firstChild

	if (node === root) return null

	// traverse siblings
	if(node._nextSibling) return node._nextSibling

	// traverse parent's next sibling
	let parent = node._parent
	while (parent && parent !== root) {
		if (parent._nextSibling) return parent._nextSibling
		parent = parent._parent
	}

	return null
}

function _emptyIterator<T>(): Iterable<T> {
	return {
		[Symbol.iterator]: () => {
			return {
				next: () => {
					return { done: true, value: null }
				}
			}
		}
	}
}
/**
 * Traverses through all descendant nodes of the tree rooted at
 * `node` in depth-first pre-order.
 * 
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
export function tree_getDescendantNodes(node: Node, self: boolean = false,
	shadow: boolean = false, filter?: ((childNode: Node) => boolean)):
	Iterable<Node> {

	if (!self && node._children.size === 0) {
		return _emptyIterator<Node>()
	}

	return {
		[Symbol.iterator]: () => {

			let currentNode: Node | null = (self ? node : _getNextDescendantNode(node, node, shadow))
			
			return {
				next: () => {
					while (currentNode && filter && !filter(currentNode)) {
						currentNode = _getNextDescendantNode(node, currentNode, shadow)
					}

					if (currentNode === null) {
						return { done: true, value: null }
					} else {
						const result = { done: false, value: currentNode }
						currentNode = _getNextDescendantNode(node, currentNode, shadow)
						return result
					}
				}
			}
		}
	}
}

/**
 * Traverses through all descendant element nodes of the tree rooted at
 * `node` in depth-first preorder.
 * 
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param shadow - whether to visit shadow tree nodes
 * @param filter - a function to filter nodes
 */
export function tree_getDescendantElements(node: Node, self: boolean = false, 
	shadow: boolean = false, filter?:	((childNode: Element) => boolean)):
	Iterable<Element> {
	
  if (!self && node._children.size === 0) {
	  return _emptyIterator<Element>()
	}
	
	return {
		[Symbol.iterator]: () => {

			const it = tree_getDescendantNodes(node, self, shadow, (e: Node) => Guard.isElementNode(e))[Symbol.iterator]()
			let currentNode: Element | null = it.next().value
			
			return {
				next() {
					while (currentNode && filter && !filter(currentNode)) {
						currentNode = it.next().value
					}
					
					if (currentNode === null) {
						return { done: true, value: null }
					} else {
						const result = { done: false, value: currentNode }
						currentNode = it.next().value
						return result
					}
				}
			}
		}
	}
}

/**
 * Traverses through all sibling nodes of `node`.
 * 
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
export function tree_getSiblingNodes(node: Node, self: boolean = false,
	filter?: ((childNode: Node) => boolean)):
	Iterable<Node> {

	if (!node._parent || node._parent._children.size === 0) {
		return _emptyIterator<Node>()
	}

	return {
		[Symbol.iterator]() {

			let currentNode: Node | null = node._parent ? node._parent._firstChild : null
			
			return {
				next() {
					while (currentNode && (filter && !filter(currentNode) || (!self && currentNode === node))) {
						currentNode = currentNode._nextSibling
					}
					
					if (currentNode === null) {
						return { done: true, value: null }
					} else {
						const result = { done: false, value: currentNode }
						currentNode = currentNode._nextSibling
						return result
					}
				}
			}
		}
	}
}

/**
 * Traverses through all ancestor nodes `node` in reverse tree order.
 * 
 * @param node - root node of the tree
 * @param self - whether to include `node` in traversal
 * @param filter - a function to filter nodes
 */
export function tree_getAncestorNodes(node: Node, self: boolean = false,
	filter?: ((ancestorNode: Node) => boolean)):
	Iterable<Node> {

	if (!self && !node._parent) {
		return _emptyIterator<Node>()
	}

	return {
		[Symbol.iterator]() {

			let currentNode = self ? node : node._parent
			
			return {
				next() {
					while (currentNode && (filter && !filter(currentNode))) {
						currentNode = currentNode._parent
					}
					
					if (currentNode === null) {
						return { done: true, value: null }
					} else {
						const result = { done: false, value: currentNode }
						currentNode = currentNode._parent
						return result
					}
				}
			}
		}
	}
}

/**
 * Returns the common ancestor of the given nodes.
 * 
 * @param nodeA - a node
 * @param nodeB - a node
 */
export function tree_getCommonAncestor(nodeA: Node, nodeB: Node): Node | null {
	
	if(nodeA === nodeB){
		return nodeA._parent
	}

	// lists of parent nodes
	const parentsA: Node[] = [...tree_getAncestorNodes(nodeA, true)]
	const parentsB: Node[] = [...tree_getAncestorNodes(nodeB, true)]

	// walk through parents backwards until they differ
	let pos1 = parentsA.length
	let pos2 = parentsB.length
	let parent: Node | null = null
	for (let i = Math.min(pos1, pos2); i > 0; i--) {
		const parent1 = parentsA[--pos1]
		const parent2 = parentsB[--pos2]
		if (parent1 !== parent2) {
			break
		}
		parent = parent1
	}

	return parent
}

/**
 * Returns the node following `node` in depth-first preorder.
 * 
 * @param root - root of the subtree
 * @param node - a node
 */
export function tree_getFollowingNode(root: Node, node: Node): Node | null {
	if (node._firstChild) {
		return node._firstChild
	} else if (node._nextSibling) {
		return node._nextSibling
	} else {
		while (true) {
			const parent = node._parent
			if (parent === null || parent === root) {
				return null
			} else if (parent._nextSibling) {
				return parent._nextSibling
			} else {
				node = parent
			}
		}
	}
}

/**
 * Returns the node preceding `node` in depth-first preorder.
 * 
 * @param root - root of the subtree
 * @param node - a node
 */
export function tree_getPrecedingNode(root: Node, node: Node): Node | null {
	if (node === root) {
		return null
	}
	if (node._previousSibling) {
		node = node._previousSibling
		if (node._lastChild) {
			return node._lastChild
		} else {
			return node
		}
	} else {
		return node._parent
	}
}

/**
 * Determines if the node tree is constrained. A node tree is 
 * constrained as follows, expressed as a relationship between the 
 * type of node and its allowed children:
 *  - Document (In tree order)
 *    * Zero or more nodes each of which is ProcessingInstruction 
 *      or Comment.
 *    * Optionally one DocumentType node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *    * Optionally one Element node.
 *    * Zero or more nodes each of which is ProcessingInstruction
 *      or Comment.
 *  - DocumentFragment, Element
 *    * Zero or more nodes each of which is Element, Text, 
 *      ProcessingInstruction, or Comment.
 *  - DocumentType, Text, ProcessingInstruction, Comment
 *    * None.
 * 
 * @param node - the root of the tree
 */
export function tree_isConstrained(node: Node): boolean {
	switch (node.nodeType) {
		case NodeType.Document:
			let hasDocType = false
			let hasElement = false
			for (const childNode of node._children) {
				switch (childNode.nodeType) {
					case NodeType.ProcessingInstruction:
					case NodeType.Comment:
						break
					case NodeType.DocumentType:
						if (hasDocType || hasElement) return false
						hasDocType = true
						break
					case NodeType.Element:
						if (hasElement) return false
						hasElement = true
						break
					default:
						return false
				}
			}
			break
		case NodeType.DocumentFragment:
		case NodeType.Element:
			for (const childNode of node._children) {
				switch (childNode.nodeType) {
					case NodeType.Element:
					case NodeType.Text:
					case NodeType.ProcessingInstruction:
					case NodeType.CData:
					case NodeType.Comment:
						break
					default:
						return false
				}
			}
			break
		case NodeType.DocumentType:
		case NodeType.Text:
		case NodeType.ProcessingInstruction:
		case NodeType.CData:
		case NodeType.Comment:
			return (!node.hasChildNodes())
	}

	for (const childNode of node._children) {
		// recursively check child nodes
		if (!tree_isConstrained(childNode))
			return false
	}
	return true
}

/**
 * Returns the length of a node.
 * 
 * @param node - a node to check
 */
export function tree_nodeLength(node: Node): number {
	/**
		* To determine the length of a node node, switch on node:
		* - DocumentType
		* Zero.
		* - Text
		* - ProcessingInstruction
		* - Comment
		* Its data’s length.
		* - Any other node
		* Its number of children.
		*/
	if (Guard.isDocumentTypeNode(node)) {
		return 0
	} else if (Guard.isCharacterDataNode(node)) {
		return node._data.length
	} else {
		return node._children.size
	}
}

/**
 * Determines if a node is empty.
 * 
 * @param node - a node to check
 */
export function tree_isEmpty(node: Node): boolean {
	/**
		* A node is considered empty if its length is zero.
		*/
	return (tree_nodeLength(node) === 0)
}

/**
 * Returns the root node of a tree. The root of an object is itself,
 * if its parent is `null`, or else it is the root of its parent. 
 * The root of a tree is any object participating in that tree 
 * whose parent is `null`.
 * 
 * @param node - a node of the tree
 * @param shadow - `true` to return shadow-including root, otherwise 
 * `false`
 */
export function tree_rootNode(node: Node, shadow = false): Node {
	/**
		* The root of an object is itself, if its parent is null, or else it is the 
		* root of its parent. The root of a tree is any object participating in 
		* that tree whose parent is null.
		*/
	if (shadow) {
		const root = tree_rootNode(node, false)
		if (Guard.isShadowRoot(root))
			return tree_rootNode(root._host, true)
		else
			return root
	} else {
		if (!node._parent)
			return node
		else
			return tree_rootNode(node._parent)
	}
}

/**
 * Determines whether `other` is a descendant of `node`. An object 
 * A is called a descendant of an object B, if either A is a child 
 * of B or A is a child of an object C that is a descendant of B.
 * 
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the 
 * node's and its descendant's shadow trees as well.
 */
export function tree_isDescendantOf(node: Node, other: Node,
	self: boolean = false, shadow: boolean = false): boolean {
	/**
		* An object A is called a descendant of an object B, if either A is a 
		* child of B or A is a child of an object C that is a descendant of B.
		* 
		* An inclusive descendant is an object or one of its descendants.
		*/
	for (const child of tree_getDescendantNodes(node, self, shadow)) {
		if (child === other)
			return true
	}

	return false
}

/**
 * Determines whether `other` is an ancestor of `node`. An object A 
 * is called an ancestor of an object B if and only if B is a 
 * descendant of A.
 * 
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 * @param shadow - if `true`, traversal includes the 
 * node's and its descendant's shadow trees as well.
 */
export function tree_isAncestorOf(node: Node, other: Node,
	self: boolean = false, shadow: boolean = false): boolean {
	/**
		* An object A is called an ancestor of an object B if and only if B is a
		* descendant of A.
		* 
		* An inclusive ancestor is an object or one of its ancestors.
		*/
	return tree_isDescendantOf(other, node, self, shadow)
}

/**
 * Determines whether `other` is a sibling of `node`. An object A is
 * called a sibling of an object B, if and only if B and A share 
 * the same non-null parent.
 * 
 * @param node - a node
 * @param other - the node to check
 * @param self - if `true`, traversal includes `node` itself
 */
export function tree_isSiblingOf(node: Node, other: Node,
	self: boolean = false): boolean {
	/**
		* An object A is called a sibling of an object B, if and only if B and A 
		* share the same non-null parent.
		* 
		* An inclusive sibling is an object or one of its siblings.
		*/
	if (node === other) {
		if (self) return true
	} else {
		return (node._parent !== null && node._parent === other._parent)
	}

	return false
}

/**
 * Determines whether `other` is preceding `node`. An object A is 
 * preceding an object B if A and B are in the same tree and A comes 
 * before B in tree order.
 * 
 * @param node - a node
 * @param other - the node to check
 */
export function tree_isPreceding(node: Node, other: Node): boolean {
	/**
		* An object A is preceding an object B if A and B are in the same tree and 
		* A comes before B in tree order.
		*/
	const nodePos = tree_treePosition(node)
	const otherPos = tree_treePosition(other)

	if (nodePos === -1 || otherPos === -1)
		return false
	else if (tree_rootNode(node) !== tree_rootNode(other))
		return false
	else
		return otherPos < nodePos
}

/**
 * Determines whether `other` is following `node`. An object A is 
 * following an object B if A and B are in the same tree and A comes 
 * after B in tree order.
 * 
 * @param node - a node
 * @param other - the node to check
 */
export function tree_isFollowing(node: Node, other: Node): boolean {
	/**
		* An object A is following an object B if A and B are in the same tree and 
		* A comes after B in tree order.
		*/
	const nodePos = tree_treePosition(node)
	const otherPos = tree_treePosition(other)

	if (nodePos === -1 || otherPos === -1)
		return false
	else if (tree_rootNode(node) !== tree_rootNode(other))
		return false
	else
		return otherPos > nodePos
}

/**
 * Determines whether `other` is the parent node of `node`.
 * 
 * @param node - a node
 * @param other - the node to check
 */
export function tree_isParentOf(node: Node, other: Node): boolean {
	/**
		* An object that participates in a tree has a parent, which is either
		* null or an object, and has children, which is an ordered set of objects.
		* An object A whose parent is object B is a child of B.
		*/
	return (node._parent === other)
}

/**
 * Determines whether `other` is a child node of `node`.
 * 
 * @param node - a node
 * @param other - the node to check
 */
export function tree_isChildOf(node: Node, other: Node): boolean {
	/**
		* An object that participates in a tree has a parent, which is either
		* null or an object, and has children, which is an ordered set of objects.
		* An object A whose parent is object B is a child of B.
		*/
	return (other._parent === node)
}

/**
 * Returns the previous sibling node of `node` or null if it has no
 * preceding sibling.
 * 
 * @param node 
 */
export function tree_previousSibling(node: Node): Node | null {
	/**
		* The previous sibling of an object is its first preceding sibling or null 
		* if it has no preceding sibling.
		*/
	return node._previousSibling
}

/**
 * Returns the next sibling node of `node` or null if it has no
 * following sibling.
 * 
 * @param node 
 */
export function tree_nextSibling(node: Node): Node | null {
	/**
		* The next sibling of an object is its first following sibling or null 
		* if it has no following sibling.
		*/
	return node._nextSibling
}

/**
 * Returns the first child node of `node` or null if it has no
 * children.
 * 
 * @param node 
 */
export function tree_firstChild(node: Node): Node | null {
	/**
		* The first child of an object is its first child or null if it has no 
		* children.
		*/
	return node._firstChild
}

/**
 * Returns the last child node of `node` or null if it has no
 * children.
 * 
 * @param node 
 */
export function tree_lastChild(node: Node): Node | null {
	/**
		* The last child of an object is its last child or null if it has no 
		* children.
		*/
	return node._lastChild
}

/**
 * Returns the zero-based index of `node` when counted preorder in
 * the tree rooted at `root`. Returns `-1` if `node` is not in 
 * the tree.
 * 
 * @param node - the node to get the index of
 */
export function tree_treePosition(node: Node): number {
	const root = tree_rootNode(node)

	let pos = 0
	for (const childNode of tree_getDescendantNodes(root)) {
		pos++
		if (childNode === node) return pos
	}

	return -1
}

/**
 * Determines the index of `node`. The index of an object is its number of 
 * preceding siblings, or 0 if it has none.
 * 
 * @param node - a node
 * @param other - the node to check
 */
export function tree_index(node: Node): number {
	/**
		* The index of an object is its number of preceding siblings, or 0 if it 
		* has none.
		*/
	let n = 0

	while (node._previousSibling !== null) {
		n++
		node = node._previousSibling
	}

	return n
}

/**
 * Retargets an object against another object.
 * 
 * @param a - an object to retarget
 * @param b - an object to retarget against
 */
export function tree_retarget(a: any, b: any): any {
	/**
		* To retarget an object A against an object B, repeat these steps until
		* they return an object:
		* 1. If one of the following is true
		* - A is not a node
		* - A's root is not a shadow root
		* - B is a node and A's root is a shadow-including inclusive ancestor
		* of B
		* then return A.
		* 2. Set A to A's root's host.
		*/

	while (true) {
		if (!a || !Guard.isNode(a)) {
			return a
		}

		const rootOfA = tree_rootNode(a)
		if (!Guard.isShadowRoot(rootOfA)) {
			return a
		}

		if (b && Guard.isNode(b) && tree_isAncestorOf(rootOfA, b, true, true)) {
			return a
		}

		a = rootOfA.host
	}
}
