import { CSSProperties } from 'vue';
import { isDef, isNumeric, type Numeric } from './basic';

/** 添加 px 单位 */
export function addUnit(value?: Numeric): string | undefined {
  if (isDef(value)) {
    return isNumeric(value) ? `${value}px` : String(value);
  }
  return undefined;
}

const camelizeRE = /-(\w)/g;

export const camelize = (str: string): string =>
  str.replace(camelizeRE, (_, c) => c.toUpperCase());

/** 清除字符串两边的空格 */
function trimExtraChar(value: string, char: string, regExp: RegExp) {
  const index = value.indexOf(char);

  // 字符串中没有 . 字符就直接返回
  if (index === -1) {
    return value;
  }

  // 100-111 => 100
  if (char === '-' && index !== 0) {
    return value.slice(0, index);
  }

  // 只保留一个小数 100.22.33 => 100.2233
  return value.slice(0, index + 1) + value.slice(index).replace(regExp, '');
}

/** 格式化数字 */
export function formatNumber(
  value: string,
  allowDot = true,
  allowMinus = true,
) {

  // 支持小数点
  if (allowDot) {
    value = trimExtraChar(value, '.', /\./g);
  } else {
    value = value.split('.')[0];
  }

  // 支持负数
  if (allowMinus) {
    value = trimExtraChar(value, '-', /-/g);
  } else {
    value = value.replace(/-/, '');
  }

  // 只能输入数字
  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
  return value.replace(regExp, '');
}

/** 获取宽高尺寸样式 */
export function getSizeStyle(
  originSize?: Numeric | Numeric[],
): CSSProperties | undefined {
  if (isDef(originSize)) {
    if (Array.isArray(originSize)) {
      return {
        width: addUnit(originSize[0]),
        height: addUnit(originSize[1]),
      };
    }
    const size = addUnit(originSize);
    return {
      width: size,
      height: size,
    };
  }
}

/** 返回两个数相加的结果 保留小数点后十位的精度 */
export function addNumber(num1: number, num2: number) {
  const cardinal = 10 ** 10;
  return Math.round((num1 + num2) * cardinal) / cardinal;
}

/** z-index 样式可以是 字符串 ｜ 数字 */
export function getZIndexStyle(zIndex?: Numeric) {
  const style: CSSProperties = {};
  if (zIndex !== undefined) {
    style.zIndex = +zIndex;
  }
  return style;
}

/** 将 'buttonMiniHeight' 转换成 'button-mini-height'  */
export const kebabCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');