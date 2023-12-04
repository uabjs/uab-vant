import { ExtractPropTypes, PropType, defineComponent } from "vue";

// Utils
import { createNamespace, extend, pick } from "../utils";
import { RADIO_KEY } from '../radio-group/RadioGroup'

// Composables
import { useParent } from "@vant/use";


// Components
import Checker, {
  checkerProps, // 选框的属性
  type CheckerShape,
  type CheckerLabelPosition,
} from "../checkbox/Checker";

export type RadioShape = CheckerShape | 'dot'; // 选框形状：正常｜ 方形 | 圆点
export const radioProps = extend({}, checkerProps, {
  shape: String as PropType<RadioShape>,
});

export type RadioLabelPosition = CheckerLabelPosition;
export type RadioProps = ExtractPropTypes<typeof radioProps>;

const [name, bem] = createNamespace('radio');

export default defineComponent({
  name,

  props: radioProps,

  emits: ['update:modelValue'],

  setup(props, { emit, slots }) {
    const { parent } = useParent(RADIO_KEY);

    // 获取选中状态，有 radio-group 父级就取父级的值，没有就取 props 的值
    const checked = () => {
      const value = parent ? parent.props.modelValue : props.modelValue;
      return value === props.name;
    }

    const toggle = () => {
      // 有 radio-group 父级就更新父级的值，没有就更新 v-model 的值
      if (parent) {
        parent.updateValue(props.name);
      } else {
        emit('update:modelValue', props.name);
      }
    }

    return () => (
      <Checker
        v-slots={pick(slots, ['default', 'icon'])} // 将 default icon 插槽传入 Checker 组件
        bem={bem}
        role="radio" // 无障碍
        parent={parent}
        checked={checked()}
        onToggle={toggle}
        {...props}
      />
    )
  }
})