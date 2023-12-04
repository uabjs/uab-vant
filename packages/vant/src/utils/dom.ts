import { isIOS as checkIsIOS } from './basic';

export type ScrollElement = Element | Window;

export const stopPropagation = (event: Event) => event.stopPropagation();

/** 阻止默认事件，阻止冒泡 */
export function preventDefault(event: Event, isStopPropagation?: boolean) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

/** 设置滚动条的高度 */
export function setScrollTop(el: ScrollElement, value: number) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}


/** 获取滚动条距离页面顶部的高度 */
export function getRootScrollTop(): number {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}


/** 设置页面滚动条的高度 */
export function setRootScrollTop(value: number) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}


const isIOS = checkIsIOS();

// iOS12页面滚动的破解
// see: https://developers.weixin.qq.com/community/develop/doc/00044ae90742f8c82fb78fcae56800
export function resetScroll() {
  if (isIOS) {
    setRootScrollTop(getRootScrollTop());
  }
}