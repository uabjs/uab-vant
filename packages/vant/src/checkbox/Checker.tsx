import { ref, computed, defineComponent, type PropType } from 'vue';
import { extend, numericProp, truthProp, unknownProp } from '../utils';


export type CheckerLabelPosition = 'left' | 'right';

export const checkerProps = {
  name: unknownProp, // 字段名
  disabled: Boolean, // 禁止点击
  iconSize: numericProp, // 图标大小，默认单位为 px
  modelValue: unknownProp, // 值
  checkedColor: String, // 选框自定义颜色
  labelPosition: String as PropType<CheckerLabelPosition>, // 选框文本位置：left
  labelDisabled: Boolean, // 禁用文本点击
}


export default defineComponent({
  props: extend({}, checkerProps, {
    bem: makeRequiredProp(Function),
    role: String, // 无障碍
    shape: String as PropType<CheckerShape | RadioShape>, // 正方形
    parent: Object as PropType<CheckerParent | null>, // 父级
    checked: Boolean, // 是否选择
    bindGroup: truthProp, // 是否与复选框组绑定
    indeterminate: { // 是否为不确定状态 - 横杠
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
  }),
  emits: ['click', 'toggle'], // click点击方法 / toggle切换选中状态
  setup(props, { emit, slots }) {
    const iconRef = ref<HTMLElement>();

    const getParentProp = <T extends keyof CheckerParent['props']>(name: T) => {
      if (props.parent && props.bindGroup) {
        return props.parent.props[name];
      }
    };

    const renderLabel = () => {
      if (slots.default) {
        return (
          <span
            class={props.bem('label', [
              props.labelPosition,
              { disabled:  }
            ])}
          >

          </span>
        )
      }
    }

    return () => {
      const nodes: (JSX.Element | undefined)[] = 
        props.labelPosition === 'left'
          ? [renderLabel(), renderIcon()] // 文字在左边
          : [renderIcon(), renderLabel()]; // 文字在右边

      return (
        <div
          role={props.role}
          class={props.bem([
            {
              disabled: disabled.value,
              'label-disabled': props.labelDisabled,
            },
            direction.value,
          ])}
          tabindex={disabled.value ? undefined : 0} // 键盘导航顺序
          aria-checked={props.checked} // 无障碍
          onClick={onClick} // 点击
        >
          {nodes}
        </div>
      )
    }
  }
})