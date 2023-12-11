import { watch, ExtractPropTypes, PropType, TeleportProps, defineComponent, onMounted, onUnmounted } from 'vue';

// Utils
import { createNamespace, isDef, makeNumberProp, makeStringProp, numericProp, pick, unknownProp } from '../utils';
import { lockClick } from './lock-click';

// Components
import { Icon } from '../icon';
import { Popup } from '../popup';
// import { Loading, LoadingType } from '../loading';

// Types
import type { ToastType, ToastPosition, ToastWordBreak } from './types';


const [name, bem] = createNamespace('toast');

/** popup 组件继承的 toastProps 属性 */
const popupInheritProps = [
  'show', // 是否显示
  'overlay', // 是否显示遮罩层
  'teleport', // 指定挂载的节点
  'transition', // 动画类名
  'overlayClass', // 遮罩层类名
  'overlayStyle', // 遮罩层样式
  'closeOnClickOverlay', // 点击遮罩层是否关闭
] as const;

export const toastProps = {
  icon: String, // 图标名称或图片链接，可选值见 Icon 组件
  show: Boolean, // 是否显示
  type: makeStringProp<ToastType>('text'), // 类型
  overlay: Boolean, // 是否显示遮罩层
  message: numericProp, // 文本内容
  iconSize: numericProp, // 图标大小，默认单位为 px
  duration: makeNumberProp(2000), // 展示时长(ms)，值为 0 时，toast 不会消失  
  position: makeStringProp<ToastPosition>('middle'), // 位置，默认居中
  teleport: [String, Object] as PropType<TeleportProps['to']>, // 指定挂载的节点
  wordBreak: String as PropType<ToastWordBreak>, // 文本换行方式，可选值为 all none
  className: unknownProp, // 类名
  iconPrefix: String, // 图标类名前缀
  transition: makeStringProp('van-fade'), // 动画类名
  loadingType: String, // String as PropType<LoadingType>, // 加载图标类型
  forbidClick: Boolean, // 是否禁止背景点击
  overlayClass: unknownProp, // 遮罩层类名
  overlayStyle: Object, // Object as PropType<CSSProperties>,  // 遮罩层样式
  closeOnClick: Boolean, // 点击时是否关闭
  closeOnClickOverlay: Boolean, // 点击遮罩层是否关闭
}


export type ToastProps = ExtractPropTypes<typeof toastProps>;

export default defineComponent({
  name,

  props: toastProps,

  emits: ['update:show'],

  setup(props, { emit, slots }) {
    let timer: ReturnType<typeof setTimeout>;
    let clickable = false; // 可点击的

    /** 锁定单击， clickable = true 表示已锁定，不需要再次锁定 */
    const toggleClickable = () => {
      const newValue = props.show && props.forbidClick;
      if (clickable !== newValue) {
        clickable = newValue;
        lockClick(clickable);
      }
    }

    // 改变 v-model:show 属性的值
    const updateShow = (show: boolean) => emit('update:show', show);

    /** 单击时关闭 */
    const onClick = () => {
      if (props.closeOnClick) {
        updateShow(false);
      }
    }

    const clearTimer = () => clearTimeout(timer);

    /** 渲染图标内容 */
    const renderIcon = () => {
      const { icon, type, iconSize, iconPrefix, loadingType } = props;
      const hasIcon = icon || type === 'success' || type === 'fail';
      
      // 成功或失败图标
      if (hasIcon) {
        return (
          <Icon
            name={icon || type}
            size={iconSize}
            class={bem('icon')}
            classPrefix={iconPrefix}
          />
        )
      }

      // 加载旋转图标
      if (type === 'loading') {
        return (
          <div>Loading...</div>
          // <Loading class={bem('loading')} size={iconSize} type={loadingType} />
        );
      }
    }

    /** 渲染文本内容 */
    const renderMessage = () => {
      const { type, message } = props;

      if (slots.message) {
        return <div class={bem('text')}>{slots.message()}</div>;
      }

      if (isDef(message) && message !== '') {
        return type === 'html' ? (
          <div key={0} class={bem('text')} innerHTML={String(message)} />
        ) : (
          <div class={bem('text')}>{message}</div>
        )
      }
    }


    // 监听 props.show 和 props.forbidClick 的变化进行动态锁定点击
    watch(() => [props.show, props.forbidClick], toggleClickable);

    // 监听 props.show 和 props.duration 的变化，当 props.show 为 true 且 props.duration 大于 0 时，设置定时器
    watch(
      () => [props.show, props.type, props.message, props.duration],
      () => {
        clearTimer();
        if (props.show && props.duration > 0) {
          timer = setTimeout(() => {
            updateShow(false); // 定时器到了就关闭弹窗
          }, props.duration);
        }
      },
    );

    onMounted(toggleClickable);
    onUnmounted(toggleClickable);

    return () => (
      <Popup
        class={[
          bem([
            props.position, // 弹出位置
            props.wordBreak === 'normal' ? 'break-normal' : props.wordBreak, // 换行
            { [props.type]: !props.icon }, // 弹窗内容类型
          ]),
          props.className, // 类名
        ]}
        lockScroll={false} // 锁定滚动
        onClick={onClick} // 点击事件
        onClosed={clearTimer} // 关闭事件
        onUpdate:show={updateShow} // 更新事件
        {...pick(props, popupInheritProps)} // popup 组件继承的 toastProps 属性
      >
        {renderIcon()}
        {renderMessage()}
      </Popup>
    )
  }
})