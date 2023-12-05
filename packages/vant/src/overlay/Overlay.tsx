import { CSSProperties, ExtractPropTypes, PropType, Transition, defineComponent, ref } from "vue";
import { createNamespace, extend, getZIndexStyle, isDef, numericProp, preventDefault, truthProp, unknownProp } from "../utils";
import { useEventListener } from "@vant/use";
import { useLazyRender } from "../composables/use-lazy-render";


const [name, bem] = createNamespace('overlay');

export const overlayProps = {
  show: Boolean, // 是否显示遮罩层
  zIndex: numericProp, // z-index 层级
  duration: numericProp, // 动画时长
  className: unknownProp, // 自定义类名
  lockScroll: truthProp, // 是否锁定背景滚动 默认为 true
  lazyRender: truthProp, // 是否在显示时才渲染节点
  customStyle: Object as PropType<CSSProperties>,
};


export type OverlayProps = ExtractPropTypes<typeof overlayProps>;

export default defineComponent({
  name,

  props: overlayProps,

  setup(props, { slots }) {
    const root = ref<HTMLElement>();
    // 使用懒渲染，只有在显示时才渲染节点
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);

    // 返回的 renderOverlay 函数用到了 useLazyRender 里面的 inited 响应式变量
    // 当 inited 为 true 时，会重新执行 renderOverlay 函数渲染节点
    const renderOverlay = lazyRender(() => {
      // 渲染样式
      const style: CSSProperties = extend(
        getZIndexStyle(props.zIndex),
        props.customStyle,
      );


      // 渲染过度时间 通过 css 的 animationDuration 来实现
      if (isDef(props.duration)) {
        style.animationDuration = `${props.duration}s`;
      }

      return (
        <div
          v-show={props.show}
          ref={root}
          style={style}
          class={[bem(), props.className]}
        >
          {slots.default?.()}
        </div>
      )
    })

    // 触摸遮罩层时阻止默认事件 用于阻止滚动
    const onTouchMove = (event: TouchEvent) => {
      if (props.lockScroll) {
        preventDefault(event, true);
      }
    };

    // useEventListener 将 passive 设置为 false 以消除 Chrome 的警告
    // 当一个滚动处理程序被注册时，浏览器通常会等待它完成前一次滚动操作并返回之后才开始下一次滚动操作，这会导致页面的卡顿和不流畅的滚动表现。
    // 如果将 passive 设置为 true，则表示该处理程序不会调用 preventDefault() 方法来阻止默认的滚动行为，这样浏览器就知道无需等待当前滚动操作完成就可以安全地执行下一个滚动操作，从而提高了滚动的流畅性
    useEventListener('touchmove', onTouchMove, {
      target: root, // 监听的目标
    });

    return () => (
      <Transition v-slots={{ default: renderOverlay }} name="van-fade" appear />
    )
  }
})