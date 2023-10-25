import { withInstall } from '../utils';
import _Badge from './Badge';

export const Badge = withInstall(_Badge);
export default Badge;
export { badgeProps } from './Badge';
export type { BadgeProps } from './Badge';
export type { BadgePosition, BadgeThemeVars } from './types';

declare module 'vue' {
  export interface GlobalComponents {
    VanBadge: typeof Badge;
  }
}
