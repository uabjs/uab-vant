import { type CSSProperties, ExtractPropTypes, InjectionKey, PropType, computed, defineComponent, provide, watchEffect, watch, onActivated, onDeactivated, onBeforeUnmount } from "vue";
import { type Numeric, createNamespace, extend, inBrowser, kebabCase, makeStringProp } from "../utils";
import { setGlobalZIndex } from "../composables/use-global-z-index";

/**
 * theme：主题色，就是给 html 标签设置上 van-theme-light 或 van-theme-dark 的 class 样式
 * theme-vars-scope: 影响子组件的样式（local 就是把 css 变量添加到当前组件 style 上） ｜ （global 就是添加到 html 标签上）
 */

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
  themeVars: Object as ThemeVars, // 自定义主题变量，局部生效
  themeVarsDark: Object as ThemeVars, // 仅在深色模式下生效的主题变量
  themeVarsLight: Object as ThemeVars, // 仅在浅色模式下生效的主题变量
  themeVarsScope: makeStringProp<ConfigProviderThemeVarsScope>('local'), // 默认仅影响子组件的样式，设置为 global 整个页面生效
  zIndex: Number, // 设置所有弹窗类组件的 z-index，该属性对全局生效
  iconPrefix: String, // 所有图标的类名前缀
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
  return cssVars;
}


/** 将变量同步到 html 标签上 */
function syncThemeVarsOnRoot(
  newStyle: Record<string, Numeric> = {},
  oldStyle: Record<string, Numeric> = {},
) {
  Object.keys(newStyle).forEach((key) => {
    // 新的属性不等于旧的属性时需要更新
    if (newStyle[key] !== oldStyle[key]) {
      document.documentElement.style.setProperty(key, newStyle[key] as string);
    }
    // 删除旧的属性
    Object.keys(oldStyle).forEach((key) => {
      if (!newStyle[key]) {
        document.documentElement.style.removeProperty(key);
      }
    })
  })
}


export default defineComponent({
  name,

  props: configProviderProps,

  setup(props, { slots }) {

    // 将主题变量映射到CSS变量 如：{ '--van-button-primary-color': '#2c9efa' }
    const style = computed<CSSProperties | undefined>(() =>
      mapThemeVarsToCSSVars(
        extend(
          {},
          props.themeVars,
          props.theme === 'dark' ? props.themeVarsDark : props.themeVarsLight,
        ),
      ),
    );


    // 浏览器环境下执行
    if (inBrowser) {
      /** 给 html 标签上添加 van-theme-light 或 van-theme-dark 属性 */
      const addTheme = () => {
        document.documentElement.classList.add(`van-theme-${props.theme}`)
      }

      /** 给 html 标签上删除 van-theme-light 或 van-theme-dark 属性 */
      const removeTheme = (theme = props.theme) => {
        document.documentElement.classList.remove(`van-theme-${theme}`);
      }

      // 监听主题变化
      watch(
        () => props.theme,
        (newVal, oldVal) => {
          if (oldVal) {
            removeTheme(oldVal);
          }
          addTheme()
        },
        { immediate: true }, // 立即执行
      )

      onActivated(addTheme); // 组件激活时执行
      onDeactivated(removeTheme); // 组件失活时执行
      onBeforeUnmount(removeTheme); // 组件卸载时执行

      // 如果主题变量是全局生效则需要监听主题变量变化, 将变量同步到 html 标签上
      watch(style, (newStyle, oldStyle) => {
        if (props.themeVarsScope === 'global') {
          syncThemeVarsOnRoot(
            newStyle as Record<string, Numeric>,
            oldStyle as Record<string, Numeric>,
          )
        }
      })

      // 监听主题变量是否全局生效，如果是则需要将变量同步到 html 标签上，否则需要删除 html 标签上的变量
      watch(
        () => props.themeVarsScope,
        (newScope, oldScope) => {
          if (oldScope === 'global') {
            // 在根上删除
            syncThemeVarsOnRoot({}, style.value as Record<string, Numeric>);
          }
          if (newScope === 'global') {
            // 附加根
            syncThemeVarsOnRoot(style.value as Record<string, Numeric>, {});
          }
        },
      );

      // 初始化时css变量是全局生效则需要将变量同步到 html 标签上
      if (props.themeVarsScope === 'global') {
        syncThemeVarsOnRoot(style.value as Record<string, Numeric>, {});
      }
    }


    // 通过 provide 将配置数据传递给子组件
    provide(CONFIG_PROVIDER_KEY, props);

    // 设置全局 z-index，影响所有弹窗类组件
    watchEffect(() => {
      if (props.zIndex !== undefined) {
        setGlobalZIndex(props.zIndex);
      }
    })


    // themeVarsScope === 'local' 表示仅影响子组件的样式，只在父组件 style 属性内添加 css 变量
    return () => (
      <props.tag class={bem()} style={props.themeVarsScope === 'local' ? style.value : undefined}>
          {slots.default?.()}
      </props.tag>
    )
  }
})