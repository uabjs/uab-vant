import { HTMLAttributes, InputHTMLAttributes } from "vue";
import type { FieldRule, FieldType } from './types';
import { isFunction, isPromise } from "../utils";


/** 是否是空 */
export function isEmptyValue(value: unknown) {
  if (Array.isArray(value)) {
    return !value.length
  }
  if (value === 0) {
    return false
  }
  return !value;
}


/** 进行 required 和 pattern 校验,校验失败返回 false, 通过返回 true */
export function runSyncRule(value: unknown, rule: FieldRule) {
  if (isEmptyValue(value)) {
    // 判断 required 是否必填, 是必填就返回 false
    if (rule.required) {
      return false
    }
    // 判断是否要对空值进行校验,不需要返回 false
    if (rule.validateEmpty === false) {
      return true
    }
  }
  // 对 pattern 正则进行校验,校验不通过返回 false
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return false
  }

  // 其他情况都返回成功通过校验
  return true
}

/** 执行用户的 validator 返回一个 Promise, 用户可以传递异步的 validator 方法 */
export function runRuleValidator(value: unknown, rule: FieldRule) {
  return new Promise((resolve) => {
    const returnVal = rule.validator!(value, rule)

    if (isPromise(returnVal)) {
      returnVal.then(resolve);
      return
    }

    resolve(returnVal)
  })
}


/** 获取规则的错误提示: 用户填入的 message 提示可以是一个方法, 执行方法拿到用户自定义的提示文本 */
export function getRuleMessage(value: unknown, rule: FieldRule) {
  const { message } = rule
  if (isFunction(message)) {
    return message(value, rule)
  }
  return message || '';
}

/** input 输入框类型兼容 */
export function mapInputType(type: FieldType): {
  type: InputHTMLAttributes['type']; // 输入
  inputmode?: HTMLAttributes['inputmode']; // 输入数字类型
} {

  // type="number" 在iOS中很奇怪，在Android中也无法阻止输入 "." 点
  // 所以在现代浏览器中使用 inputmode 来设置键盘
  if (type === 'number') {
    return {
      type: 'text',
      inputmode: 'decimal' // 小数
    }
  }

  if (type === 'digit') {
    return {
      type: 'tel',
      inputmode: 'numeric', // 整数
    };
  }

  return { type }
}

/** 字符串或含表情符号的长度 */
export function getStringLength(str: string) {
  return [...str].length
}

/** 截断导出长度的表情符号 */
export function cutString(str: string, maxlength: number) {
  return [...str].slice(0, maxlength).join('');
}