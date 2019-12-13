import { InvalidCharacterError, NamespaceError } from "../dom/DOMException"
import { namespace as infraNamespace } from "@oozcitak/infra"
import { xml_isName, xml_isQName } from "./XMLAlgorithm"

/**
 * Validates the given qualified name.
 * 
 * @param qualifiedName - qualified name
 */
export function namespace_validate(qualifiedName: string): void {
  /**
   * To validate a qualifiedName, throw an "InvalidCharacterError" 
   * DOMException if qualifiedName does not match the Name or QName 
   * production.
   */
  if (!xml_isName(qualifiedName))
    throw new InvalidCharacterError(`Invalid XML name: ${qualifiedName}`)

  if (!xml_isQName(qualifiedName))
    throw new InvalidCharacterError(`Invalid XML qualified name: ${qualifiedName}.`)
}

/**
 * Validates and extracts a namespace, prefix and localName from the
 * given namespace and qualified name.
 * See: https://dom.spec.whatwg.org/#validate-and-extract.
 * 
 * @param namespace - namespace
 * @param qualifiedName - qualified name
 * 
 * @returns a tuple with `namespace`, `prefix` and `localName`.
 */
export function namespace_validateAndExtract(namespace: string | null, qualifiedName: string):
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

  namespace_validate(qualifiedName)

  const parts = qualifiedName.split(':')
  const prefix = (parts.length === 2 ? parts[0] : null)
  const localName = (parts.length === 2 ? parts[1] : qualifiedName)

  if (prefix && namespace === null)
    throw new NamespaceError()

  if (prefix === "xml" && namespace !== infraNamespace.XML)
    throw new NamespaceError()

  if (namespace !== infraNamespace.XMLNS &&
    (prefix === "xmlns" || qualifiedName === "xmlns"))
    throw new NamespaceError()

  if (namespace === infraNamespace.XMLNS &&
    (prefix !== "xmlns" && qualifiedName !== "xmlns"))
    throw new NamespaceError()

  return [namespace, prefix, localName]
}

/**
 * Extracts a prefix and localName from the given qualified name.
 * 
 * @param qualifiedName - qualified name
 * 
 * @returns an tuple with `prefix` and `localName`.
 */
export function namespace_extractQName(qualifiedName: string): [string | null, string] {

  namespace_validate(qualifiedName)

  const parts = qualifiedName.split(':')
  const prefix = (parts.length === 2 ? parts[0] : null)
  const localName = (parts.length === 2 ? parts[1] : qualifiedName)

  return [prefix, localName]
}
