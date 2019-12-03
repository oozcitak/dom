import { TreeAlgorithm, DOMAlgorithm } from './interfaces'
import { Guard } from '../util'
import { NodeType, Element, Node, ShadowRoot, DocumentFragment } from '../dom/interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'

/**
	* Contains tree manipulation algorithms.
	*/
export class TreeAlgorithmImpl extends SubAlgorithmImpl implements TreeAlgorithm {

	/**
		* Initializes a new `TreeAlgorithm`.
		* 
		* @param algorithm - parent DOM algorithm
		*/
	public constructor(algorithm: DOMAlgorithm) {
		super(algorithm)
	}

	private _getNextDescendantNode(root: Node, node: Node, shadow: boolean = false): Node | null {
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

	/** @inheritdoc */
  getDescendantNodes(node: Node, self: boolean = false,
    shadow: boolean = false, filter?: ((childNode: Node) => boolean)):
		Iterable<Node> {

    return {
      [Symbol.iterator]: function(this: TreeAlgorithmImpl): Iterator<Node> {

        let currentNode: Node | null = (self ? node : this._getNextDescendantNode(node, node, shadow))
        
        return {
          next: function(this: TreeAlgorithmImpl): IteratorResult<Node> {
						while (currentNode && filter && !filter(currentNode)) {
							currentNode = this._getNextDescendantNode(node, currentNode, shadow)
						}

            if (currentNode === null) {
              return { done: true, value: null }
            } else {
              const result = { done: false, value: currentNode }
              currentNode = this._getNextDescendantNode(node, currentNode, shadow)
              return result
            }
          }.bind(this)
        }
      }.bind(this)
    }
  }

	/** @inheritdoc */
	getDescendantElements(node: Node, self: boolean = false, 
		shadow: boolean = false, filter?:	((childNode: Element) => boolean)):
		Iterable<Element> {
   
    return {
      [Symbol.iterator]: function(this: TreeAlgorithmImpl): Iterator<Element> {

        const it = this.getDescendantNodes(node, self, shadow, (e: Node) => Guard.isElementNode(e))[Symbol.iterator]()
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
      }.bind(this)
    }
	}

	/** @inheritdoc */
	getSiblingNodes(node: Node, self: boolean = false,
		filter?: ((childNode: Node) => boolean)):
		Iterable<Node> {

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

	/** @inheritdoc */
	getAncestorNodes(node: Node, self: boolean = false,
		filter?: ((ancestorNode: Node) => boolean)):
		Iterable<Node> {

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

	/** @inheritdoc */
	getCommonAncestor(nodeA: Node, nodeB: Node): Node | null {
		if(nodeA === nodeB){
			return nodeA._parent
    }

    // lists of parent nodes
    const parentsA: Node[] = [...this.getAncestorNodes(nodeA, true)]
    const parentsB: Node[] = [...this.getAncestorNodes(nodeB, true)]

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

	/** @inheritdoc */
	getFollowingNode(root: Node, node: Node): Node | null {
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

	/** @inheritdoc */
	getPrecedingNode(root: Node, node: Node): Node | null {
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

	/** @inheritdoc */
	isConstrained(node: Node): boolean {
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
			if (!this.isConstrained(childNode))
				return false
		}
		return true
	}

	/** @inheritdoc */
	nodeLength(node: Node): number {
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

	/** @inheritdoc */
	isEmpty(node: Node): boolean {
		/**
			* A node is considered empty if its length is zero.
			*/
		return (this.nodeLength(node) === 0)
	}

	/** @inheritdoc */
	rootNode(node: Node, shadow = false): Node {
		/**
			* The root of an object is itself, if its parent is null, or else it is the 
			* root of its parent. The root of a tree is any object participating in 
			* that tree whose parent is null.
			*/
		if (shadow) {
			const root = this.rootNode(node, false)
			if (Guard.isShadowRoot(root))
				return this.rootNode(root._host, true)
			else
				return root
		} else {
			if (!node._parent)
				return node
			else
				return this.rootNode(node._parent)
		}
	}

	/** @inheritdoc */
	isDescendantOf(node: Node, other: Node,
		self: boolean = false, shadow: boolean = false): boolean {
		/**
			* An object A is called a descendant of an object B, if either A is a 
			* child of B or A is a child of an object C that is a descendant of B.
			* 
			* An inclusive descendant is an object or one of its descendants.
			*/
		for (const child of this.getDescendantNodes(node, self, shadow)) {
			if (child === other)
				return true
		}

		return false
	}

	/** @inheritdoc */
	isAncestorOf(node: Node, other: Node,
		self: boolean = false, shadow: boolean = false): boolean {
		/**
			* An object A is called an ancestor of an object B if and only if B is a
			* descendant of A.
			* 
			* An inclusive ancestor is an object or one of its ancestors.
			*/
		return this.isDescendantOf(other, node, self, shadow)
	}

	/** @inheritdoc */
	isSiblingOf(node: Node, other: Node,
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

	/** @inheritdoc */
	isPreceding(node: Node, other: Node): boolean {
		/**
			* An object A is preceding an object B if A and B are in the same tree and 
			* A comes before B in tree order.
			*/
		const nodePos = this.treePosition(node)
		const otherPos = this.treePosition(other)

		if (nodePos === -1 || otherPos === -1)
			return false
		else if (this.rootNode(node) !== this.rootNode(other))
			return false
		else
			return otherPos < nodePos
	}

	/** @inheritdoc */
	isFollowing(node: Node, other: Node): boolean {
		/**
			* An object A is following an object B if A and B are in the same tree and 
			* A comes after B in tree order.
			*/
		const nodePos = this.treePosition(node)
		const otherPos = this.treePosition(other)

		if (nodePos === -1 || otherPos === -1)
			return false
		else if (this.rootNode(node) !== this.rootNode(other))
			return false
		else
			return otherPos > nodePos
	}

	/** @inheritdoc */
	isParentOf(node: Node, other: Node): boolean {
		/**
			* An object that participates in a tree has a parent, which is either
			* null or an object, and has children, which is an ordered set of objects.
			* An object A whose parent is object B is a child of B.
			*/
		return (node._parent === other)
	}

	/** @inheritdoc */
	isChildOf(node: Node, other: Node): boolean {
		/**
			* An object that participates in a tree has a parent, which is either
			* null or an object, and has children, which is an ordered set of objects.
			* An object A whose parent is object B is a child of B.
			*/
		return (other._parent === node)
	}

	/** @inheritdoc */
	previousSibling(node: Node): Node | null {
		/**
			* The previous sibling of an object is its first preceding sibling or null 
			* if it has no preceding sibling.
			*/
		return node._previousSibling
	}

	/** @inheritdoc */
	nextSibling(node: Node): Node | null {
		/**
			* The next sibling of an object is its first following sibling or null 
			* if it has no following sibling.
			*/
		return node._nextSibling
	}

	/** @inheritdoc */
	firstChild(node: Node): Node | null {
		/**
			* The first child of an object is its first child or null if it has no 
			* children.
			*/
		return node._firstChild
	}

	/** @inheritdoc */
	lastChild(node: Node): Node | null {
		/**
			* The last child of an object is its last child or null if it has no 
			* children.
			*/
		return node._lastChild
	}

	/** @inheritdoc */
	treePosition(node: Node): number {
		const root = this.rootNode(node)

		let pos = 0
		for (const childNode of this.getDescendantNodes(root)) {
			pos++
			if (childNode === node) return pos
		}

		return -1
	}

	/** @inheritdoc */
	index(node: Node): number {
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

	/** @inheritdoc */
	retarget(a: any, b: any): any {
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

			const rootOfA = this.rootNode(a)
			if (!Guard.isShadowRoot(rootOfA)) {
				return a
			}

			if (b && Guard.isNode(b) && this.isAncestorOf(rootOfA, b, true, true)) {
				return a
			}

			a = rootOfA.host
		}
	}

}
