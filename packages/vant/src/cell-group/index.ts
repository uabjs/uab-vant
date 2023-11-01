import { withInstall } from '../utils';
import _CellGroup from './CellGroup';

export const CellGroup = withInstall(_CellGroup);
export default CellGroup;
export { cellGroupProps } from './CellGroup';
export type { CellGroupProps } from './CellGroup';

// css主题变量类型明细
export type { CellGroupThemeVars } from './types';

declare module 'vue' {
  export interface GlobalComponents {
    VanCellGroup: typeof CellGroup;
  }
}
