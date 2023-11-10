import { ExtractPropTypes, PropType, defineComponent } from "vue";
import Checkbox, { checkboxProps } from ".";
import { useParent } from "@vant/use";
import { extend, truthProp } from "../utils";
import Checker, { checkerProps, type CheckerShape } from './Checker';

const [name, bem] = createNamespace('checkbox');

export const checkboxProps = extend({}, checkboxProps, {
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
    
    return () => {
      <Checker />
    }
  }
})