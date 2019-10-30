import { CustomElementAlgorithm, DOMAlgorithm } from './interfaces'
import { SubAlgorithmImpl } from './SubAlgorithmImpl'
import { ElementInternal, DocumentInternal } from '../interfacesInternal'
import { CustomElementDefinition } from '../interfaces'

/**
 * Contains event algorithms.
 */
export class CustomElementAlgorithmImpl extends SubAlgorithmImpl implements CustomElementAlgorithm {

  protected static readonly PotentialCustomElementName = /[a-z]([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*/

  protected static readonly NamesWithHyphen = ['annotation-xml', 'color-profile',
    'font-face', 'font-face-src', 'font-face-uri', 'font-face-format',
    'font-face-name', 'missing-glyph']

  protected static readonly ElementNames = ['article', 'aside', 'blockquote',
    'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'header', 'main', 'nav', 'p', 'section', 'span']

  protected static readonly VoidElementNames = ['area', 'base', 'basefont',
    'bgsound', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'keygen',
    'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr']

  protected static readonly ShadowHostNames = ['article', 'aside', 'blockquote', 'body',
    'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main',
    'nav', 'p', 'section', 'span']

  /**
   * Initializes a new `CustomElementAlgorithm`.
   * 
   * @param algorithm - parent DOM algorithm
   */
  public constructor(algorithm: DOMAlgorithm) {
    super(algorithm)
  }

  /** @inheritdoc */
  isValidCustomElementName(name: string): boolean {
    if (!name.match(CustomElementAlgorithmImpl.PotentialCustomElementName))
      return false

    if (CustomElementAlgorithmImpl.NamesWithHyphen.includes(name))
      return false

    return true
  }

  /** @inheritdoc */
  isValidElementName(name: string): boolean {
    return (CustomElementAlgorithmImpl.ElementNames.includes(name))
  }

  /** @inheritdoc */
  isVoidElementName(name: string): boolean {
    return (CustomElementAlgorithmImpl.VoidElementNames.includes(name))
  }

  /** @inheritdoc */
  isValidShadowHostName(name: string): boolean {
    return (CustomElementAlgorithmImpl.ShadowHostNames.includes(name))
  }

  /** @inheritdoc */
  enqueueACustomElementUpgradeReaction(element: ElementInternal,
    definition: CustomElementDefinition): void {
    // TODO: Implement in HTML DOM
  }

  /** @inheritdoc */
  enqueueACustomElementCallbackReaction(element: ElementInternal,
    callbackName: string, args: any[]): void {
    // TODO: Implement in HTML DOM
  }

  /** @inheritdoc */
  upgrade(definition: CustomElementDefinition, element: ElementInternal): void {
    // TODO: Implement in HTML DOM
  }

  /** @inheritdoc */
  tryToUpgrade(element: ElementInternal): void {
    // TODO: Implement in HTML DOM
  }
  
  /** @inheritdoc */
  lookUpACustomElementDefinition(document: DocumentInternal, namespace: string,
    localName: string | null, is: string | null): CustomElementDefinition | null {
    // TODO: Implement in HTML DOM
    return null
  }
  
}
