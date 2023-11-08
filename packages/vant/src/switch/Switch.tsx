import { ExtractPropTypes, defineComponent } from "vue";
import { addUnit, createNamespace, numericProp, unknownProp } from "../utils";
import { useCustomFieldValue } from "@vant/use";

const [name, bem] = createNamespace('switch');

export const switchProps = {
  size: numericProp,
  loading: Boolean,
  disabled: Boolean,
  modelValue: unknownProp,
  activeColor: String,
  inactiveColor: String,
  activeValue: { // 打开时对应的值
    type: unknownProp,
    default: true as unknown,
  },
  inactiveValue: { // 关闭时对应的值
    type: unknownProp,
    default: false as unknown,
  },
}

export type SwitchProps = ExtractPropTypes<typeof switchProps>;

export default defineComponent({
  name,
  props: switchProps,
  emits: ['change', 'update:modelValue'],
  setup(props, { emit, slots }) {
    const isChecked = () => props.modelValue === props.activeValue;

    const onClick = () => {
      if (!props.disabled && !props.loading) { // 没有禁用 并且 没有在loading状态才能点击
        const newValue = isChecked() ? props.inactiveValue : props.activeValue;
        emit('update:modelValue', newValue); // 发射事件给外层的 v-model 方法
        emit('change', newValue); // 发射事件给外层绑定的 change 方法
      }
    }

    const renderLoading = () => {
      if (props.loading) {
        // const color = isChecked() ? props.activeColor : props.inactiveColor;
        return "..."
      }
      if (slots.node) { // 自定义选中按钮的内容
        return slots.node()
      }
    }

    // 内部通过 inject(CUSTOM_FIELD_INJECTION_KEY) 获取 field 组件注入的 customValue 自定义值, 将读取当前 value 值的方法给它
    // 目的：父级通过 () => props.modelValue 这个方法拿到子组件内的 value 值（点击提交按钮的时候使用）
    useCustomFieldValue(() => props.modelValue);

    return () => {
      const { size, loading, disabled, activeColor, inactiveColor } = props;
      const checked = isChecked();

      // 自定义的样式是直接使用 style 显示
      const style = {
        fontSize: addUnit(size),
        backgroundColor: checked ? activeColor : inactiveColor,
      }

      return (
        <div
          role="switch"
          class={bem({
            on: checked, // 是否选中，选中给一个选中背景色
            loading, // 状态上传到后端等待返回开关状态
            disabled, // 禁止选择
          })}
          style={style} // 其他样式
          tabindex={disabled ? undefined : 0} // 不知道
          aria-checked={checked}
          onClick={onClick}
        >
          <div class={bem('node')}>{renderLoading()}</div>
          {/* 渲染自定义开关的背景内容插槽 */}
          {slots.background?.()}
        </div>
      )
    }
  }
})