import { InjectionKey } from "vue";
import type { FormProvide } from '../form/types';


// 这里面存放一些常量
export const BORDER = 'van-hairline';
export const BORDER_SURROUND = `${BORDER}--surround`;
export const BORDER_TOP_BOTTOM = `${BORDER}--top-bottom`;

/** 组件 inject 注入的表单 Symbol */
export const FORM_KEY: InjectionKey<FormProvide> = Symbol('van-form');