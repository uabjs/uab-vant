import { CSSProperties, PropType, TeleportProps } from "vue";
import { numericProp, truthProp, unknownProp } from "../utils";
import { Interceptor } from "../utils/interceptor";

/** 弹出层共享的属性 */
export const popupSharedProps = {
  // 是否显示弹出窗口
  show: Boolean,
  // z-index 高度
  zIndex: numericProp,
  // 空白处是否显示黑色覆盖层
  overlay: truthProp,
  // 弹窗过渡持续时间
  duration: numericProp,
  // teleport 传送
  teleport: [String, Object] as PropType<TeleportProps['to']>,
  // 防止正文滚动
  lockScroll: truthProp,
  // 是否延迟渲染
  lazyRender: truthProp,
  // 关闭前的回调函数
  beforeClose: Function as PropType<Interceptor>,
  // 覆盖层自定义样式
  overlayStyle: Object as PropType<CSSProperties>,
  // 覆盖层自定义类名
  overlayClass: unknownProp,
  // 初始渲染动画
  transitionAppear: Boolean,
  // 单击覆盖层时是否关闭弹出窗口
  closeOnClickOverlay: truthProp,
}

/** 弹出层共享的属性的 key 数组类型 */
export type PopupSharedPropKeys = Array<keyof typeof popupSharedProps>;

/** 弹出层共享的属性的 key 数组 */
export const popupSharedPropKeys = Object.keys(
  popupSharedProps,
) as PopupSharedPropKeys;
