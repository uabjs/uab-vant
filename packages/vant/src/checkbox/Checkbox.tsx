import { type ExtractPropTypes, type PropType, watch, computed, defineComponent } from "vue";
import { useCustomFieldValue, useParent } from "@vant/use";

// Utils
import { pick, createNamespace, extend, truthProp } from "../utils";
import { CHECKBOX_GROUP_KEY } from '../checkbox-group/CheckboxGroup';

// Composables
import { useExpose } from "../composables/use-expose";

// Components
import Checker, { checkerProps, type CheckerShape } from './Checker';

// Types
import type { CheckboxExpose } from './types';



const [name, bem] = createNamespace('checkbox');

export const checkboxProps = extend({}, checkerProps, {
  shape: String as PropType<CheckerShape>, // 形状，可选值为 square方形状
  bindGroup: truthProp, // 是否与复选框组绑定
  indeterminate: { // 是否为不确定状态 - 横杠
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
})

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;

export default defineComponent({
  name,

  props: checkboxProps,

  emits: ['change', 'update:modelValue'],

  setup(props, { emit, slots }) {
    const { parent } = useParent(CHECKBOX_GROUP_KEY);

    // 设置父级 van-checkbox-group 的值
    const setParentValue = (checked: boolean) => {
      // 拿到当前的 name
      const { name } = props;
      // 拿到父级的值 和 复选框组的最大可选数
      const { max, modelValue } = parent!.props;
      // slice 复制一下，防止修改父级的值
      const value = modelValue.slice();

      // 添加选中的值
      if (checked) {
        // 则判断是否超过最大可选数
        const overlimit = max && value.length >= +max;

        // 没有超过最大可选数 且 当前的值不包含 name, 则添加选中的值
        if (!overlimit && !value.includes(name)) {
          value.push(name);

          // 是否与复选框组绑定, 如果绑定则更新父级的值
          if (props.bindGroup) {
            parent!.updateValue(value);
          }
        }
      } else {
        // 移除选中的值
        const index = value.indexOf(name);
        if (index !== -1) {
          value.splice(index, 1);
          
          // 是否与复选框组绑定, 如果绑定则更新父级的值
          if (props.bindGroup) {
            parent!.updateValue(value);
          }
        }
      }
    }

    const checked = computed(() => {
      if (parent && props.bindGroup) {
        // 拿到父级的值，判断是否包含当前的 name, 如果包含则为选中状态
        return parent.props.modelValue.includes(props.name);
      }
      // 如果没有父级，则直接返回当前的 modelValue
      return !!props.modelValue;
    })

    const toggle = (newValue = !checked.value) => {
      if (parent && props.bindGroup) {
        setParentValue(newValue);
      } else {
        emit('update:modelValue', newValue);
      }

      if (props.indeterminate !== null) {
        emit('change', newValue);
      }
    }

    watch(
      () => props.modelValue,
      (value) => {
        if (props.indeterminate === null) {
          emit('change', value);
        }
      }
    )

    // 将数据暴露在实例上 - 供外部调用 {toggle: 切换选中状态, props: 参数数据, checked: 是否选中 }
    useExpose<CheckboxExpose>({ toggle, props, checked })

    // 暴露给外层 field 组件的 customValue 方法内使用
    useCustomFieldValue(() => props.modelValue);
    
    return () => (
      <Checker
        v-slots={pick(slots, ['default', 'icon'])}
        bem={bem}
        role="checkbox"
        parent={parent}
        checked={checked.value}
        onToggle={toggle}
        {...props}
      />
    )
  }
})