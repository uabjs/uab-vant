import type { PropType } from 'vue';

/** 任意类型 */
export const unknownProp = null as unknown as PropType<unknown>;

/** 字符串或数字*/
export const numericProp = [Number, String];

/** 布尔类型的参数，默认 true */
export const truthProp = {
  type: Boolean,
  default: true as const,
};

export const makeRequiredProp = <T>(type: PropType<T>) => ({
  type,
  required: true as const,
})

export const makeArrayProp = <T>() => ({
  type: Array as PropType<T[]>,
  default: () => [],
});

/** 制作字符串类型的 prop 参数 */
export const makeStringProp = <T>(defaultVal: T) => ({
  type: String as unknown as PropType<T>, // 避免了类型错误
  default: defaultVal,
})

/** 数字类型 */
export const makeNumberProp = <T>(defaultVal: T) => ({
  type: Number,
  default: defaultVal,
});

/** 数字 或 字符串 类型 */
export const makeNumericProp = <T>(defaultVal: T) => ({
  type: numericProp,
  default: defaultVal
})