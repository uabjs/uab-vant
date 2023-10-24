import { CSSProperties, defineComponent } from 'vue';
import { extend, numericProp, makeStringProp } from "../utils";

const name = 'van-button'

// Types
import {
  ButtonSize,
  ButtonType,
  ButtonNativeType,
  ButtonIconPosition,
} from './types';

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

    const rendertext = () => {
      let text;
      if (props.loading) {
        text = props.loadingText
      } else {
        text = slots.default ? slots.default() : props.text;
      }

      if (text) {
        return <span>{text}</span>
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
      const { tag } = props
      return (
        <tag>
          <div onClick={onClick}>
            {slots?.default?.()}
          </div>
        </tag>
      );
    }

  }
})
