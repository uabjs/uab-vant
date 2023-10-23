// 描述 Vue 单文件组件（.vue 文件）的类型
declare module '*.vue' {
  // eslint-disable-next-line
  import { DefineComponent } from 'vue';
  const Component: DefineComponent;
  export default Component;
}
