import { ExtractPropTypes, defineComponent, type PropType, ref } from "vue";
import Cell, { cellSharedProps } from "../cell/Cell";
import { createNamespace, extend, isDef, makeNumericProp, makeStringProp, numericProp } from "../utils";
import { FieldTextAlign, FieldType } from "./types";
import { userId } from "../composables/use-id";
import { mapInputType } from "./utils";


const [name, bem] = createNamespace('field');


export const fieldSharedProps = {
  id: String,
  name: String,
  modelValue: makeNumericProp(''),
  placeholder: String,
}


// 输入框覆盖继承单元格参数
export const fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
  type: makeStringProp<FieldType>('text'),
  labelWidth: numericProp,
  labelAlign: String as PropType<FieldTextAlign>,
  colon: {
    type: Boolean,
    default: null,
  },
})


export type FieldProps = ExtractPropTypes<typeof fieldProps>

export default defineComponent({
  name,
  props: fieldProps,
  emits: [
    'update:modelValue',
  ],
  setup(props, { emit, slots }) {
    const id = userId();
    const getInputId = () => props.id || `${id}-input`;
    
    const inputRef = ref<HTMLInputElement>();

    const getProp = (key) => {
      if (isDef(props[key])) {
        return props[key]
      }
    }

    const renderLabel = () => {
      const labelWidth = getProp('labelWidth');
      const labelAlign = getProp('labelAlign');
      const colon = getProp('colon') ? ':' : '';

      // 存在 label 插槽优先渲染插槽
      if (slots.label) {
        return [slots.label(), colon];
      }

      // 存在 label 参数渲染
      if (props.label) {
        return (
          <label
            id={`${id}-label`}
          >
            {props.label + colon}
          </label>
        )
      }
    }

    const renderInput = () => {
      const controlClass = bem('control', [
        getProp('inputAlign'),
      ])

      // 有 input 插槽显示插槽
      if (slots.input) {
        return (
          <div class={controlClass}>
            {slots.input()}
          </div>
        )
      }

      // input 的参数
      const inputAttrs = {
        id: getInputId(),
        ref: inputRef,
        name: props.name,
      }

      // 使用原生的 input 标签，将属性传入进去
      return <input {...mapInputType(props.type)} {...inputAttrs} />
    }

    const renderFieldBody = () => [
      <div class={bem('body')}>
        {renderInput()}
      </div>
    ]


    return () => {
      const labelAlign = getProp('labelAlign')

      const renderTitle = () => {
        const Label = renderLabel()
        return Label || []
      }

      return (
        <div>
        <Cell
          v-slots={{
            title: renderTitle,
            value: renderFieldBody,
          }}
          valueClass={bem('value')}
        />
        </div>
      )
    }
  }
})