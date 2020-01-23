import { Node } from "../dom/interfaces"
import { XMLSerializer } from "./interfaces"
import { XMLSerializerNSImpl } from "./XMLSerializerNSImpl"
import { XMLSerializerNoNSImpl } from "./XMLSerializerNoNSImpl"

/**
 * Represents an XML serializer.
 * 
 * Implements: https://www.w3.org/TR/DOM-Parsing/#serializing
 */
export class XMLSerializerImpl implements XMLSerializer {

  /** @inheritdoc */
  serializeToString(root: Node): string {
    // To increase performance, use a namespace-aware serializer only if the
    // document has namespaced elements
    if (root._nodeDocument === undefined || root._nodeDocument._hasNamespaces) {
      return new XMLSerializerNSImpl().serializeToString(root)
    } else {
      return new XMLSerializerNoNSImpl().serializeToString(root)
    }
  }

}
