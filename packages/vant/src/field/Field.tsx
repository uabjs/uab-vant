import { ExtractPropTypes, defineComponent, type PropType, ref, computed, reactive, watch } from "vue";
import { useParent } from "@vant/use";

import Cell, { cellSharedProps } from "../cell/Cell";
import { createNamespace, extend, isDef, makeNumericProp, makeStringProp, numericProp, unknownProp, FORM_KEY, toArray } from "../utils";
import { FieldExpose, FieldFormatTrigger, FieldRule, FieldTextAlign, FieldType, FieldValidateError, FieldValidationStatus } from "./types";
import { useExpose } from '../composables/use-expose';
import { userId } from "../composables/use-id";
import { mapInputType, isEmptyValue, runSyncRule, getRuleMessage, runRuleValidator, getStringLength, cutString } from "./utils";
import { preventDefault } from "../utils/dom";


const [name, bem] = createNamespace('field');


export const fieldSharedProps = {
  id: String,
  name: String,
  maxlength: numericProp,
  formatter: Function as PropType<(value: string) => string>, // 输入内容格式化函数
  modelValue: makeNumericProp(''),
  placeholder: String,
  errorMessage: String,
  formatTrigger: makeStringProp<FieldFormatTrigger>('onChange'), // 触发格式化的方法
}


