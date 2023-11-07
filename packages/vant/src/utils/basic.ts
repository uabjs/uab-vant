// 基本的方法
export const extend = Object.assign;

/** 是浏览器 */
export const inBrowser = typeof window !== 'undefined';

export type Numeric = number | string;

/** 是数字 */
export const isNumeric = (val: Numeric): val is string =>
  typeof val === 'number' || /^\d+(\.\d+)?$/.test(val);

/** 是对象 */
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

/** 是定义的变量 */
export const isDef = <T>(val: T): val is NonNullable<T> =>
  val !== undefined && val !== null;

  
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function => typeof val === 'function';


export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)


/** 取对象深处的某个值，不报错 */
export function get(object: any, path: string): any {
  const keys = path.split('.');
  let result = object;

  keys.forEach((key) => {
    result = isObject(result) ? result[key] ?? '' : '';
  });

  return result;
}