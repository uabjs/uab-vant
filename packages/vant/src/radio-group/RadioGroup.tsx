import {
  watch,
  defineComponent,
  type PropType,
  type InjectionKey,
  type ExtractPropTypes,
} from "vue";
import { CheckerDirection } from "../checkbox/Checker";
import { RadioShape } from "../radio/Radio";
import { createNamespace, numericProp, unknownProp } from "../utils";
import { useChildren, useCustomFieldValue } from "@vant/use";


const [name, bem] = createNamespace('radio-group');

export type RadioGroupDirection = CheckerDirection; // 排列方向，水平｜垂直

export const radioGroupProps = {
  shape: String as PropType<RadioShape>, // 形状
  disabled: Boolean, // 是否禁用
  iconSize: numericProp, // 图标大小
  direction: String as PropType<RadioGroupDirection>,
  modelValue: unknownProp, // 值可以是任意类型
  checkedColor: String, // 选中的颜色
}

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;

export type RadioGroupProvide = {
  props: RadioGroupProps;
  updateValue: (value: unknown) => void;
};

// 设置 provide/inject 的 key
export const RADIO_KEY: InjectionKey<RadioGroupProvide> = Symbol(name);

export default defineComponent({
  name,

  props: radioGroupProps,

  emits: ['change', 'update:modelValue'],

  setup(props, { emit, slots }) {
    const { linkChildren } = useChildren(RADIO_KEY);

    // 更新值函数，用于更新 v-model 的值
    const updateValue = (value: unknown) => emit('update:modelValue', value);

    // 监听 v-model 的值，当值改变时触发 change 事件
    watch(
      () => props.modelValue,
      (value) => emit('change', value) // 触发 change 事件
    )

    // 将参数和 updateValue 函数传给 radio 子组件
    linkChildren({ props, updateValue });

    // 将获取当前 v-model 的值函数传递给上层的 Field 组件
    useCustomFieldValue(() => props.modelValue);

    return () => (
      <div
        class={bem([props.direction])}
        role="radiogroup" // 无障碍
      >
        {slots.default?.()}
      </div>
    )
  }
})