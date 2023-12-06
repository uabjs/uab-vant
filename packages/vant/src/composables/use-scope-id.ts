import { getCurrentInstance } from 'vue';

/** 作用：解决使用 teleport & fragment 时获取 scopeId 失败的问题 */
export const useScopeId = () => {
  const { scopeId } = getCurrentInstance()?.vnode || {};
  return scopeId ? { [scopeId]: '' } : null
}