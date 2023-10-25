import {
  defineComponent,
  type CSSProperties,
  type ExtractPropTypes,
} from 'vue';

// 一些公用的方法
import {
  extend,
  numericProp,
  makeStringProp, 
  createNamespace,
  BORDER_SURROUND,
} from "../utils";

// button 组件的类型
import {
  ButtonSize,
  ButtonType,
  ButtonNativeType,
  ButtonIconPosition,
} from './types';

const [name, bem] = createNamespace('button');

export const buttonProps = extend({}, {
  tag: makeStringProp<keyof HTMLElementTagNameMap>('button'),
  text: String,
  icon: String,
  type: makeStringProp<ButtonType>('default'),
  size: makeStringProp<ButtonSize>('normal'),
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  nativeType: makeStringProp<ButtonNativeType>('button'),
  loadingSize: numericProp,
  loadingText: String,
  loadingType: String,
  iconPosition: makeStringProp<ButtonIconPosition>('left'),
})

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export default defineComponent({
  name,
  props: buttonProps,
  emits: ['click'],
  setup(props, { slots, emit }) {

    const renderLoadingIcon = () => {
      if (slots.loading) {
        return slots.loading()
      }

      return (
        <div>...</div>
      )
    }

    const renderIcon = () => {
      if (props.loading) {
        return renderLoadingIcon()
      }

      if (slots.icon) {
        return <div class='icon'>{slots.icon()}</div>;
      }

      if (props.icon) {
        return (
          <div>icon</div>
        )
      }
    }

    const renderText = () => {
      let text;

      // 如果在 loading 按钮的文字就显示 loading 文字
      if (props.loading) {
        text = props.loadingText
      } else {
        text = slots.default ? slots.default() : props.text;
      }

      if (text) {
        return <span class={bem('text')}>{text}</span>
      }
    }

    const getStyle = () => {
      const { color, plain } = props
      if (color) {
        const style: CSSProperties = {
          color: plain ? color : 'white'
        }

        // 不是朴素按钮 button 背景取 color
        if (!plain) {
          style.background = color
        }

        // 当颜色为线性渐变时隐藏边框
        if (color.includes('gradient')) {
          style.border = 0;
        } else {
          style.borderColor = color
        }

        return style;
      }
    }

    const onClick = (event: MouseEvent) => {
      emit('click', event);
    };

    return () => {
      const { 
        tag,
        type,
        size,
        plain,
        block,
        round,
        square,
        loading,
        disabled,
        hairline,
        nativeType,
        iconPosition,
      } = props

      // 通过属性得到需要使用的 class 样式
      const classes = [
        bem([
          type,
          size,
          {
            plain,
            block,
            round,
            square,
            loading,
            disabled,
            hairline,
          }
        ]),
        // 使用 0.5px 边框
        { [BORDER_SURROUND]: hairline },
      ]

      return (
        <tag
          type={nativeType} // 原生 button 标签属性
          class={classes}   // class 样式
          style={getStyle()}  // css 内联样式
          disabled={disabled} // 是否禁用
          onClick={onClick}   // button 组件点击事件
        >
          <div class={bem('content')}>
            {iconPosition === 'left' && renderIcon()}
            {renderText()}
            {iconPosition === 'right' && renderIcon()}
          </div>
        </tag>
      );
    }

  }
})
