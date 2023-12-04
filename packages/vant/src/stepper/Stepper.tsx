import {
  ref,
  watch,
  computed,
  nextTick,
  defineComponent,
  type PropType,
  type ExtractPropTypes,
} from 'vue';

import { HAPTICS_FEEDBACK, Numeric, addNumber, addUnit, createNamespace, formatNumber, getSizeStyle, isDef, makeNumericProp, numericProp, preventDefault, resetScroll, truthProp } from "../utils";
import { useCustomFieldValue } from "@vant/use";
import { callInterceptor } from "../utils/interceptor";


const [name, bem] = createNamespace('stepper');

const LONG_PRESS_INTERVAL = 200;

const isEqual = (value1?: Numeric, value2?: Numeric) =>
  String(value1) === String(value2);

export type StepperTheme = 'default' | 'round'; // 主题 默认 和 圆形 按钮


export const stepperProps = {
  min: makeNumericProp(1), // 最小值 默认 1
  max: makeNumericProp(Infinity), // 最大值 默认无限大
  name: makeNumericProp(''), // 值 name 属性
  step: makeNumericProp(1), // 每一次的步长 默认 1
  theme: String as PropType<StepperTheme>, // 主题 默认 default
  integer: Boolean, // 是否只能输入整数 默认 false
  disabled: Boolean, // 是否禁用 默认 false
  showPlus: truthProp, // 是否显示加号按钮 默认 true
  showMinus: truthProp, // 是否显示减号按钮 默认 true
  showInput: truthProp, // 是否显示输入框 默认 true
  longPress: truthProp, // 是否开启长按手势 默认 true
  autoFixed: truthProp, // 是否开启自动校正 默认 true
  allowEmpty: Boolean, // 是否允许输入空值 默认 false
  modelValue: numericProp, // 传入的 v-model 当前值
  inputWidth: numericProp, // 输入框宽度
  buttonSize: numericProp, // 按钮大小
  placeholder: String, // 输入框占位提示文字
  disablePlus: Boolean, // 禁用加号按钮
  disableMinus: Boolean, // 禁用减号按钮
  disableInput: Boolean, // 禁用输入框
  beforeChange: Function as PropType<(value: Numeric) => boolean>, // 输入值变化前的回调函数
  defaultValue: makeNumericProp(1), // 默认值
  decimalLength: numericProp, // 保留固定的小数位数
}

export type StepperProps = ExtractPropTypes<typeof stepperProps>;

