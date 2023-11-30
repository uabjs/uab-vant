import { defineComponent, type ExtractPropTypes, type PropType } from 'vue';
import { useChildren } from '@vant/use';

// Utils
import { createNamespace, FORM_KEY, numericProp, truthProp } from '../utils';
import { FieldValidateError, FieldValidateTrigger } from '../field';
import { preventDefault } from '../utils/dom';

const [name, bem] = createNamespace('form');

export const formProps = {
  colon: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  labelWidth: numericProp,
  showErrorMessage: truthProp, // 是否显示错误提示
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

    const getFieldsByNames = (names?: string[]) => {
      // 过滤掉不需要校验的 field 子组件
      if (names) {
        return children.filter((field) => names.includes(field.name))
      }

      // 返回所有的 field 子组件
      return children
    }


    /** 执行所有 field 子组件内部的 validate 校验方法， 执行校验方法校验填写的内容是否合格  */
    const validateAll = (names?: string[]) => {
      return new Promise<void>((resolve, reject) => {
        const fields = getFieldsByNames(names);
        Promise.all(fields.map((item) => item.validate())).then((errors) => {
          errors = errors.filter(Boolean); // 过滤掉一些空值

          if (errors.length) {
            reject(errors)
          } else {
            resolve()
          }
        })
      })
    }

    /** 通过 name 获取到对应 field 子组件内部的 validate 校验方法， 执行校验方法校验填写的内容是否合格 */
    const validateField = (name: string) => {
      const matched = children.find((item) => item.name === name);
      if (matched) {
        return new Promise<void>((resolve, reject) => {
          // 执行每个
          matched.validate().then((error?: FieldValidateError) => {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          })
        })
      }

      // 读取不到 name 对应的 field 子组件默认返回 reject
      return Promise.reject()
    }

    /** 校验 form 表单下面的 field 子组件内容是否符合规则 */
    const validate = (name?: string | string[]) => {
      // 指定单个 field 子组件校验
      if (typeof name === 'string') {
        return validateField(name)
      }

      // 校验所有的填写规则
      return validateAll(name)
    }

    const submit = () => {
      const values = getValues()

      validate()
        .then(() => emit('submit', values))
        .catch((errors: FieldValidateError[]) => {
          emit('failed', { values, errors });
        })
    }


    const onSubmit = (event: Event) => {
      preventDefault(event);
      submit();
    }

    // linkChildren 内部通过 provide 注入 from 参数给 Field 子组件: provide(FORM_KEY, { link, unlink, children, internalChildren, ...props })
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