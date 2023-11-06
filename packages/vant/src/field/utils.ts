import { HTMLAttributes, InputHTMLAttributes } from "vue";
import type { FieldType } from './types';


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