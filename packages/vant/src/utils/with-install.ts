import { camelize } from './format';
import type { App, Component } from 'vue';


// 解决 tsx下 组件事件 onClick 缺少的 typescript 定义。参考：https://github.com/vant-ui/vant/issues/8302
type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  }
}

export type WithInstall<T> = T & {
  install(app: App): void;
} & EventShim

export function withInstall<T extends Component>(options: T) {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options
    if (name) {
      app.component(name, options);
      app.component(camelize(`-${name}`), options)
    }
  }

  return options as WithInstall<T>;
}