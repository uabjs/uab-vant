import type { PropType } from 'vue';

export const unknownProp = null as unknown as PropType<unknown>;

export const numericProp = [Number, String];

/** 布尔类型的 vue 参数 */
export const truthProp = {
  type: Boolean,
  default: true as const,
};

export const makeStringProp = <T>(defaultVal: T) => ({
  type: String as unknown as PropType<T>,
  default: defaultVal,
})