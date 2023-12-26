type BaseThemeVars = {
  // 调色板
  black?: string;
  white?: string;
  gray1?: string;
  gray2?: string;
  gray3?: string;
  gray4?: string;
  gray5?: string;
  gray6?: string;
  gray7?: string;
  gray8?: string;
  red?: string;
  blue?: string;
  orange?: string;
  orangeDark?: string;
  orangeLight?: string;
  green?: string;

  // 渐变色
  gradientRed?: string;
  gradientOrange?: string;

  // 组件颜色
  primaryColor?: string;
  successColor?: string;
  dangerColor?: string;
  warningColor?: string;
  textColor?: string;
  textColor2?: string;
  textColor3?: string;
  activeColor?: string;
  activeOpacity?: number;
  disabledOpacity?: number;
  background?: string;
  background2?: string;

  // Padding
  paddingBase?: string;
  paddingXs?: string;
  paddingSm?: string;
  paddingMd?: string;
  paddingLg?: string;
  paddingXl?: string;

  // 字体
  fontSizeXs?: string;
  fontSizeSm?: string;
  fontSizeMd?: string;
  fontSizeLg?: string;
  fontBold?: number;
  lineHeightXs?: string;
  lineHeightSm?: string;
  lineHeightMd?: string;
  lineHeightLg?: string;
  baseFont?: string;
  priceFont?: string;

  // 动画
  durationBase?: string;
  durationFast?: string;
  easeOut?: string;
  easeIn?: string;

  // Border
  borderColor?: string;
  borderWidth?: string;
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusMax?: string;
};

/** 配置主题的所有变量 */
export type ConfigProviderThemeVars = BaseThemeVars &
  import('../badge').BadgeThemeVars &
  import('../button').ButtonThemeVars;