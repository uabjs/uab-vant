import { withInstall } from '../utils';
import _Toast from './Toast';

export const Toast = withInstall(_Toast);
export default Toast;
export { toastProps } from './Toast';
export {
  showToast,
  closeToast,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  allowMultipleToast,
  setToastDefaultOptions,
  resetToastDefaultOptions,
} from './function-call';

export type { ToastProps } from './Toast';
export type {
  ToastType,
  ToastOptions,
  ToastPosition,
  ToastThemeVars,
  ToastWordBreak,
  ToastWrapperInstance,
} from './types';


// 是声明一个名为 VanToast 的 Vue 全局组件。
declare module 'vue' {
  export interface GlobalComponents {
    VanToast: typeof Toast;
  }
}