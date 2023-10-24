import { withInstall } from '../utils';
import _Button from './Button';

export const Button = withInstall(_Button);
export default Button;

declare module 'vue' {
  export interface GlobalComponents {
    VanButton: typeof Button;
  }
}
