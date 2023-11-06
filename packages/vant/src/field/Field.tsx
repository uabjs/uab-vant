import { ExtractPropTypes, defineComponent, type PropType, ref, computed } from "vue";
import { useParent } from "@vant/use";

import Cell, { cellSharedProps } from "../cell/Cell";
import { createNamespace, extend, isDef, makeNumericProp, makeStringProp, numericProp, unknownProp, FORM_KEY } from "../utils";
import { FieldExpose, FieldFormatTrigger, FieldTextAlign, FieldType } from "./types";
import { useExpose } from '../composables/use-expose';
import { userId } from "../composables/use-id";
import { mapInputType } from "./utils";
import { preventDefault } from "../utils/dom";


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
  labelClass: unknownProp,
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

    // 内部通过 inject(FORM_KEY) 拿到 form 父组件注入的 props 参数 { link, unlink, children, internalChildren, ...props }。并且使用 link 方法将自身 instance 实例添加到 children, internalChildren 中
    const { parent: form } = useParent(FORM_KEY);

    const getProp = (key) => {
      if (isDef(props[key])) {
        return props[key]
      }
    }

    const formValue = computed(() => {
      return props.modelValue;
    })

    const focus = () => inputRef.value?.focus();

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
            //  作用：添加 for 属性点击光标聚焦到输入框（for属性是 input 的 id 属性）
            for={slots.input ? undefined : getInputId()}
            onClick={(event: MouseEvent) => {
              // 解决：van-field组件在点击label位置时，绑定的click事件会执行两次
              preventDefault(event);
              focus(); // 点击光标聚焦到输入框（兜底）
            }}
          >
            {/* 标题 + ":"冒号 */}
            {props.label + colon}
          </label>
        )
      }
    }

    const updateValue = (
      value: string,
      trigger: FieldFormatTrigger = 'onChange',
    ) => {


      // 发射事件给外层的 v-model 接收
      if (value !== props.modelValue) {
        emit('update:modelValue', value)
      }
    }

    const onInput = (event: Event) => {
      // composing 是一个布尔值，用于指示正在进行IME（输入法编辑）组合的文本处理中是否存在未完成的字符。
      if (!event.target!.composing) {
        updateValue((event.target as HTMLInputElement).value)
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
        class: controlClass,
        placeholder: props.placeholder,
        onInput,
      }

      // 使用原生的 input 标签，将属性传入进去
      return <input {...mapInputType(props.type)} {...inputAttrs} />
    }

    const renderFieldBody = () => [
      <div class={bem('body')}>
        {renderInput()}
      </div>
    ]

    useExpose<FieldExpose>({
      formValue,
    })


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
          titleClass={[
            bem('label', [labelAlign, { required: props.required }]),
            props.labelClass,
          ]}
        />
        </div>
      )
    }
  }
})