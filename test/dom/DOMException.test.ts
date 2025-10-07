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

$$.suite('DOMException', () => {

  $$.test('WrongDocumentError()', () => {
    const err1 = new WrongDocumentError()
    $$.deepEqual(err1.name, "WrongDocumentError")
    $$.deepEqual(err1.message, "The object is in the wrong document. ")
    const err2 = new WrongDocumentError("x")
    $$.deepEqual(err2.name, "WrongDocumentError")
    $$.deepEqual(err2.message, "The object is in the wrong document. x")
  })

  $$.test('DOMStringSizeError', () => {
    const err1 = new DOMStringSizeError()
    $$.deepEqual(err1.name, "DOMStringSizeError")
    $$.deepEqual(err1.message, "")
    const err2 = new DOMStringSizeError("x")
    $$.deepEqual(err2.name, "DOMStringSizeError")
    $$.deepEqual(err2.message, "x")
  })

  $$.test('WrongDocumentError', () => {
    const err1 = new WrongDocumentError()
    $$.deepEqual(err1.name, "WrongDocumentError")
    $$.deepEqual(err1.message, "The object is in the wrong document. ")
    const err2 = new WrongDocumentError("x")
    $$.deepEqual(err2.name, "WrongDocumentError")
    $$.deepEqual(err2.message, "The object is in the wrong document. x")
  })

  $$.test('NoDataAllowedError', () => {
    const err1 = new NoDataAllowedError()
    $$.deepEqual(err1.name, "NoDataAllowedError")
    $$.deepEqual(err1.message, "")
    const err2 = new NoDataAllowedError("x")
    $$.deepEqual(err2.name, "NoDataAllowedError")
    $$.deepEqual(err2.message, "x")
  })

  $$.test('NoModificationAllowedError', () => {
    const err1 = new NoModificationAllowedError()
    $$.deepEqual(err1.name, "NoModificationAllowedError")
    $$.deepEqual(err1.message, "The object can not be modified. ")
    const err2 = new NoModificationAllowedError("x")
    $$.deepEqual(err2.name, "NoModificationAllowedError")
    $$.deepEqual(err2.message, "The object can not be modified. x")
  })

  $$.test('NotSupportedError', () => {
    const err1 = new NotSupportedError()
    $$.deepEqual(err1.name, "NotSupportedError")
    $$.deepEqual(err1.message, "The operation is not supported. ")
    const err2 = new NotSupportedError("x")
    $$.deepEqual(err2.name, "NotSupportedError")
    $$.deepEqual(err2.message, "The operation is not supported. x")
  })

  $$.test('InUseAttributeError', () => {
    const err1 = new InUseAttributeError()
    $$.deepEqual(err1.name, "InUseAttributeError")
    $$.deepEqual(err1.message, "")
    const err2 = new InUseAttributeError("x")
    $$.deepEqual(err2.name, "InUseAttributeError")
    $$.deepEqual(err2.message, "x")
  })

  $$.test('InvalidStateError', () => {
    const err1 = new InvalidStateError()
    $$.deepEqual(err1.name, "InvalidStateError")
    $$.deepEqual(err1.message, "The object is in an invalid state. ")
    const err2 = new InvalidStateError("x")
    $$.deepEqual(err2.name, "InvalidStateError")
    $$.deepEqual(err2.message, "The object is in an invalid state. x")
  })

  $$.test('InvalidModificationError', () => {
    const err1 = new InvalidModificationError()
    $$.deepEqual(err1.name, "InvalidModificationError")
    $$.deepEqual(err1.message, "The object can not be modified in this way. ")
    const err2 = new InvalidModificationError("x")
    $$.deepEqual(err2.name, "InvalidModificationError")
    $$.deepEqual(err2.message, "The object can not be modified in this way. x")
  })

  $$.test('NamespaceError', () => {
    const err1 = new NamespaceError()
    $$.deepEqual(err1.name, "NamespaceError")
    $$.deepEqual(err1.message, "The operation is not allowed by Namespaces in XML. [XMLNS] ")
    const err2 = new NamespaceError("x")
    $$.deepEqual(err2.name, "NamespaceError")
    $$.deepEqual(err2.message, "The operation is not allowed by Namespaces in XML. [XMLNS] x")
  })

  $$.test('InvalidAccessError', () => {
    const err1 = new InvalidAccessError()
    $$.deepEqual(err1.name, "InvalidAccessError")
    $$.deepEqual(err1.message, "The object does not support the operation or argument. ")
    const err2 = new InvalidAccessError("x")
    $$.deepEqual(err2.name, "InvalidAccessError")
    $$.deepEqual(err2.message, "The object does not support the operation or argument. x")
  })

  $$.test('ValidationError', () => {
    const err1 = new ValidationError()
    $$.deepEqual(err1.name, "ValidationError")
    $$.deepEqual(err1.message, "")
    const err2 = new ValidationError("x")
    $$.deepEqual(err2.name, "ValidationError")
    $$.deepEqual(err2.message, "x")
  })

  $$.test('TypeMismatchError', () => {
    const err1 = new TypeMismatchError()
    $$.deepEqual(err1.name, "TypeMismatchError")
    $$.deepEqual(err1.message, "")
    const err2 = new TypeMismatchError("x")
    $$.deepEqual(err2.name, "TypeMismatchError")
    $$.deepEqual(err2.message, "x")
  })

  $$.test('SecurityError', () => {
    const err1 = new SecurityError()
    $$.deepEqual(err1.name, "SecurityError")
    $$.deepEqual(err1.message, "The operation is insecure. ")
    const err2 = new SecurityError("x")
    $$.deepEqual(err2.name, "SecurityError")
    $$.deepEqual(err2.message, "The operation is insecure. x")
  })

  $$.test('NetworkError', () => {
    const err1 = new NetworkError()
    $$.deepEqual(err1.name, "NetworkError")
    $$.deepEqual(err1.message, "A network error occurred. ")
    const err2 = new NetworkError("x")
    $$.deepEqual(err2.name, "NetworkError")
    $$.deepEqual(err2.message, "A network error occurred. x")
  })

  $$.test('AbortError', () => {
    const err1 = new AbortError()
    $$.deepEqual(err1.name, "AbortError")
    $$.deepEqual(err1.message, "The operation was aborted. ")
    const err2 = new AbortError("x")
    $$.deepEqual(err2.name, "AbortError")
    $$.deepEqual(err2.message, "The operation was aborted. x")
  })

  $$.test('URLMismatchError', () => {
    const err1 = new URLMismatchError()
    $$.deepEqual(err1.name, "URLMismatchError")
    $$.deepEqual(err1.message, "The given URL does not match another URL. ")
    const err2 = new URLMismatchError("x")
    $$.deepEqual(err2.name, "URLMismatchError")
    $$.deepEqual(err2.message, "The given URL does not match another URL. x")
  })

  $$.test('QuotaExceededError', () => {
    const err1 = new QuotaExceededError()
    $$.deepEqual(err1.name, "QuotaExceededError")
    $$.deepEqual(err1.message, "The quota has been exceeded. ")
    const err2 = new QuotaExceededError("x")
    $$.deepEqual(err2.name, "QuotaExceededError")
    $$.deepEqual(err2.message, "The quota has been exceeded. x")
  })

  $$.test('TimeoutError', () => {
    const err1 = new TimeoutError()
    $$.deepEqual(err1.name, "TimeoutError")
    $$.deepEqual(err1.message, "The operation timed out. ")
    const err2 = new TimeoutError("x")
    $$.deepEqual(err2.name, "TimeoutError")
    $$.deepEqual(err2.message, "The operation timed out. x")
  })

  $$.test('InvalidNodeTypeError', () => {
    const err1 = new InvalidNodeTypeError()
    $$.deepEqual(err1.name, "InvalidNodeTypeError")
    $$.deepEqual(err1.message, "The supplied node is incorrect or has an incorrect ancestor for this operation. ")
    const err2 = new InvalidNodeTypeError("x")
    $$.deepEqual(err2.name, "InvalidNodeTypeError")
    $$.deepEqual(err2.message, "The supplied node is incorrect or has an incorrect ancestor for this operation. x")
  })

  $$.test('DataCloneError', () => {
    const err1 = new DataCloneError()
    $$.deepEqual(err1.name, "DataCloneError")
    $$.deepEqual(err1.message, "The object can not be cloned. ")
    const err2 = new DataCloneError("x")
    $$.deepEqual(err2.name, "DataCloneError")
    $$.deepEqual(err2.message, "The object can not be cloned. x")
  })

  $$.test('NotImplementedError', () => {
    const err1 = new NotImplementedError()
    $$.deepEqual(err1.name, "NotImplementedError")
    $$.deepEqual(err1.message, "The DOM method is not implemented by this module. ")
    const err2 = new NotImplementedError("x")
    $$.deepEqual(err2.name, "NotImplementedError")
    $$.deepEqual(err2.message, "The DOM method is not implemented by this module. x")
  })

  $$.test('HierarchyRequestError', () => {
    const err1 = new HierarchyRequestError()
    $$.deepEqual(err1.name, "HierarchyRequestError")
    $$.deepEqual(err1.message, "The operation would yield an incorrect node tree. ")
    const err2 = new HierarchyRequestError("x")
    $$.deepEqual(err2.name, "HierarchyRequestError")
    $$.deepEqual(err2.message, "The operation would yield an incorrect node tree. x")
  })

  $$.test('NotFoundError', () => {
    const err1 = new NotFoundError()
    $$.deepEqual(err1.name, "NotFoundError")
    $$.deepEqual(err1.message, "The object can not be found here. ")
    const err2 = new NotFoundError("x")
    $$.deepEqual(err2.name, "NotFoundError")
    $$.deepEqual(err2.message, "The object can not be found here. x")
  })

  $$.test('IndexSizeError', () => {
    const err1 = new IndexSizeError()
    $$.deepEqual(err1.name, "IndexSizeError")
    $$.deepEqual(err1.message, "The index is not in the allowed range. ")
    const err2 = new IndexSizeError("x")
    $$.deepEqual(err2.name, "IndexSizeError")
    $$.deepEqual(err2.message, "The index is not in the allowed range. x")
  })

  $$.test('SyntaxError', () => {
    const err1 = new SyntaxError()
    $$.deepEqual(err1.name, "SyntaxError")
    $$.deepEqual(err1.message, "The string did not match the expected pattern. ")
    const err2 = new SyntaxError("x")
    $$.deepEqual(err2.name, "SyntaxError")
    $$.deepEqual(err2.message, "The string did not match the expected pattern. x")
  })

  $$.test('InvalidCharacterError', () => {
    const err1 = new InvalidCharacterError()
    $$.deepEqual(err1.name, "InvalidCharacterError")
    $$.deepEqual(err1.message, "The string contains invalid characters. ")
    const err2 = new InvalidCharacterError("x")
    $$.deepEqual(err2.name, "InvalidCharacterError")
    $$.deepEqual(err2.message, "The string contains invalid characters. x")
  })


})