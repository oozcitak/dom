import { GlobalStore } from './GlobalStore'
export { DOMObjectCacheImpl } from './DOMObjectCacheImpl'
export { Cast } from './Cast'
export { Guard } from './Guard'
export { NodeCompareCache } from './NodeCompareCache'

// Export interfaces
import * as Interfaces from './interfaces'
export { GlobalStore }
export { Interfaces }

/**
 * Stores global variables.
 */
export const globalStore = GlobalStore.instance

/**
 * Applies the mixin to a given class.
 * 
 * @param baseClass - class to recieve te mixin
 * @param mixinClass - mixin class
 */
export function applyMixin(baseClass: any, mixinClass: any): void {
  Object.getOwnPropertyNames(mixinClass.prototype).forEach(name => {
    const propDesc = Object.getOwnPropertyDescriptor(mixinClass.prototype, name)
    /* istanbul ignore else */
    if (propDesc) {
      Object.defineProperty(baseClass.prototype, name, propDesc)
    }
  })
}

/**
 * Deep clones the given object.
 * 
 * @param obj - an object
 */
export function clone<T>(obj: T): T {
  if (isFunction(obj)) {
    return obj
  } else if (isArray(obj)) {
    const result: any = []
    for (const item of obj) {
      result.push(clone(item))
    }
    return result
  } else if (isObject(obj)) {
    const result: any = {}
    for (const [key, val] of Object.entries(obj)) {
      result[key] = clone(val)
    }
    return result
  } else {
    return obj
  }
}

/**
 * Type guard for boolean types
 * 
 * @param x - a variable to type check
 */
export function isBoolean(x: any): x is boolean {
  return typeof x === "boolean"
}

/**
 * Type guard for numeric types
 * 
 * @param x - a variable to type check
 */
export function isNumber(x: any): x is number {
  return typeof x === "number"
}

/**
 * Type guard for strings
 * 
 * @param x - a variable to type check
 */
export function isString(x: any): x is string {
  return typeof x === "string"
}

/**
 * Type guard for function objects
 * 
 * @param x - a variable to type check
 */
export function isFunction(x: any): x is Function {
  return !!x && Object.prototype.toString.call(x) === '[object Function]'
}

/**
 * Type guard for JS objects
 * 
 * _Note:_ Functions are objects too
 * 
 * @param x - a variable to type check
 */
export function isObject(x: any): x is { [key: string]: any } {
  const type = typeof x
  return !!x && (type === 'function' || type === 'object')
}

/**
 * Type guard for arrays
 * 
 * @param x - a variable to type check
 */
export function isArray(x: any): x is any[] {
  return Array.isArray(x)
}

/**
 * Determines if `x` is an empty Array or an Object with no own properties.
 * 
 * @param x - a variable to check
 */
export function isEmpty(x: any): boolean {
  if (isArray(x)) {
    return !x.length
  } else if (isObject(x)) {
    for(const key in x) {
      if(x.hasOwnProperty(key)) {
        return false
      }
    }    
    return true
  }

  return false
}
