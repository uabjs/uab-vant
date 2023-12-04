import { withInstall } from '../utils';
import _Stepper from './Stepper';

export const Stepper = withInstall(_Stepper);
export default Stepper;
export { stepperProps } from './Stepper'; // 步进器 props 属性
export type { StepperTheme, StepperProps } from './Stepper'; // 步进器 props 类型
export type { StepperThemeVars } from './types'; // 步进器 css var 变量名类型

declare module 'vue' {
  export interface GlobalComponents {
    VanStepper: typeof Stepper;
  }
}