// 输入框覆盖继承单元格参数
export const fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
  type: makeStringProp<FieldType>('text'),
  rules: Array as PropType<FieldRule[]>,
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
    'blur',
    'endValidate',
    'startValidate',
    'update:modelValue',
  ],
  setup(props, { emit, slots }) {
    const id = userId();
    const getInputId = () => props.id || `${id}-input`;
    const state = reactive({
      status: 'unvalidated' as FieldValidationStatus,
      focused: false,
      validateMessage: '',
    })
    
    const inputRef = ref<HTMLInputElement>();

    // 内部通过 inject(FORM_KEY) 拿到 form 父组件注入的 props 参数 { link, unlink, children, internalChildren, ...props }。并且使用 link 方法将自身 instance 实例添加到 children, internalChildren 中
    const { parent: form } = useParent(FORM_KEY);

    const getModelValue = () => String(props.modelValue ?? '');

    const getProp = (key) => {
      if (isDef(props[key])) {
        return props[key]
      }
    }

    const formValue = computed(() => {
      return props.modelValue;
    })


    const runRules = (rules: FieldRule[]) => {
      return rules.reduce(
        (promise, rule) => {
          return promise.then(() => {
            // 如果已经校验失败了就不往下校验了
            if (state.status === 'failed') {
              return;
            }

            let { value } = formValue;

            // 用户传入的格式化函数，将表单项的值转换后再进行校验
            if (rule.formatter) {
              value = rule.formatter(value, rule);
            }

            // 进行 required 和 pattern 校验,校验失败返回 false, 通过返回 true
            if (!runSyncRule(value, rule)) {
              state.status = 'failed';
              state.validateMessage = getRuleMessage(value, rule);
              return;
            }

            // 通过函数进行校验，可以返回一个 Promise 来进行异步校验
            if (rule.validator) {
              if (isEmptyValue(value) && rule.validateEmpty === false) {
                return
              }

              // 执行用户传入的 validator 校验函数, 返回字符串则校验失败, 字符串作为显示 message 提示
              return runRuleValidator(value, rule).then((result) => {
                if (result && typeof result === 'string') {
                  state.status = 'failed'
                  state.validateMessage = result
                } else if (result === false) { // 返回 fasle 说明校验失败需要给错误提示
                  state.status = 'failed'
                  state.validateMessage = getRuleMessage(value, rule)
                }
              })
            }
          })
        },
        Promise.resolve(),
      )
    }


    /** 重置输入框下面的错误提示内容 */
    const resetValidation = () => {
      state.status = 'unvalidated';
      state.validateMessage = '';
    }

    /** 返回规则校验的状态 */
    const endValidate = () => {
      emit('endValidate', {
        status: state.status,
        message: state.validateMessage,
      });
    }


    const validate = (rules = props.rules) => {
      return new Promise<FieldValidateError | void>((resolve) => {
        resetValidation();

        // 存在规则就执行所有规则
        if (rules) {
          emit('startValidate') // 发射事件通知父级开始校验
          runRules(rules).then(() => {
            if (state.status === 'failed') {
              resolve({
                name: props.name,
                message: state.validateMessage,
              })
              endValidate();
            } else {
              state.status = 'passed';
              resolve();
              endValidate();
            }
          })
        } else {
          // 不存在规则就返回成功
          resolve()
        }
      })
    }

    /** 监听事件触发 rules 规则校验 */
    const validateWithTrigger = (trigger: FieldFormatTrigger) => {
      if (form && props.rules) {
        // validateTrigger: 表单校验触发时机, 默认 onBlur 失去焦点的时候
        const { validateTrigger } = form.props
        // 判断当前事件是否需要触发 "规则校验"
        const defaultTrigger = toArray(validateTrigger).includes(trigger);
        // 筛选出最终需要进行规则校验的 规则
        const rules = props.rules.filter((rule) => {
          if (rule.trigger) {
            return toArray(rule.trigger).includes(trigger)
          }
          return defaultTrigger;
        })
        // 最终存在规则就进行规则校验
        if (rules.length) {
          validate(rules)
        }
      }
    }

    const focus = () => inputRef.value?.focus();


    const renderMessage = () => {
      // 父级 form 表单可以决定是否显示错误提示
      if (form && form.props.showErrorMessage === false) {
        return
      }

      // 用户传入了错误提示则显示用户的 [自我感悟: 我个人感觉这个错误提示给用户自定义的自由度太大了, errorMessage参数, rule.message, rule.validator的返回值 这3个地方都能决定这个 message 提示的内容, 一个功能能实现的方式越多,用户使用方式就越杂乱, 用户搜索一个问题就会有多个结果增加了用户的学习成本, 苹果一贯的设计原则就是我教你这么用你就应该这么用,如果多条路都能到达终点就会给用户选择,选择是繁琐的是浪费时间的]
      const message = props.errorMessage || state.validateMessage;

      if (message) {
        const slot = slots['error-message'] // 错误插槽 有插槽显示插槽没有显示 message 提示
        const errorMessageAlign = getProp('errorMessageAlign') // 错误提示文案对齐方式，可选值为 center right
        return (
          <div class={bem('error-message', errorMessageAlign)}>
            {slot ? slot({ message }): message}
          </div>
        )
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

      // 存在 formatter 格式化函数, 并且当前修改满足 formatTrigger 格式化函数触发的时机(onBlur | onChange)
      if (props.formatter && trigger === props.formatTrigger) {
        const { formatter, maxlength } = props
        value = formatter(value);

        // 格式化后的长度可能超过 maxlength
        if (isDef(maxlength) && getStringLength(value) > +maxlength) {
          value = cutString(value, +maxlength);
        }
      }


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

    const onBlur = (event: Event) => {
      state.focused = false
      updateValue(getModelValue(), 'onBlur');
      emit('blur', event);

      // 如果只读则直接 return 不需要执行下面逻辑
      if (getProp('readonly')) {
        return;
      }


      // 失去焦点时触发规则校验
      validateWithTrigger('onBlur');
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
        onBlur,
        onInput,
      }

      // 使用原生的 input 标签，将属性传入进去
      return <input {...mapInputType(props.type)} {...inputAttrs} />
    }

    const renderFieldBody = () => [
      <div class={bem('body')}>
        {renderInput()}
      </div>,
      renderMessage(),
    ]

    useExpose<FieldExpose>({
      validate,
      formValue,
    })

    // 监听 输入框 变化重置校验状态
    watch(
      () => props.modelValue,
      () => {
        resetValidation();
      }
    )


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