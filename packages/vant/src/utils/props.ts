import type { PropType } from 'vue';

/** 任意类型 */
export const unknownProp = null as unknown as PropType<unknown>;

/** 字符串或数字*/
export const numericProp = [Number, String];

/** 布尔类型的 vue 参数 */
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

export const makeStringProp = <T>(defaultVal: T) => ({
  type: String as unknown as PropType<T>,
  default: defaultVal,
})

export const makeNumericProp = <T>(defaultVal: T) => ({
  type: numericProp,
  default: defaultVal
})