import {
  defineComponent,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes,
} from 'vue';

// Utils
import {
  isDef,
  extend,
  truthProp,
  unknownProp,
  numericProp,
  makeStringProp,
  createNamespace,
} from '../utils';

// Composables
import { useRoute, routeProps } from '../composables/use-route';

// Components
import { Icon } from '../icon';

const [name, bem] = createNamespace('cell');

// 单元格大小
export type CellSize = 'normal' | 'large';

// 箭头方向可选值
export type CellArrowDirection = 'up' | 'down' | 'left' | 'right';

// 单元格共享的参数
export const cellSharedProps = {
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  icon: String, // 左侧图标名称或图片链接
  size: String as PropType<CellSize>, // 单元格大小
  title: numericProp, // 左侧标题
  value: numericProp, // 右侧内容
  label: numericProp, // 标题下方的描述信息
  center: Boolean, // 是否使内容垂直居中
  isLink: Boolean, // 是否展示右侧箭头并开启点击反馈
  border: truthProp, // 是否显示内边框
  required: Boolean, // 是否显示表单必填星号
  iconPrefix: String, // 图标类名前缀，同 Icon 组件的 class-prefix 属性
  valueClass: unknownProp, // 右侧内容额外类名
  labelClass: unknownProp, //	描述信息额外类名
  titleClass: unknownProp, // 左侧标题额外类名
  titleStyle: null as unknown as PropType<string | CSSProperties>, // 左侧标题额外样式
  arrowDirection: String as PropType<CellArrowDirection>, // 箭头方向
  clickable: { // 是否开启点击反馈
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
}

// cell 的属性除了 cellSharedProps 还可以是路由的属性 { to, url, replace }
export const cellProps = extend({}, cellSharedProps, routeProps);

export type CellProps = ExtractPropTypes<typeof cellProps>;

export default defineComponent({
  name,
  props: cellProps,
  setup(props, { slots }) {
    const route = useRoute();

    // 单元格左侧标题下面的描述信息
    const renderLabel = () => {
      const showLabel = slots.label || isDef(props.label)
      if (showLabel) {
        return (
          <div class={[bem('label'), props.labelClass]}>
            {slots.label ? slots.label() : props.label}
          </div>
        )
      }
    }

    // 单元格左侧标题
    const renderTitle = () => {
      if (slots.title || isDef(props.title)) {
        const titleSlot = slots.title?.();

        // Allow Field to dynamically set empty label
        // https://github.com/youzan/vant/issues/11368
        if (Array.isArray(titleSlot) && titleSlot.length === 0) {
          return;
        }

        return (
          <div
            class={[bem('title'), props.titleClass]}
            style={props.titleStyle}
          >
            {/* 有 title 插槽使用插槽，没有则使用标题属性 */}
            {titleSlot || <span>{props.title}</span>}
            {renderLabel()}
          </div>
        );
      }
    };

    const renderValue = () => {
      // Slots.default是slots.value的别名
      const slot = slots.value || slots.default
      const hasValue = slot || isDef(props.value)

      // 存在默认插槽取默认，不存在取 props参数里面的 value
      if (hasValue) {
        return (
          <div class={[bem('value'), props.valueClass]}>
            { slot ? slot() : <span>{props.value}</span> }
          </div>
        )
      }
    }

    // 单元格左侧图标
    const renderLeftIcon = () => {
      if (slots.icon) {
        return slots.icon()
      }

      if (props.icon) {
        return (
          <Icon
            name={props.icon}
            class={bem('left-icon')}
            classPrefix={props.iconPrefix}
          />
        );
      }
    }

    // 单元格右侧的图标
    const renderRightIcon = () => {
      // 存在右侧图标的插槽就直接渲染插槽
      if (slots['right-icon']) {
        return slots['right-icon']()
      }

      // 开启点击反馈默认显示监听图标
      if (props.isLink) {
        const name = props.arrowDirection && props.arrowDirection !== 'right'
          ? `arrow-${props.arrowDirection}`
          : `arrow`
        
        return <Icon name={name} class={bem('right-icon')} />
      }
    }


    return () => {
      const { tag, size, center, border, isLink, required } = props;
      const clickable = props.clickable ?? isLink;

      const classes: Record<string, boolean | undefined> = {
        center,
        required,
        clickable,
        borderless: !border,
      }

      if (size) {
        classes[size] = !!size
      }

      return (
        <tag
          class={bem(classes)}
          role={clickable ? 'button' : undefined}
          tabindex={clickable ? 0 : undefined}
          onClick={route}
        >
          {renderLeftIcon()}
          {renderTitle()}
          {renderValue()}
          {renderRightIcon()}
          {slots.extra?.()}
        </tag>
      )
    }
  }
})