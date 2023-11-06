import { getCurrentInstance } from 'vue';
import { extend } from '../utils';

/** 将参数放到 vue 组件实例的 proxy 上，后续可以通过 proxy 取值 */
export function useExpose<T = Record<string, any>>(apis: T) {
  const instance = getCurrentInstance();
  if (instance) {
    extend(instance.proxy as object, apis)
  }
}