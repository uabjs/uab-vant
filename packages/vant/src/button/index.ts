import Button from './Button';

export default Button;

declare module 'vue' {
  export interface GlobalComponents {
    VanButton: typeof Button;
  }
}
