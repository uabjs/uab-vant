import { ExtractPropTypes, Teleport, defineComponent, ref } from "vue";
import { createNamespace, extend, makeStringProp } from "../utils";
import { popupSharedProps } from "./shared";
import { PopupCloseIconPosition, PopupPosition } from "./types";

// Components
import { Overlay } from '../overlay';

// Composables
// import { useLazyRender } from '../composables/use-lazy-render';


export const popupProps = extend({}, popupSharedProps, {
  round: Boolean, // 是否显示圆角
  position: makeStringProp<PopupPosition>('center'), // 默认 center 居中
  closeIcon: makeStringProp('cross'), // 关闭图标默认是 cross
  closeable: Boolean, // 是否显示关闭图标
  transition: String, // 弹出层动画类名，等价于 transition 的 name 属性
  iconPrefix: String, // 图标类名前缀
  closeOnPopstate: Boolean, // 是否在页面回退时自动关闭
  closeIconPosition: makeStringProp<PopupCloseIconPosition>('top-right'), // 关闭图标位置，默认是 top-right
  safeAreaInsetTop: Boolean, // 是否开启顶部安全区适配
  safeAreaInsetBottom: Boolean, // 是否开启底部安全区适配
})

export type PopupProps = ExtractPropTypes<typeof popupProps>;

const [name, bem] = createNamespace('popup');

export default defineComponent({
  name,

  inheritAttrs: false,

  props: popupProps,

  emits: [
    'open',
    'close',
    'opened',
    'closed',
    'keydown',
    'update:show',
    'clickOverlay',
    'clickCloseIcon',
  ],
  setup(props, { emit, slots }) {
    let opened: boolean;
    let shouldReopen: boolean;

    const zIndex = ref<number>();
    const popupRef = ref<HTMLElement>();

    // const lazyRender = useLazyRender(() => props.show || !props.lazyRender);

    const renderOverlay = () => {
      if (props.overlay) {
        return (
          <Overlay
            v-slots={{ default: slots['overlay-content'] }}
            show={props.show}
            class={props.overlayClass}
            zIndex={zIndex.value}
            duration={props.duration}
            customStyle={props.overlayStyle}
            role={props.closeOnClickOverlay ? 'button' : undefined}
            tabindex={props.closeOnClickOverlay ? 0 : undefined}
            {...useScopeId()}
            onClick={onClickOverlay}
          />
        )
      }
    }

    return () => {
      if (props.teleport) {
        return (
          <Teleport to={props.teleport}>
            {/* 覆盖层 */}
            {renderOverlay()}
            {/* 弹窗层 */}
            {renderTransition()}
          </Teleport>
        )
      }

      return (
        <>
          {renderOverlay()}
          {renderTransition()}
        </>
      )
    }
  }
})