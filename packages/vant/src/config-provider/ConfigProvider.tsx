import { ExtractPropTypes, defineComponent } from "vue";
import { createNamespace } from "../utils";


const [name, bem] = createNamespace('config-provider');

export type ConfigProviderTheme = 'light' | 'dark';

export type ConfigProviderThemeVarsScope = 'local' | 'global';

export type ConfigProviderProvide = {
  iconPrefix?: string;
};

export const configProviderProps = {

}

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;


export default defineComponent({
  name,

  props: configProviderProps,

  setup(props, { slots }) {
    return () => (
      <div></div>
    )
  }
})