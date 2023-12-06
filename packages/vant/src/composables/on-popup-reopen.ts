import { inject, InjectionKey, watch } from 'vue';

// eslint-disable-next-line
export const POPUP_TOGGLE_KEY: InjectionKey<() => boolean> = Symbol();

/** 获取当前 Popup 弹窗打开/关闭方法 */
export function onPopupReopen(callback: () => void) {
  const popupToggleStatus = inject(POPUP_TOGGLE_KEY, null);

  if (popupToggleStatus) {
    watch(popupToggleStatus, (show) => {
      if (show) {
        callback();
      }
    });
  }
}
