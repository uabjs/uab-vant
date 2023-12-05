import { withInstall } from '../utils';
import _Popup from './Popup';

export const Popup = withInstall(_Popup);
export default Popup;
export { popupProps } from './Popup';
export type { PopupProps } from './Popup';
export type {
  PopupPosition,
  PopupInstance,
  PopupThemeVars,
  PopupCloseIconPosition,
} from './types';

// 给 vue 声明一个名为 VanPopup 的全局组件
declare module 'vue' {
  export interface GlobalComponents {
    VanPopup: typeof Popup;
  }
}
