/**
 * Defines a WebIDL `Const` property on the given object.
 * 
 * @param o - object on which to add the property
 * @param name - property name
 * @param value - property value
 */
export function idl_defineConst(o: any, name: string, value: string | number | boolean): void {
  Object.defineProperty(o, name, 
    { writable: false, enumerable: true, configurable: false, value: value })
}
