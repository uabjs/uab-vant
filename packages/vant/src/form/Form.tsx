import { defineComponent, type ExtractPropTypes, type PropType } from 'vue';
import { useChildren } from '@vant/use';

// Utils
import { createNamespace, FORM_KEY, numericProp } from '../utils';
import { FieldValidateTrigger } from '../field';
import { preventDefault } from '../utils/dom';

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
    // 获取所有子组件
    const { children, linkChildren } = useChildren(FORM_KEY);

    /** 获取所有子 field 输入框的值 */
    const getValues = () => children.reduce<Record<string, unknown>>((form, field) => {
      if (field.name !== undefined) {
        form[field.name] = field.formValue.value
      }
      return form
    }, {})

    const submit = () => {
      const values = getValues()
      emit('submit', values)
    }


    const onSubmit = (event: Event) => {
      preventDefault(event);
      submit();
    }

    // 内部通过 provide 注入 from 参数给 Field 子组件: provide(FORM_KEY, { link, unlink, children, internalChildren, ...props })
    // 每个 Field 子组件将自己的 实例添加到 children, internalChildren 中，后续点击提交通过 children[i].formValue 去拿到各个 Field 子组件内的 value
    linkChildren({ props });

    return () => (
      <form class={bem()} onSubmit={onSubmit}>
        {/* 插槽内容: 内部输入框 */}
        {slots.default?.()}
      </form>
    )
  }
})