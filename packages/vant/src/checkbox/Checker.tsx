import { ref, computed, defineComponent, type PropType } from 'vue';
import { Numeric, addUnit, extend, makeRequiredProp, numericProp, truthProp, unknownProp } from '../utils';
// import type { RadioShape } from '../radio';
import Icon from '../icon/Icon';

export type CheckerShape = 'square' | 'round';
export type CheckerDirection = 'horizontal' | 'vertical';
export type CheckerLabelPosition = 'left' | 'right';

export type CheckerParent = {
  props: {
    max?: Numeric; // 最大可选数
    shape?: CheckerShape; // 形状
    disabled?: boolean;
    iconSize?: Numeric;
    direction?: CheckerDirection;
    modelValue?: unknown | unknown[];
    checkedColor?: string;
  }
}


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
    shape: String as PropType<CheckerShape>, // 正方形
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

    /** 获取父级 Checkbox 表单组件的属性 */
    const getParentProp = <T extends keyof CheckerParent['props']> (name: T) => {
      // 有父级 且 与复选框组绑定
      if (props.parent && props.bindGroup) {
        return props.parent.props[name];
      }
    }

    const disabled = computed(() => {
      if (props.parent && props.bindGroup) {
        const disabled = getParentProp('disabled') || props.disabled;

        if (props.role === 'checkbox') {
          const checkedCount = (getParentProp('modelValue') as unknown[]).length
          const max = getParentProp('max');
          // 是否超过最大可选数
          const overlimit = max && checkedCount >= +max;
          return disabled || (overlimit && !props.checked);
        }
        return disabled;
      }
      return props.disabled;
    })

    // 排列方向，可选值为 horizontal
    const direction = computed(() => getParentProp('direction'));

    // icon 图标样式
    const iconStyle = computed(() => {
      // 所有复选框的选中状态颜色
      const checkedColor = props.checkedColor || getParentProp('checkedColor');

      if (checkedColor && props.checked && !disabled.value) {
        return {
          borderColor: checkedColor,
          backgroundColor: checkedColor,
        }
      }
    })

    // 获取形状： 圆形 / 正方形
    const shape = computed(() => {
      return props.shape || getParentProp('shape') || 'round';
    });

    const onClick = (event: MouseEvent) => {
      const { target } = event;
      const icon = iconRef.value;
      const iconClicked = icon === target || icon?.contains(target as Node);

      // 没有禁止点击 且 （点击的是 icon  或 没有禁用标签点击）
      if (!disabled.value && (iconClicked || !props.labelDisabled)) {
        emit('toggle');
      }
      emit('click', event);
    }

    const renderIcon = () => {
      const { bem, checked, indeterminate } = props;
      // 获取 icon 大小
      const iconSize = props.iconSize || getParentProp('iconSize');

      return (
        <div
          ref={iconRef}
          class={bem('icon', [
            shape.value,
            { disabled: disabled.value, checked, indeterminate },
          ])}
          style={
            shape.value !== 'dot'
              ? { fontSize: addUnit(iconSize) }
              : {
                width: addUnit(iconSize),
                height: addUnit(iconSize),
                borderColor: iconStyle.value?.borderColor,
              }
          }
        >
          {
            // 自定义插槽 icon
            slots.icon ? (
              slots.icon({ checked, disabled: disabled.value })
            ) : shape.value !== 'dot' ? (
              <Icon
                name={indeterminate ? 'minus' : 'success'} // minus：横杠 / success：对号
                style={iconStyle.value}
              />
            ) : (
              <div
                class={bem('icon--dot__icon')}
                style={{ backgroundColor: iconStyle.value?.backgroundColor }}
              ></div>
            )
          }
        </div>
      )
    }


    const renderLabel = () => {
      if (slots.default) {
        return (
          <span
            class={props.bem('label', [
              props.labelPosition,
              { disabled: disabled.value }
            ])}
          >
            {slots.default()}
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