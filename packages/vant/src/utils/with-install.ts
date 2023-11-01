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

/** 给组件添加一个 install 方法这样可以使用 vue.use 去注册组件 */
export function withInstall<T extends Component>(options: T) {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options
    if (name) {
      // 如：button 组件会注册 van-button 和 VanButton 两种名字的组件
      app.component(name, options);
      app.component(camelize(`-${name}`), options)
    }
  }

  return options as WithInstall<T>;
}