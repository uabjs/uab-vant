import { getScrollParent, onMountedOrActivated } from "@vant/use";
import { Ref, watch, onBeforeUnmount, onDeactivated } from "vue";
import { useTouch } from "./use-touch";
import { preventDefault } from "../utils";

let totalLockCount = 0;

/** 给一个超出隐藏 */
const BODY_LOCK_CLASS = 'van-overflow-hidden';

/** 锁定页面滚动，原理就是给 document.body 添加一个 overflow: hidden !important; 属性并阻止滚动事件冒泡 */
export function useLockScroll(
  rootRef: Ref<HTMLElement | undefined>,
  shouldLock: () => boolean,
) {
  const touch = useTouch();
  const DIRECTION_UP = '01'; // 方向向上
  const DIRECTION_DOWN = '10'; // 方向向下

  /** 手指滑动触摸时 */
  const onTouchMove = (event: TouchEvent) => {
    // 计算滚动位置和方向
    touch.move(event);

    // 得到 上/下 方向
    const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
    // 获取父级的滚动节点
    const el = getScrollParent(
      event.target as Element,
      rootRef.value,
    ) as HTMLElement;
    const { scrollHeight, offsetHeight, scrollTop } = el;
    
    // 二进制状态码
    let status = '11';
    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01';
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10';
    }

    // 判断是竖直方向滚动时，阻止默认事件，阻止冒泡
    if (
      status !== '11' &&
      touch.isVertical() &&
      !(parseInt(status, 2) & parseInt(direction, 2))
    ) {
      // 阻止默认事件，阻止冒泡
      preventDefault(event, true);
    }
  }


  /** 监听 dom 手指的触摸事件 */
  const lock = () => {
    document.addEventListener('touchstart', touch.start);
    document.addEventListener('touchmove', onTouchMove, { passive: false }); // passive 表示该处理程序不会调用 preventDefault() 方法来阻止默认的滚动行为，这样浏览器就知道无需等待当前滚动操作完成就可以安全地执行下一个滚动操作，从而提高了滚动的流畅性

    if (!totalLockCount) {
      document.body.classList.add(BODY_LOCK_CLASS);
    }

    totalLockCount++
  }

  const unlock = () => {
    if (totalLockCount) {
      document.removeEventListener('touchstart', touch.start);
      document.removeEventListener('touchmove', onTouchMove);

      totalLockCount--;

      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  }

  // 挂载方法
  const init = () => shouldLock() && lock();

  // 卸载方法
  const destroy = () => shouldLock() && unlock();

  // 挂载 或 keep-alive 激活时执行
  onMountedOrActivated(init);
  //  keep-alive 卸载执行
  onDeactivated(destroy);
  // 卸载前执行
  onBeforeUnmount(destroy);

  watch(shouldLock, (value) => {
    value ? lock() : unlock();
  }) 
}