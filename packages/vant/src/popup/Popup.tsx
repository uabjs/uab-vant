import { CSSProperties, ExtractPropTypes, Teleport, Transition, computed, defineComponent, nextTick, onActivated, onDeactivated, onMounted, provide, ref, watch } from "vue";
import { HAPTICS_FEEDBACK, createNamespace, extend, isDef, makeStringProp } from "../utils";
import { popupSharedProps } from "./shared";
import { PopupCloseIconPosition, PopupPosition } from "./types";

// Components
import { useLazyRender } from "../composables/use-lazy-render";
import { callInterceptor } from "../utils/interceptor";
import { useGlobalZIndex } from "../composables/use-global-z-index";
import { useScopeId } from '../composables/use-scope-id';

// Components
import Icon from "../icon/Icon";
import { Overlay } from '../overlay';
import { useExpose } from "../composables/use-expose";
import { useEventListener } from "@vant/use";
import { POPUP_TOGGLE_KEY } from "../composables/on-popup-reopen";
import { useLockScroll } from "../composables/use-lock-scroll";


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
  setup(props, { emit, attrs, slots }) {
    let opened: boolean; // 是否打开
    let shouldReopen: boolean; // 是否重新打开

    const zIndex = ref<number>();
    const popupRef = ref<HTMLElement>();

    // 使用懒渲染，只有在显示时才执行 lazyRender(fn) 的 fn 函数渲染节点
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);

    const style = computed(() => {
      const style: CSSProperties = {
        zIndex: zIndex.value,
      };

      if (isDef(props.duration)) {
        const key =
          props.position === 'center'
            ? 'animationDuration' // 居中时使用 animationDuration 动画
            : 'transitionDuration'; // 其他情况使用 transitionDuration 过度效果

        style[key] = `${props.duration}s`;
      }

      return style;
    })

    /** 打开弹窗 */
    const open = () => {
      if (!opened) {
        opened = true;
        zIndex.value = props.zIndex !== undefined ? +props.zIndex : useGlobalZIndex(); // useGlobalZIndex 获取全局最大的 z-index 层级，确保弹窗层级最高
        emit('open')
      }
    }

    /** 关闭弹窗 */
    const close = () => {
      if (opened) {
        // 拦截器模式：关闭前执行 beforeClose 钩子函数
        callInterceptor(props.beforeClose, {
          done() {
            opened = false;
            emit('close'); // 关闭弹窗时抛出 close 事件
            emit('update:show', false); // 将 show 属性设置为 false
          }
        })
      }
    }

    /** 点击遮罩层触发的事件 */
    const onClickOverlay = (event: MouseEvent) => {
      emit('clickOverlay', event); // 点击遮罩层时抛出事件
      if (props.closeOnClickOverlay) {
        close(); // 关闭弹窗
      }
    }

    /** 遮罩层 */
    const renderOverlay = () => {
      if (props.overlay) {
        return (
          <Overlay
            v-slots={{ default: slots['overlay-content'] }}  // 遮罩层的内容 插槽
            show={props.show}
            class={props.overlayClass} // 覆盖层类名
            zIndex={zIndex.value} // 覆盖层层级
            duration={props.duration} // 覆盖层动画时长
            customStyle={props.overlayStyle} // 覆盖层样式
            role={props.closeOnClickOverlay ? 'button' : undefined} // 覆盖层的 role 属性 默认是 button 用于键盘无障碍操作
            tabindex={props.closeOnClickOverlay ? 0 : undefined} // 覆盖层的 tabindex 属性 默认是 0 用于键盘无障碍操作
            {...useScopeId()}
            onClick={onClickOverlay}
          />
        )
      }
    }

    /** 点击弹窗关闭按钮抛出 clickCloseIcon 事件 */
    const onClickCloseIcon = (event: MouseEvent) => {
      emit('clickCloseIcon', event);
      close();
    };

    const renderCloseIcon = () => {
      if (props.closeable) {
        return (
          <Icon
            role="button" // 用于网页无障碍操作
            tabindex={0} // 用于键盘无障碍操作
            name={props.closeIcon} // 关闭图标
            class={[
              bem('close-icon', props.closeIconPosition),
              HAPTICS_FEEDBACK, // 触觉反馈
            ]}
            classPrefix={props.iconPrefix}
            onClick={onClickCloseIcon}
          />
        );
      }
    }

    // 使用 setTimeout 的原因当您将：duration=“0”和position=“bottom”属性添加到弹出组件时，该组件的打开功能将在首次打开弹出时触发两次。
    let timer: ReturnType<typeof setTimeout> | null;
    // 过渡动画开始后触发
    const onOpened = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        emit('opened');
      });
    };
    // 过渡动画结束后触发
    const onClosed = () => emit('closed'); // 关闭弹窗后抛出 closed 事件
    const onKeydown = (event: KeyboardEvent) => emit('keydown', event); // 键盘按下时抛出 keydown 事件

    const renderPopup = lazyRender(() => {
      const { round, position, safeAreaInsetTop, safeAreaInsetBottom } = props;

      return (
        <div
          v-show={props.show}
          ref={popupRef}
          style={style.value}
          role="dialog" // 用于键盘无障碍操作
          tabindex={0} // 用于键盘无障碍操作
          class={[
            bem({ // 类名 van-popup van-popup--round van-popup--bottom
              round,
              [position]: position,
            }),
            {
              'van-safe-area-top': safeAreaInsetTop, // 顶部安全区适配
              'van-safe-area-bottom': safeAreaInsetBottom, // 底部安全区适配
            },
          ]}
          onKeydown={onKeydown} // 键盘按下时触发
          {...attrs} // 兜底 style 等属性
          {...useScopeId()} // scopeId 值
        >
          {slots.default?.()}
          {renderCloseIcon()}
        </div>
      )
    })


    const renderTransition = () => {
      // position: 位置，transition: 动画类名，transitionAppear: 是否在初始渲染时启用过渡动画
      const { position, transition, transitionAppear } = props;
      const name = position === 'center' ? 'van-fade' : `van-popup-slide-${position}`;

      // name 是 van-popup-slide-bottom
      // 传递给 Transition 组件会默认生成 van-popup-slide-bottom-enter-active 和 van-popup-slide-bottom-leave-active 动画 class 属性
      // Transition 组件用法：插槽 slots 子组件由 v-if，v-show 所触发切换的动画 class 属性， 动画完成之后才会执行 v-if v-show 的更新 dom 逻辑

      return (
        <Transition
          v-slots={{ default: renderPopup }}
          name={transition || name}
          appear={transitionAppear} // 是否在首次初始渲染时启用过渡动画 默认是 false
          onAfterEnter={onOpened} // 过渡动画开始后触发
          onAfterLeave={onClosed} // 过渡动画结束后触发
        />
      )
    }

    // 监听 show 属性的变化显示弹窗
    watch(
      () => props.show,
      (show) => {
        if (show && !opened) {
          open();

          // 当 tabindex 属性为 0 时，元素可以被聚焦到
          if (attrs.tabindex === 0) {
            nextTick(() => { // nextTick: 等待下一次 DOM 更新后执行
              popupRef.value?.focus(); // 聚焦到弹窗上
            });
          }
        }
        if (!show && opened) {
          opened = false;
          emit('close');
        }
      },
    );


    // 导出给外部使用的方法
    useExpose({ popupRef });

    // 弹窗显示时，锁定页面滚动
    useLockScroll(popupRef, () => props.show && props.lockScroll);


    // 监听页面回退事件关闭弹窗
    useEventListener('popstate', () => {
      if (props.closeOnPopstate) {
        close();
        shouldReopen = false;
      }
    });

    // 第一次挂载后打开弹窗
    onMounted(() => {
      if (props.show) {
        open();
      }
    });


    // keep-alive 组件激活时重新打开弹窗
    onActivated(() => {
      if (shouldReopen) {
        emit('update:show', true);
        shouldReopen = false;
      }
    });

    // keep-alive 组件停用时关闭弹窗（通过 shouldReopen 标记，启用时重新打开弹窗）
    onDeactivated(() => {
      // 隐形传送弹出窗口应在停用时关闭
      if (props.show && props.teleport) {
        close();
        shouldReopen = true;
      }
    });

    // 提供给所有子组件的方法， 关闭弹窗
    provide(POPUP_TOGGLE_KEY, () => props.show);

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