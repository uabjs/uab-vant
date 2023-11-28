import { ref, Ref, onBeforeUpdate } from 'vue';

/** 使用一个 ref([]) 数组存储数据 */
export function useRefs<T = Element>() {
  const refs = ref([]) as Ref<T[]>;
  const cache: Array<(el: unknown) => void> = [];

  // 更新前重置 refs
  onBeforeUpdate(() => {
    refs.value = []
  });

  // 设置 refs
  const setRefs = (index: number) => {
    if (!cache[index]) {
      cache[index] = (el: unknown) => {
        refs.value[index] = el as T;
      }
    }
    return cache[index];
  }

  return [refs, setRefs] as const;
}