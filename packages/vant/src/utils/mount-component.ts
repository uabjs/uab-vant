import { Component, createApp, reactive } from "vue";
import { extend } from "./basic";
import { useExpose } from "../composables/use-expose";


/** use方法：管理 Popup 弹窗状态 */
export function usePopupState() {
  const state = reactive<{
    show: boolean;
    [key: string]: any;
  }>({
    show: false,
  });

  /** 设置显示状态 */
  const toggle = (show: boolean) => {
    state.show = show;
  };


  /** 打开 */
  const open = (props: Record<string, any>) => {
    extend(state, props, { transitionAppear: true });
    toggle(true);
  };

  /** 关闭 */
  const close = () => toggle(false);

  /** 暴露 open, close, toggle 方法到实例上 */
  useExpose({ open, close, toggle });


  return {
    open,
    close,
    state, // 返回一个状态
    toggle,
  };
}

export function mountComponent(RootComponent: Component) {
  const app = createApp(RootComponent);
  const root = document.createElement('div');

  document.body.appendChild(root);

  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    }
  }
}