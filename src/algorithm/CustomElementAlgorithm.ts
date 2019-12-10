import { Element, Document } from '../dom/interfaces'
import { CustomElementDefinition } from '../dom/interfaces'

const PotentialCustomElementName = /[a-z]([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*/

const NamesWithHyphen = new Set(['annotation-xml', 'color-profile',
  'font-face', 'font-face-src', 'font-face-uri', 'font-face-format',
  'font-face-name', 'missing-glyph'])

const ElementNames = new Set(['article', 'aside', 'blockquote',
  'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'main', 'nav', 'p', 'section', 'span'])

const VoidElementNames = new Set(['area', 'base', 'basefont',
  'bgsound', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'keygen',
  'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr'])

const ShadowHostNames = new Set(['article', 'aside', 'blockquote', 'body',
  'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
  'nav', 'p', 'section', 'span'])

/**
 * Determines if the given string is a valid custom element name.
 * 
 * @param name - a name string
 */
export function customElement_isValidCustomElementName(name: string): boolean {
  if (!PotentialCustomElementName.test(name))
    return false

  if (NamesWithHyphen.has(name))
    return false

  return true
}

/**
 * Determines if the given string is a valid element name.
 * 
 * @param name - a name string
 */
export function customElement_isValidElementName(name: string): boolean {
  return (ElementNames.has(name))
}

/**
 * Determines if the given string is a void element name.
 * 
 * @param name - a name string
 */
export function customElement_isVoidElementName(name: string): boolean {
  return (VoidElementNames.has(name))
}

/**
 * Determines if the given string is a valid shadow host element name.
 * 
 * @param name - a name string
 */
export function customElement_isValidShadowHostName(name: string): boolean {
  return (ShadowHostNames.has(name))
}

/**
 * Enqueues an upgrade reaction for a custom element.
 * 
 * @param element - a custom element
 * @param definition - a custom element definition
 */
export function customElement_enqueueACustomElementUpgradeReaction(element: Element,
  definition: CustomElementDefinition): void {
  // TODO: Implement in HTML DOM
}

/**
 * Enqueues a callback reaction for a custom element.
 * 
 * @param element - a custom element
 * @param callbackName - name of the callback
 * @param args - callback arguments
 */
export function customElement_enqueueACustomElementCallbackReaction(element: Element,
  callbackName: string, args: any[]): void {
  // TODO: Implement in HTML DOM
}

/**
 * Upgrade a custom element.
 * 
 * @param element - a custom element
 */
export function customElement_upgrade(definition: CustomElementDefinition, element: Element): void {
  // TODO: Implement in HTML DOM
}

/**
 * Tries to upgrade a custom element.
 * 
 * @param element - a custom element
 */
export function customElement_tryToUpgrade(element: Element): void {
  // TODO: Implement in HTML DOM
}

/**
 * Looks up a custom element definition.
 * 
 * @param document - a document
 * @param namespace - element namespace
 * @param localName - element local name
 * @param is - an `is` value
 */
export function customElement_lookUpACustomElementDefinition(document: Document, 
  namespace: string | null, localName: string | null, is: string | null): 
  CustomElementDefinition | null {
  // TODO: Implement in HTML DOM
  return null
}
