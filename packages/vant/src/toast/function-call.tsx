import { getCurrentInstance, ref, watch } from "vue";
import { extend, inBrowser, isObject } from "../utils";
import { mountComponent, usePopupState } from "../utils/mount-component";
import { ToastOptions, ToastType, ToastWrapperInstance } from "./types";
import VanToast from './Toast';

/** 使用函数直接弹窗的写法 */

/** 默认属性 */
const defaultOptions: ToastOptions = {
  icon: '',
  type: 'text',
  message: '',
  className: '',
  overlay: false,
  onClose: undefined,
  onOpened: undefined,
  duration: 2000,
  teleport: 'body',
  iconSize: undefined,
  iconPrefix: undefined,
  position: 'middle',
  transition: 'van-fade',
  forbidClick: false,
  loadingType: undefined,
  overlayClass: '',
  overlayStyle: undefined,
  closeOnClick: false,
  closeOnClickOverlay: false,
};

let queue: ToastWrapperInstance[] = []; // 弹窗队列
let allowMultiple = false; // 允许多个
let currentOptions = extend({}, defaultOptions); // 当前选项

// 特定类型的默认选项
const defaultOptionsMap = new Map<string, ToastOptions>();

/** 解析选项 */
function parseOptions(message: string | ToastOptions): ToastOptions {
  if (isObject(message)) {
    return message;
  }
  return { message };
}

function createInstance() {
  const { instance, unmount } = mountComponent({
    setup() {
      const message = ref('');
      const { open, state, close, toggle } = usePopupState();


      /** 销毁时清空对应队列 */
      const onClosed = () => {
        if (allowMultiple) {
          queue = queue.filter((item) => item !== instance);
          unmount();
        }
      };

      const render = () => {
        const attrs: Record<string, unknown> = {
          onClosed,
          'onUpdate:show': toggle,
        };

        return <VanToast {...state} {...attrs} />;
      }

      // 支持消息的动态修改
      watch(message, (val) => {
        state.message = val;
      });

      // 重写渲染函数
      (getCurrentInstance() as any).render = render;

      return {
        open,
        close,
        message,
      };
    }
  })

  return instance as ToastWrapperInstance;
}

/** 创建弹窗实例，添加到弹窗队列中 */
function getInstance() {
  if (!queue.length || allowMultiple) {
    const instance = createInstance();
    queue.push(instance);
  }

  return queue[queue.length - 1];
}


/**
 * 显示文本弹窗
 */
export function showToast(options: string | ToastOptions = {}) {
  if (!inBrowser) {
    return {} as ToastWrapperInstance;
  }

  const toast = getInstance();
  const parsedOptions = parseOptions(options);

  toast.open(
    extend(
      {},
      currentOptions,
      defaultOptionsMap.get(parsedOptions.type || currentOptions.type!),
      parsedOptions,
    ),
  );

  return toast;
}

const createMethod = (type: ToastType) => (options: string | ToastOptions) =>
  showToast(extend({ type }, parseOptions(options)));

/**
 * 显示加载弹窗
 */
export const showLoadingToast = createMethod('loading');

/**
 * 显示成功弹窗
 */
export const showSuccessToast = createMethod('success');

/**
 * 显示失败弹窗
 */
export const showFailToast = createMethod('fail');


/**
 * 关闭当前显示的 toast 弹窗
 */
export const closeToast = (all?: boolean) => {
  if (queue.length) {
    if (all) {
      queue.forEach((toast) => {
        toast.close();
      });
      queue = [];
    } else if (!allowMultiple) {  // 不允许多个就关闭弹窗队列里面的第一个弹窗
      queue[0].close();
    } else {
      queue.shift()?.close();
    }
  }
};



/**
 * 修改影响所有 “showToast” 调用的默认配置。
 * 指定 “type” 参数以修改特定类型 toast 的默认配置
 */
export function setToastDefaultOptions(options: ToastOptions): void;
export function setToastDefaultOptions(
  type: ToastType,
  options: ToastOptions,
): void;
export function setToastDefaultOptions(
  type: ToastType | ToastOptions,
  options?: ToastOptions,
) {
  if (typeof type === 'string') {
    defaultOptionsMap.set(type, options!);
  } else {
    extend(currentOptions, type);
  }
}


/**
 * 重置影响所有“showToast”调用的默认配置。
 * 指定“type”参数以重置特定类型toast的默认配置
 */
export const resetToastDefaultOptions = (type?: ToastType) => {
  if (typeof type === 'string') {
    defaultOptionsMap.delete(type);
  } else {
    currentOptions = extend({}, defaultOptions);
    defaultOptionsMap.clear();
  }
};

/**
 * 允许同时显示多个祝酒词
 */
export const allowMultipleToast = (value = true) => {
  allowMultiple = value;
};
