import {
  Ref,
  watch,
  isRef,
  unref,
  onUnmounted,
  onDeactivated,
  type WatchStopHandle,
} from 'vue';
import { onMountedOrActivated } from '../onMountedOrActivated';
import { inBrowser } from '../utils';

/** 监听的目标元素类型，是 DOM 元素，或者是 Ref 包裹的 DOM 元素  */
type TargetRef = EventTarget | Ref<EventTarget | undefined>;

/** 事件监听器的选项 */
export type UseEventListenerOptions = {
  target?: TargetRef; // 监听的目标元素
  capture?: boolean; // 是否捕获
  passive?: boolean; // 是否被动，如果将 passive 设置为 true，则表示该处理程序不会调用 preventDefault() 方法来阻止默认的滚动行为，这样浏览器就知道无需等待当前滚动操作完成就可以安全地执行下一个滚动操作，从而提高了滚动的流畅性
};

/** 绑定事件监听的 use 方法 */
export function useEventListener<K extends keyof DocumentEventMap>(
  type: K, // 需要监听的事件类型
  listener: (event: DocumentEventMap[K]) => void,
  options?: UseEventListenerOptions,
): () => void;
export function useEventListener(
  type: string,
  listener: EventListener,
  options?: UseEventListenerOptions,
): () => void;
export function useEventListener(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {},
) {
  // 当前不是浏览器环境就退出
  if (!inBrowser) {
    return;
  }

  const { target = window, passive = false, capture = false } = options;
  let cleaned = false; // 是否已经清理了事件侦听器
  let attached: boolean; // 是否已经添加了事件侦听器

  /** 添加监听 */
  const add = (target: TargetRef) => {
    if (cleaned) {
      return;
    }
    const element = unref(target); // 解构出目标元素
    if (element && !attached) {
      element.addEventListener(type, listener, {
        capture,
        passive,
      });
      attached = true;
    }
  }

  /** 移除监听 */
  const remove = (target?: TargetRef) => {
    if (cleaned) {
      return;
    }
    const element = unref(target); // 解构出目标元素
    if (element && attached) {
      element.removeEventListener(type, listener, capture);
      attached = false;
    }
  }

  // 卸载的时候移除监听
  onUnmounted(() => remove(target));
  // keep-alive 缓存的进入钩子 deactivated 时移除监听
  onDeactivated(() => remove(target));
  // 挂载的时候添加监听
  onMountedOrActivated(() => add(target));

  let stopWatch: WatchStopHandle;
  if (isRef(target)) {
    // 元素改变则移除监听事件，重新给新元素添加监听事件
    stopWatch = watch(target, (val, oldVal) => {
      remove(oldVal);
      add(val);
    });
  }

   /** 返回函数用于清理事件侦听器，需要卸载时调用 */
   return () => {
    stopWatch?.();
    remove(target);
    cleaned = true;
  };
}