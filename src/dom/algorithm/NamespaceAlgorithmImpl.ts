import { NamespaceAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { XMLSpec } from '../spec'
import { DOMException } from '../DOMException'
import { namespace as infraNamespace } from '@oozcitak/infra'

/**
 * Contains namespace algorithms.
 */
export class NamespaceAlgorithmImpl extends SubAlgorithmImpl implements NamespaceAlgorithm {

  /**
   * Initializes a new `NamespaceAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  validate(qualifiedName: string): void {
    /**
     * To validate a qualifiedName, throw an "InvalidCharacterError" 
     * DOMException if qualifiedName does not match the Name or QName 
     * production.
     */
    if (!XMLSpec.isName(qualifiedName))
      throw DOMException.InvalidCharacterError

    if (!XMLSpec.isQName(qualifiedName))
      throw DOMException.InvalidCharacterError
  }

  /** @inheritdoc */
  validateAndExtract(namespace: string | null, qualifiedName: string):
    [string | null, string | null, string] {

    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. Validate qualifiedName.
     * 3. Let prefix be null.
     * 4. Let localName be qualifiedName.
     * 5. If qualifiedName contains a ":" (U+003E), then split the string on it 
     * and set prefix to the part before and localName to the part after.
     * 6. If prefix is non-null and namespace is null, then throw a 
     * "NamespaceError" DOMException.
     * 7. If prefix is "xml" and namespace is not the XML namespace, then throw 
     * a "NamespaceError" DOMException.
     * 8. If either qualifiedName or prefix is "xmlns" and namespace is not the 
     * XMLNS namespace, then throw a "NamespaceError" DOMException.
     * 9. If namespace is the XMLNS namespace and neither qualifiedName nor 
     * prefix is "xmlns", then throw a "NamespaceError" DOMException.
     * 10. Return namespace, prefix, and localName.
     */
    if (!namespace) namespace = null

    this.validate(qualifiedName)

    const parts = qualifiedName.split(':')
    const prefix = (parts.length === 2 ? parts[0] : null)
    const localName = (parts.length === 2 ? parts[1] : qualifiedName)

    if (prefix && namespace === null)
      throw DOMException.NamespaceError

    if (prefix === "xml" && namespace !== infraNamespace.XML)
      throw DOMException.NamespaceError

    if (namespace !== infraNamespace.XMLNS &&
      (prefix === "xmlns" || qualifiedName === "xmlns"))
      throw DOMException.NamespaceError

    if (namespace === infraNamespace.XMLNS &&
      (prefix !== "xmlns" && qualifiedName !== "xmlns"))
      throw DOMException.NamespaceError

    return [namespace, prefix, localName]
  }

  /** @inheritdoc */
  extractQName(qualifiedName: string): [ string | null, string ] {

    this.validate(qualifiedName)

    const parts = qualifiedName.split(':')
    const prefix = (parts.length === 2 ? parts[0] : null)
    const localName = (parts.length === 2 ? parts[1] : qualifiedName)

    return [ prefix, localName ]
  }

}
