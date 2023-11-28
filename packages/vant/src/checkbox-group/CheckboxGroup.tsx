import {
  watch,
  defineComponent,
  type PropType,
  type InjectionKey,
  type ExtractPropTypes,
} from 'vue';

// Utils
import {
  numericProp,
  makeArrayProp,
  makeStringProp,
  createNamespace,
} from '../utils';

// Composables
import { useChildren, useCustomFieldValue } from '@vant/use';
import { useExpose } from '../composables/use-expose';
import { CheckerDirection, CheckerShape } from '../checkbox/Checker';
import { CheckboxGroupExpose, CheckboxGroupProvide, CheckboxGroupToggleAllOptions } from './types';

const [name, bem] = createNamespace('checkbox-group');

export const checkboxGroupProps = {
  max: numericProp,
  shape: makeStringProp<CheckerShape>('round'), // 圆形状
  disabled: Boolean, // 是否禁用
  iconSize: numericProp, // 图标大小
  direction: String as PropType<CheckerDirection>, // 方向
  modelValue: makeArrayProp<unknown>(), // 选中的值
  checkedColor: String, // 选中的颜色
}

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;

export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupProvide> = Symbol(name);

export default defineComponent({
  name,

  props: checkboxGroupProps,

  emits: ['change', 'update:modelValue'],

  setup(props, { emit, slots }) {
    const { children, linkChildren } = useChildren(CHECKBOX_GROUP_KEY);

    const updateValue = (value: unknown[]) => emit('update:modelValue', value);

    /** 实现全选与反选 */
    const toggleAll = (options: CheckboxGroupToggleAllOptions = {}) => {
      if (typeof options === 'boolean') {
        options = { checked: options };
      }

      const { checked, skipDisabled } = options;

      // 选中的子项
      const checkedChildren = children.filter((item: any) => {
        // 排除不绑定组的子项
        if (!item.props.bindGroup) {
          return false;
        }

        // 选中的子项
        if (item.props.disabled && skipDisabled) {
          return item.checked.value;
        }

        return checked ?? !item.checked.value;
      })

      const names = checkedChildren.map((item: any) => item.name);
      updateValue(names);
    }

    watch(
      () => props.modelValue,
      (value) => emit('change', value),
    );

    useExpose<CheckboxGroupExpose>({ toggleAll });
    // 提供给 Field 组件的数据
    useCustomFieldValue(() => props.modelValue);
    
    // 注入 props 与 updateValue 方法给子组件
    // 子组件 checkbox 通过 parent.props.modelValue 拿到当前 modelValue 数组
    linkChildren({
      props,
      updateValue,
    });

    return () => <div class={bem([props.direction])}>{slots.default?.()}</div>;
  }
})