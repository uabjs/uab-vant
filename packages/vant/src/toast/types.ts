import type { ComponentPublicInstance, TeleportProps } from 'vue';
// import type { LoadingType } from '../loading';
import type { Numeric } from '../utils';

/** 轻提示类型 */
export type ToastType = 'text' | 'loading' | 'success' | 'fail' | 'html';
/** 轻提示位置 */
export type ToastPosition = 'top' | 'middle' | 'bottom';
/** 轻提示文本换行方式 支持数字换行 */
export type ToastWordBreak = 'break-all' | 'break-word' | 'normal';

export type ToastOptions = {
  icon?: string; // 图标名称
  type?: ToastType; // 类型
  mask?: boolean;  // 是否显示遮罩层
  message?: Numeric; // 文本内容
  onClose?: () => void; // 关闭时的回调函数
  onOpened?: () => void; // 打开时的回调函数
  overlay?: boolean; // 是否显示背景遮罩层
  duration?: number; // 展示时长(ms)，值为 0 时，toast 不会消失
  teleport?: TeleportProps['to']; // 指定挂载的节点
  iconSize?: Numeric; // 图标大小
  position?: ToastPosition; // 位置
  className?: unknown; // 类名
  transition?: string; // 动画类名
  iconPrefix?: string; // 图标类名前缀
  wordBreak?: ToastWordBreak; // 文本换行方式
  loadingType?: string, // LoadingType; // 加载图标类型
  forbidClick?: boolean; // 是否禁止背景点击
  closeOnClick?: boolean; // 点击时是否关闭
  overlayClass?: unknown; // 遮罩层类名
  overlayStyle?: Record<string, any>; // 遮罩层样式
  closeOnClickOverlay?: boolean; // 点击遮罩层时是否关闭
}

export type ToastWrapperInstance = ComponentPublicInstance<
  { message: Numeric },
  {
    close: () => void; // 关闭
    /**
     * @private
     */
    open: (props: Record<string, any>) => void; // 打开
  }
>

/** Toast 的 css 主题变量 */
export type ToastThemeVars = {
  toastMaxWidth?: string; // toast最大宽度
  toastFontSize?: string; // toast字体大小
  toastTextColor?: string; // toast字体颜色
  toastLoadingIconColor?: string; // toast加载图标颜色
  toastLineHeight?: number | string; // toast行高
  toastRadius?: string; // toast圆角
  toastBackground?: string; // toast背景色
  toastIconSize?: string; // toast图标大小
  toastTextMinWidth?: string; // toast文本最小宽度
  toastTextPadding?: string; // toast文本内边距
  toastDefaultPadding?: string; // toast默认内边距
  toastDefaultWidth?: string; // toast默认宽度
  toastDefaultMinHeight?: string; // toast默认最小高度
  toastPositionTopDistance?: string; // toast顶部距离
  toastPositionBottomDistance?: string; // toast底部距离
};
