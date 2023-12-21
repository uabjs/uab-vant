import { CSSProperties, ExtractPropTypes, InjectionKey, PropType, computed, defineComponent, provide } from "vue";
import { Numeric, createNamespace, extend, kebabCase, makeStringProp } from "../utils";

/** 通过 provide 将配置数据传递给子组件 */
const [name, bem] = createNamespace('config-provider');

export type ConfigProviderTheme = 'light' | 'dark';

export type ConfigProviderThemeVarsScope = 'local' | 'global';

export type ConfigProviderProvide = {
  iconPrefix?: string;
};

/** 配置 provide 注入的 key */
export const CONFIG_PROVIDER_KEY: InjectionKey<ConfigProviderProvide> = Symbol(name);

export type ThemeVars = PropType<Record<string, Numeric>>;

export const configProviderProps = {
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  theme: makeStringProp<ConfigProviderTheme>('light'), // 主题色，默认 light
  themeVars: Object as ThemeVars,
  themeVarsDark: Object as ThemeVars,
  themeVarsLight: Object as ThemeVars,
  themeVarsScope: makeStringProp<ConfigProviderThemeVarsScope>('local'),
}

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;


/** 将 `gray1` 变成 `gray-1` */
function insertDash(str: string) {
  return str.replace(/([a-zA-Z])(\d)/g, '$1-$2');
}

/** 将 { buttonMiniHeight: 100 } 变成 { "--van-button-mini-height": 100 }  */
function mapThemeVarsToCSSVars(themeVars: Record<string, Numeric>) {
  const cssVars: Record<string, Numeric>= {};
  Object.keys(themeVars).forEach((key) => {
    const formattedKey = insertDash(kebabCase(key));
    cssVars[`--van-${formattedKey}`] = themeVars[key];
  });
}


export default defineComponent({
  name,

  props: configProviderProps,

  setup(props, { slots }) {

    // 将主题变量映射到CSS变量
    const style = computed<CSSProperties | undefined>(() => 
      mapThemeVarsToCSSVars(
        extend(
          {},
          props.themeVars,
          props.theme === 'dark' ? props.themeVarsDark : props.themeVarsLight,
        )
      )
    )


    provide(CONFIG_PROVIDER_KEY, props);


    return () => (
      <props.tag class={bem()} style={props.themeVarsScope === 'local' ? style.value : undefined}>
          {slots.default?.()}
      </props.tag>
    )
  }
})