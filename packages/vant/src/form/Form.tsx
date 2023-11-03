

// Utils
import { defineComponent, type ExtractPropTypes, type PropType } from 'vue';
import { createNamespace, FORM_KEY, numericProp } from '../utils';
import { FieldValidateTrigger } from '../field';
import { preventDefault } from '../utils/dom';
import { useChildren } from '@vant/use';

const [name, bem] = createNamespace('form');

export const formProps = {
  colon: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  labelWidth: numericProp,
  // 表单校验触发时机，可选值为 onChange、onSubmit，支持通过数组同时设置多个值，具体用法见下方表格
  validateTrigger: {
    type: [String, Array] as PropType<
      FieldValidateTrigger | FieldValidateTrigger[]
    >,
    default: 'onBlur' // 默认：在提交表单和输入框失焦时触发校验
  }
}

export type FormProps = ExtractPropTypes<typeof formProps>;

export default defineComponent({
  name,
  props: formProps,
  emits: ['submit', 'failed'],
  setup(props, { emit, slots }) {
    const { children, linkChildren } = useChildren(FORM_KEY);

    /** 获取所有子 field 输入框的值 */
    const getValues = () => {
      children.reduce<Record<string, unknown>>
    }

    const submit = () => {
      const values = getValues()

      // validate().
    }


    const onSubmit = (event: Event) => {
      preventDefault(event);
      submit();
    }


    return () => {
      <form class={bem()} onSubmit={onSubmit}>
        {/* 插槽内容: 内部输入框 */}
        {slots.default?.()}
      </form>
    }
  }
})