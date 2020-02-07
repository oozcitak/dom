import $$ from "../TestHelpers"
import {
  WrongDocumentError, DOMStringSizeError, NoDataAllowedError,
  NoModificationAllowedError, NotSupportedError, InUseAttributeError,
  InvalidStateError, InvalidModificationError, NamespaceError,
  InvalidAccessError, ValidationError, TypeMismatchError, SecurityError,
  NetworkError, AbortError, URLMismatchError, QuotaExceededError,
  TimeoutError, InvalidNodeTypeError, DataCloneError, NotImplementedError,
  HierarchyRequestError, NotFoundError, IndexSizeError, InvalidCharacterError,
  SyntaxError
} from "../../src/dom/DOMException"

describe('DOMException', () => {

  test('WrongDocumentError()', () => {
    const err1 = new WrongDocumentError()
    expect(err1.name).toBe("WrongDocumentError")
    expect(err1.message).toBe("The object is in the wrong document. ")
    const err2 = new WrongDocumentError("x")
    expect(err2.name).toBe("WrongDocumentError")
    expect(err2.message).toBe("The object is in the wrong document. x")
  })

  test('DOMStringSizeError', () => {
    const err1 = new DOMStringSizeError()
    expect(err1.name).toBe("DOMStringSizeError")
    expect(err1.message).toBe("")
    const err2 = new DOMStringSizeError("x")
    expect(err2.name).toBe("DOMStringSizeError")
    expect(err2.message).toBe("x")
  })

  test('WrongDocumentError', () => {
    const err1 = new WrongDocumentError()
    expect(err1.name).toBe("WrongDocumentError")
    expect(err1.message).toBe("The object is in the wrong document. ")
    const err2 = new WrongDocumentError("x")
    expect(err2.name).toBe("WrongDocumentError")
    expect(err2.message).toBe("The object is in the wrong document. x")
  })

  test('NoDataAllowedError', () => {
    const err1 = new NoDataAllowedError()
    expect(err1.name).toBe("NoDataAllowedError")
    expect(err1.message).toBe("")
    const err2 = new NoDataAllowedError("x")
    expect(err2.name).toBe("NoDataAllowedError")
    expect(err2.message).toBe("x")
  })

  test('NoModificationAllowedError', () => {
    const err1 = new NoModificationAllowedError()
    expect(err1.name).toBe("NoModificationAllowedError")
    expect(err1.message).toBe("The object can not be modified. ")
    const err2 = new NoModificationAllowedError("x")
    expect(err2.name).toBe("NoModificationAllowedError")
    expect(err2.message).toBe("The object can not be modified. x")
  })

  test('NotSupportedError', () => {
    const err1 = new NotSupportedError()
    expect(err1.name).toBe("NotSupportedError")
    expect(err1.message).toBe("The operation is not supported. ")
    const err2 = new NotSupportedError("x")
    expect(err2.name).toBe("NotSupportedError")
    expect(err2.message).toBe("The operation is not supported. x")
  })

  test('InUseAttributeError', () => {
    const err1 = new InUseAttributeError()
    expect(err1.name).toBe("InUseAttributeError")
    expect(err1.message).toBe("")
    const err2 = new InUseAttributeError("x")
    expect(err2.name).toBe("InUseAttributeError")
    expect(err2.message).toBe("x")
  })

  test('InvalidStateError', () => {
    const err1 = new InvalidStateError()
    expect(err1.name).toBe("InvalidStateError")
    expect(err1.message).toBe("The object is in an invalid state. ")
    const err2 = new InvalidStateError("x")
    expect(err2.name).toBe("InvalidStateError")
    expect(err2.message).toBe("The object is in an invalid state. x")
  })

  test('InvalidModificationError', () => {
    const err1 = new InvalidModificationError()
    expect(err1.name).toBe("InvalidModificationError")
    expect(err1.message).toBe("The object can not be modified in this way. ")
    const err2 = new InvalidModificationError("x")
    expect(err2.name).toBe("InvalidModificationError")
    expect(err2.message).toBe("The object can not be modified in this way. x")
  })

  test('NamespaceError', () => {
    const err1 = new NamespaceError()
    expect(err1.name).toBe("NamespaceError")
    expect(err1.message).toBe("The operation is not allowed by Namespaces in XML. [XMLNS] ")
    const err2 = new NamespaceError("x")
    expect(err2.name).toBe("NamespaceError")
    expect(err2.message).toBe("The operation is not allowed by Namespaces in XML. [XMLNS] x")
  })

  test('InvalidAccessError', () => {
    const err1 = new InvalidAccessError()
    expect(err1.name).toBe("InvalidAccessError")
    expect(err1.message).toBe("The object does not support the operation or argument. ")
    const err2 = new InvalidAccessError("x")
    expect(err2.name).toBe("InvalidAccessError")
    expect(err2.message).toBe("The object does not support the operation or argument. x")
  })

  test('ValidationError', () => {
    const err1 = new ValidationError()
    expect(err1.name).toBe("ValidationError")
    expect(err1.message).toBe("")
    const err2 = new ValidationError("x")
    expect(err2.name).toBe("ValidationError")
    expect(err2.message).toBe("x")
  })

  test('TypeMismatchError', () => {
    const err1 = new TypeMismatchError()
    expect(err1.name).toBe("TypeMismatchError")
    expect(err1.message).toBe("")
    const err2 = new TypeMismatchError("x")
    expect(err2.name).toBe("TypeMismatchError")
    expect(err2.message).toBe("x")
  })

  test('SecurityError', () => {
    const err1 = new SecurityError()
    expect(err1.name).toBe("SecurityError")
    expect(err1.message).toBe("The operation is insecure. ")
    const err2 = new SecurityError("x")
    expect(err2.name).toBe("SecurityError")
    expect(err2.message).toBe("The operation is insecure. x")
  })

  test('NetworkError', () => {
    const err1 = new NetworkError()
    expect(err1.name).toBe("NetworkError")
    expect(err1.message).toBe("A network error occurred. ")
    const err2 = new NetworkError("x")
    expect(err2.name).toBe("NetworkError")
    expect(err2.message).toBe("A network error occurred. x")
  })

  test('AbortError', () => {
    const err1 = new AbortError()
    expect(err1.name).toBe("AbortError")
    expect(err1.message).toBe("The operation was aborted. ")
    const err2 = new AbortError("x")
    expect(err2.name).toBe("AbortError")
    expect(err2.message).toBe("The operation was aborted. x")
  })

  test('URLMismatchError', () => {
    const err1 = new URLMismatchError()
    expect(err1.name).toBe("URLMismatchError")
    expect(err1.message).toBe("The given URL does not match another URL. ")
    const err2 = new URLMismatchError("x")
    expect(err2.name).toBe("URLMismatchError")
    expect(err2.message).toBe("The given URL does not match another URL. x")
  })

  test('QuotaExceededError', () => {
    const err1 = new QuotaExceededError()
    expect(err1.name).toBe("QuotaExceededError")
    expect(err1.message).toBe("The quota has been exceeded. ")
    const err2 = new QuotaExceededError("x")
    expect(err2.name).toBe("QuotaExceededError")
    expect(err2.message).toBe("The quota has been exceeded. x")
  })

  test('TimeoutError', () => {
    const err1 = new TimeoutError()
    expect(err1.name).toBe("TimeoutError")
    expect(err1.message).toBe("The operation timed out. ")
    const err2 = new TimeoutError("x")
    expect(err2.name).toBe("TimeoutError")
    expect(err2.message).toBe("The operation timed out. x")
  })

  test('InvalidNodeTypeError', () => {
    const err1 = new InvalidNodeTypeError()
    expect(err1.name).toBe("InvalidNodeTypeError")
    expect(err1.message).toBe("The supplied node is incorrect or has an incorrect ancestor for this operation. ")
    const err2 = new InvalidNodeTypeError("x")
    expect(err2.name).toBe("InvalidNodeTypeError")
    expect(err2.message).toBe("The supplied node is incorrect or has an incorrect ancestor for this operation. x")
  })

  test('DataCloneError', () => {
    const err1 = new DataCloneError()
    expect(err1.name).toBe("DataCloneError")
    expect(err1.message).toBe("The object can not be cloned. ")
    const err2 = new DataCloneError("x")
    expect(err2.name).toBe("DataCloneError")
    expect(err2.message).toBe("The object can not be cloned. x")
  })

  test('NotImplementedError', () => {
    const err1 = new NotImplementedError()
    expect(err1.name).toBe("NotImplementedError")
    expect(err1.message).toBe("The DOM method is not implemented by this module. ")
    const err2 = new NotImplementedError("x")
    expect(err2.name).toBe("NotImplementedError")
    expect(err2.message).toBe("The DOM method is not implemented by this module. x")
  })

  test('HierarchyRequestError', () => {
    const err1 = new HierarchyRequestError()
    expect(err1.name).toBe("HierarchyRequestError")
    expect(err1.message).toBe("The operation would yield an incorrect node tree. ")
    const err2 = new HierarchyRequestError("x")
    expect(err2.name).toBe("HierarchyRequestError")
    expect(err2.message).toBe("The operation would yield an incorrect node tree. x")
  })

  test('NotFoundError', () => {
    const err1 = new NotFoundError()
    expect(err1.name).toBe("NotFoundError")
    expect(err1.message).toBe("The object can not be found here. ")
    const err2 = new NotFoundError("x")
    expect(err2.name).toBe("NotFoundError")
    expect(err2.message).toBe("The object can not be found here. x")
  })

  test('IndexSizeError', () => {
    const err1 = new IndexSizeError()
    expect(err1.name).toBe("IndexSizeError")
    expect(err1.message).toBe("The index is not in the allowed range. ")
    const err2 = new IndexSizeError("x")
    expect(err2.name).toBe("IndexSizeError")
    expect(err2.message).toBe("The index is not in the allowed range. x")
  })

  test('SyntaxError', () => {
    const err1 = new SyntaxError()
    expect(err1.name).toBe("SyntaxError")
    expect(err1.message).toBe("The string did not match the expected pattern. ")
    const err2 = new SyntaxError("x")
    expect(err2.name).toBe("SyntaxError")
    expect(err2.message).toBe("The string did not match the expected pattern. x")
  })

  test('InvalidCharacterError', () => {
    const err1 = new InvalidCharacterError()
    expect(err1.name).toBe("InvalidCharacterError")
    expect(err1.message).toBe("The string contains invalid characters. ")
    const err2 = new InvalidCharacterError("x")
    expect(err2.name).toBe("InvalidCharacterError")
    expect(err2.message).toBe("The string contains invalid characters. x")
  })


})