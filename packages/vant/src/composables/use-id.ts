import { getCurrentInstance } from 'vue';

let current = 0;

export function userId() {
  const vm = getCurrentInstance();
  const { name = 'unknown' } = vm?.type || {};

  // 测试快照保持稳定
  if (process.env.NODE_ENV === 'test') {
    return name;
  }

  return `${name}-${++current}`
}