export default defineComponent({
  name,

  props: stepperProps,

  emits: [
    'plus',
    'blur',
    'minus',
    'focus',
    'change',
    'overlimit',
    'update:modelValue',
  ],

  setup(props, { emit }) {
    const format = (value: Numeric, autoFixed = true) => {
      const { min, max, allowEmpty, decimalLength } = props;

      if (allowEmpty && value === '') {
        return value;
      }

      // 得到最终的值
      value = formatNumber(String(value), !props.integer);
      // 空就是 0，否则就是数字 value
      value = value === '' ? 0 : +value;
      // 如果是数字，就是 value，否则就是 min
      value = Number.isNaN(value) ? +min : value;


      // 自动校正，限制某个数的范围取值
      value = autoFixed ? Math.max(Math.min(+max, value), +min) : value;

      // 保留小数位数
      if (isDef(decimalLength)) {
        value = value.toFixed(+decimalLength);
      }

      return value;
    }


    /** 获取当前值 */
    const getInitialValue = () => {
      // 没有初始值就给默认值
      const defaultValue = props.modelValue ?? props.defaultValue;
      const value = format(defaultValue);

      if (!isEqual(value, props.modelValue)) {
        emit('update:modelValue', value);
      }

      return value;
    }

    let actionType: 'plus' | 'minus'; // 操作类型 + -
    const inputRef = ref<HTMLInputElement>();
    const current = ref(getInitialValue()); // 当前值

    // 减号按钮是否禁用
    const minusDisabled = computed(() => props.disabled || props.disableMinus || +current.value <= +props.min);

    // 加号按钮是否禁用
    const plusDisabled = computed(() => props.disabled || props.disablePlus || +current.value >= +props.max);

    // 输入框 宽 高 样式
    const inputStyle = computed(() => ({
      width: addUnit(props.inputWidth),
      height: addUnit(props.buttonSize),
    }));

    const buttonStyle = computed(() => getSizeStyle(props.buttonSize));

    const check = () => {
      const value = format(current.value);
      if (!isEqual(value, current.value)) {
        current.value = value;
      }
    }

    /** 将 current 修改为最终的值  */
    const setValue = (value: Numeric) => {
      if (props.beforeChange) {
        callInterceptor(props.beforeChange, {
          args: [value],
          done() {
            current.value = value;
          },
        })
      } else {
        current.value = value;
      }
    }


    // 输入框失去焦点
    const onChange = () => {
      // 超过最大或者最小上限时抛出 overlimit 事件
      if (
        (actionType === 'plus' && plusDisabled.value) ||
        (actionType === 'minus' && minusDisabled.value)
      ) {
        emit('overlimit', actionType);
        return;
      }

      // 判断是加还是减
      const diff = actionType === 'minus' ? -props.step : +props.step;
      // 计算出最终的值
      const value = format(addNumber(+current.value, diff));

      setValue(value);
      emit(actionType)
    }


    const onInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const { value } = input;
      const { decimalLength } = props;

      // 格式化输入值
      let formatted = formatNumber(String(value), !props.integer);

      // 保留小数点位数
      if (isDef(decimalLength) && formatted.includes('.')) {
        const pair = formatted.split('.');
        formatted = `${pair[0]}.${pair[1].slice(0, +decimalLength)}`;
      }

      if (props.beforeChange) {
        input.value = String(current.value);
      } else if (!isEqual(value, formatted)) {
        input.value = formatted;
      }

      // 设置当前值 判断是数字传数字，否则传字符串
      const isNumeric = formatted === String(+formatted);
      setValue(isNumeric ? +formatted : formatted);
    }


    /** 获得焦点触发 */
    const onFocus = (event: Event) => {
      // 禁用在老的 safari 手机浏览器上不起作用
      if (props.disableInput) {
        inputRef.value?.blur(); // 让它再次失去焦点
      } else {
        emit('focus', event); // 抛出 focus 获得焦点事件给父级
      }
    };

    /** 失去焦点触发 */
    const onBlur = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const value = format(input.value, props.autoFixed);
      input.value = String(value);
      current.value = value;
      nextTick(() => {
        emit('blur', event); // 抛出 blur 失去焦点事件给父级
        resetScroll(); // 重置滚动
      });
    };



    let isLongPress: boolean; // 是否长按
    let longPressTimer: ReturnType<typeof setTimeout>;


    const longPressStep = () => {
      longPressTimer = setTimeout(() => {
        onChange();
        longPressStep();
      }, LONG_PRESS_INTERVAL);
    }

    const onTouchStart = () => {
      // 开启长按手势, 每隔 200ms 就触发一次 + 或 - 操作
      if (props.longPress) {
        isLongPress = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
          isLongPress = true; // 正在长按
          onChange();
          longPressStep();
        }, LONG_PRESS_INTERVAL);
      }
    }

    /** 关闭长按定时器 */
    const onTouchEnd = (event: TouchEvent) => {
      if (props.longPress) {
        clearTimeout(longPressTimer);
        if (isLongPress) { // 阻止默认事件
          preventDefault(event);
        }
      }
    };

    const onMousedown = (event: MouseEvent) => {
      // 修复移动safari页面向下滚动的问题
      // see: https://github.com/vant-ui/vant/issues/7690
      if (props.disableInput) {
        preventDefault(event);
      }
    };

    const createListeners = (type: typeof actionType) => ({
      onClick: (event: MouseEvent) => {
        // 禁用移动 safari 浏览器上的双击滚动
        preventDefault(event);
        actionType = type; // 设置当前点击的类型
        onChange(); // 触发改变事件
      },
      // 用户触摸屏幕并开始滚动时触发
      onTouchstartPassive: () => {
        actionType = type;
        onTouchStart();
      },
      // 用户从屏幕上抬起手指时触发
      onTouchend: onTouchEnd,
      // 触摸事件被取消时触发
      onTouchcancel: onTouchEnd,
    })

    // 监听规则字段关闭，触发 check 方法重新计算 current 当前值
    watch(
      () => [props.max, props.min, props.integer, props.decimalLength],
      check,
    );

    // 监听 v-model 的值, 当值改变时赋值给 current 当前值
    watch(
      () => props.modelValue,
      (value) => {
        if (!isEqual(value, current.value)) {
          current.value = format(value!);
        }
      },
    );

    // 监听当前值改变触发 v-model 和 change 事件
    watch(current, (value) => {
      emit('update:modelValue', value);
      emit('change', value, { name: props.name });
    });

    // 将获取当前 v-model 值的函数传递给上层的 Field 组件
    useCustomFieldValue(() => {
      console.log("props.modelValue====11== ", props.modelValue)
      return props.modelValue
    });

    return () => (
      <div
        role="group" // 无障碍语义化标签
        class={bem([props.theme])}
      >
        <button
          v-show={props.showMinus}
          type="button"
          style={buttonStyle.value}
          class={[
            bem('minus', { disabled: minusDisabled.value }),
            { [HAPTICS_FEEDBACK]: !minusDisabled.value },
          ]}
          aria-disabled={minusDisabled.value || undefined} // 无障碍语义化标签
          {...createListeners('minus')}
        />
        <input
          v-show={props.showInput}
          ref={inputRef}
          type={props.integer ? 'tel' : 'text'}
          role="spinbutton" // 无障碍语义化标签
          class={bem('input')}
          value={current.value}
          style={inputStyle.value} // 样式
          disabled={props.disabled} // 禁用状态
          readonly={props.disableInput} // 只读状态
          // 现代浏览器中的设置键盘
          inputmode={props.integer ? 'numeric' : 'decimal'} // 设置键盘 整数，小数
          placeholder={props.placeholder} // 占位提示文字
          aria-valuemax={props.max} // 无障碍语义化标签 -  最大值
          aria-valuemin={props.min} // 无障碍语义化标签 - 最小值
          aria-valuenow={current.value} // 无障碍语义化标签 - 当前值
          onBlur={onBlur} // 失去焦点
          onInput={onInput} // 输入监听
          onFocus={onFocus} // 获得焦点
          onMousedown={onMousedown} // 鼠标按下
        />
        <button
          v-show={props.showPlus}
          type="button"
          style={buttonStyle.value}
          class={[
            bem('plus', { disabled: plusDisabled.value }),
            { [HAPTICS_FEEDBACK]: !plusDisabled.value },
          ]}
          aria-disabled={plusDisabled.value || undefined}
          {...createListeners('plus')}
        />
      </div>
    )
  }
})


