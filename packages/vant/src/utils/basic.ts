
/** 空函数 */
export function noop() {}

/** Object.assign 继承 */
export const extend = Object.assign;

/** 是浏览器 */
export const inBrowser = typeof window !== 'undefined';

/** 数字 或 字符串 */
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


export const isIOS = (): boolean =>
  inBrowser
    ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    : false;

/** 取对象深处的某个值，不报错 */
export function get(object: any, path: string): any {
  const keys = path.split('.');
  let result = object;

  keys.forEach((key) => {
    result = isObject(result) ? result[key] ?? '' : '';
  });

  return result;
}

/** 字符串转数组 */
export const toArray = <T>(item: T | T[]): T[] => {
  return Array.isArray(item) ? item : [item];
}

// 把只读属性变成可写
export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

// 从对象中取出指定的属性
export function pick<T, U extends keyof T>(
  obj: T,
  keys: ReadonlyArray<U>,
  ignoreUndefined?: boolean, // 是否忽略 undefined, true: 忽略, false: 不忽略
) {
  return keys.reduce(
    (ret, key) => {
      if (!ignoreUndefined || obj[key] !== undefined) {
        ret[key] = obj[key];
      }
      return ret;
    },
    {} as Writeable<Pick<T, U>>,
  )
}