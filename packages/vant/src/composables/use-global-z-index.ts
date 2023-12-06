/**
 * Popup组件的 z-index 值
 * 
 * 将影响以下组件：
 *   - ActionSheet
 *   - Calendar
 *   - Dialog
 *   - DropdownItem
 *   - ImagePreview
 *   - Notify
 *   - Popup
 *   - Popover
 *   - ShareSheet
 *   - Toast
 */


// 默认的全局 z-index 值
let globalZIndex = 2000;

/** 全局 z-index 在读取后自动递增 */
export const useGlobalZIndex = () => ++globalZIndex;

/** 重置全局 z-index 的值 */
export const setGlobalZIndex = (val: number) => {
  globalZIndex = val;
};
