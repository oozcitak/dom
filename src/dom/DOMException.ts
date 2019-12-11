/**
 * Contains static properties to produce `Error` objects used by this
 * module.
 */
export class DOMException extends Error {
  /**
   * Returns the name of the error message.
   */
  readonly name: string

  /**
   * 
   * @param name - message name
   * @param message - error message
   */
  constructor(name: string, message?: string) {
    super(message)

    this.name = name
  }
}

export class DOMStringSizeError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("DOMStringSizeError", message || "")
  }
}

export class WrongDocumentError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("WrongDocumentError", "The object is in the wrong document. " + message || "")
  }
}

export class NoDataAllowedError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("NoDataAllowedError", message || "")
  }
}

export class NoModificationAllowedError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("NoModificationAllowedError", "The object can not be modified. " + message || "")
  }
}

export class NotSupportedError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("NotSupportedError", "The operation is not supported. " + message || "")
  }
}

export class InUseAttributeError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("InUseAttributeError", message || "")
  }
}

export class InvalidStateError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("InvalidStateError", "The object is in an invalid state. " + message || "")
  }
}

export class InvalidModificationError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("InvalidModificationError", "The object can not be modified in this way. " + message || "")
  }
}

export class NamespaceError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("NamespaceError", "The operation is not allowed by Namespaces in XML. [XMLNS] " + message || "")
  }
}

export class InvalidAccessError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("InvalidAccessError", "The object does not support the operation or argument. " + message || "")
  }
}

export class ValidationError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("ValidationError", message || "")
  }
}

export class TypeMismatchError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("TypeMismatchError", message || "")
  }
}

export class SecurityError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("SecurityError", "The operation is insecure. " + message || "")
  }
}

export class NetworkError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("NetworkError", "A network error occurred. " + message || "")
  }
}

export class AbortError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("AbortError", "The operation was aborted. " + message || "")
  }
}

export class URLMismatchError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("URLMismatchError", "The given URL does not match another URL. " + message || "")
  }
}

export class QuotaExceededError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("QuotaExceededError", "The quota has been exceeded. " + message || "")
  }
}

export class TimeoutError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("TimeoutError", "The operation timed out. " + message || "")
  }
}

export class InvalidNodeTypeError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("InvalidNodeTypeError", "The supplied node is incorrect or has an incorrect ancestor for this operation. " + message || "")
  }
}

export class DataCloneError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("DataCloneError", "The object can not be cloned. " + message || "")
  }
}

export class NotImplementedError extends DOMException {
  /**
  * @param message - error message
  */
  constructor(message?: string) {
    super("NotImplementedError", "The DOM method is not implemented by this module. " + message || "")
  }
}



export class HierarchyRequestError extends DOMException {
  /**
   * @param message - error message
   */
  constructor(message?: string) {
    super("HierarchyRequestError", "The operation would yield an incorrect node tree. " + message || "")
  }
}

export class NotFoundError extends DOMException {
  /**
   * @param message - error message
   */
  constructor(message?: string) {
    super("NotFoundError", "The object can not be found here. " + message || "")
  }
}

export class IndexSizeError extends DOMException {
  /**
   * @param message - error message
   */
  constructor(message?: string) {
    super("NotFoundError", "The index is not in the allowed range. " + message || "")
  }
}

export class SyntaxError extends DOMException {
  /**
   * @param message - error message
   */
  constructor(message?: string) {
    super("SyntaxError", "The string did not match the expected pattern. " + message || "")
  }
}

export class InvalidCharacterError extends DOMException {
  /**
   * @param message - error message
   */
  constructor(message?: string) {
    super("InvalidCharacterError", "The string contains invalid characters. " + message || "")
  }
}
