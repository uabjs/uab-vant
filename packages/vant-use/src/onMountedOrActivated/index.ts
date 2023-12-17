import { nextTick, onMounted, onActivated } from 'vue';

/** 在挂载时 或 在 keep-alive 缓存的进入钩子 activated 时都触发执行回调 */
export function onMountedOrActivated(hook: () => any) {
  let mounted: boolean;

  // 挂载时执行这里
  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    })
  })

  // 挂载后只执行 activated
  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}