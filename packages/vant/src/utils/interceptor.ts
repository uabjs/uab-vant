import { noop, isPromise } from './basic';


/** 拦截器函数 返回 boolean ｜ Promise ｜ undefined  */
export type Interceptor = (...args: any[]) => boolean | Promise<boolean> | undefined;

/** 拦截器, 执行传入回调返回成功后执行 done 方法 */
export function callInterceptor(
  interceptor: Interceptor | undefined,
  {
    args = [],
    done, // 拦截器返回成功执行的函数
    canceled, // 拦截器返回取消执行的函数
    error, // 拦截器返回错误执行的函数
  } : {
    args?: unknown[],
    done: () => void,
    canceled?: () => void,
    error?: () => void,
  }
) {
  if (interceptor) {
    const returnVal = interceptor.apply(null, args);

    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) {
            done(); // Promise 返回成功执行
          } else if (canceled) {
            canceled(); // Promise 返回空执行
          }
        })
        .catch(error || noop) // Promise 返回错误执行
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}