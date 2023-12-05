import type { ComponentPublicInstance, Ref } from "vue";
import type { PopupProps } from './Popup';

/** 弹出位置 */
export type PopupPosition = 'top' | 'left' | 'bottom' | 'right' | 'center' | '';

/** 弹出关闭图标位置 */
export type PopupCloseIconPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';


/** 弹出框实例 */
export type PopupExpose = {
  popupRef: Ref<HTMLElement>;
};

/** 弹出框组件公共实例 */
export type PopupInstance = ComponentPublicInstance<PopupProps, PopupExpose>;

/** 弹出框 css 主题变量 */
export type PopupThemeVars = {
  popupBackground?: string;
  popupTransition?: string;
  popupRoundRadius?: string;
  popupCloseIconSize?: string;
  popupCloseIconColor?: string;
  popupCloseIconMargin?: string;
  popupCloseIconZIndex?: number | string;
};
