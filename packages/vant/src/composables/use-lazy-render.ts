import { WatchSource, ref, watch } from "vue";


/** 监听 show 变化, show = true 时就渲染 */
export function useLazyRender(show: WatchSource<boolean | undefined>) {
  const inited = ref(false);

  watch(
    show, // 监听 show 变化
    (value) => {
      if (value) { // 如果 show 为 true
        inited.value = value; // inited 为 true
      }
    },
    { immediate: true }, // 立即执行
  )

  // 传入 render 函数，渲染组件
  return (render: () => JSX.Element) => () => (inited.value ? render() : null);
}