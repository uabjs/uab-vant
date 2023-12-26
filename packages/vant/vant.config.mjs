export default {
  name: 'uab vant',
  build: {
    srcDir: 'src',
    tagPrefix: 'van-',
    namedExport: true,
    skipInstall: ['lazyload'],
    packageManager: 'pnpm',
    extensions: {
      esm: '.mjs',
    },
    site: {
      publicPath: '/uab-vant/',
    },
    vetur: {
      tagPrefix: 'van-',
    },
    css: {
      removeSourceFile: true,
    },
  },
  site: {
    defaultLang: 'en-US',
    darkModeClass: 'van-theme-dark',
    lightModeClass: 'van-theme-light',
    locales: {
      'zh-CN': {
        title: 'Uab Vant',
        subtitle: '（适用于 Vue 3）',
        description: '轻量、可定制的移动端组件库',
        logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
        langLabel: '中',
        links: [
          {
            logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/github.svg',
            url: 'https://github.com/vant-ui/vant',
          },
        ],
        nav: [
          {
            title: '开发指南',
            items: [
              {
                path: 'home',
                title: '介绍',
              },
              {
                path: 'quickstart',
                title: '快速上手',
              },
              {
                path: 'locale',
                title: '国际化',
              },
            ]
          },
          {
            title: '基础组件',
            items: [
              {
                path: 'button',
                title: 'Button 按钮',
              },
              {
                path: 'cell',
                title: 'Cell 单元格',
              },
              {
                path: 'config-provider',
                title: 'ConfigProvider 全局配置',
              },
              {
                path: 'icon',
                title: 'Icon 图标',
              },
              {
                path: 'popup',
                title: 'Popup 弹出层',
              },
              {
                path: 'style',
                title: 'Style 内置样式',
              },
              {
                path: 'toast',
                title: 'Toast 轻提示',
              },
            ]
          },
          {
            title: '表单组件',
            items: [
              {
                path: 'checkbox',
                title: 'Checkbox 复选框',
              },
              {
                path: 'field',
                title: 'Field 输入框',
              },
              {
                path: 'form',
                title: 'Form 表单',
              },
              {
                path: 'radio',
                title: 'Radio 单选框',
              },
              {
                path: 'stepper',
                title: 'Stepper 步进器',
              },
            ]
          },
          {
            title: '反馈组件',
            items: [
              {
                path: 'overlay',
                title: 'Overlay 遮罩层',
              },
            ]
          },
          {
            title: '展示组件',
            items: [
              {
                path: 'badge',
                title: 'Badge 徽标',
              },
            ]
          }
        ]
      },
      'en-US': {
        title: 'Vant',
        subtitle: ' (for Vue 3)',
        description:
          'A lightweight, customizable Vue UI library for mobile web apps.',
        logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
        langLabel: 'EN',
        links: [
          {
            logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/github.svg',
            url: 'https://github.com/uabjs/uab-vant',
          },
        ],
        nav: [
          {
            title: 'Essentials',
            items: [
              {
                path: 'home',
                title: 'Introduction',
              },
              {
                path: 'quickstart',
                title: 'Quickstart',
              },
              {
                path: 'locale',
                title: 'Internationalization',
              },
            ]
          },
          {
            title: 'Basic Components',
            items: [
              {
                path: 'button',
                title: 'Button',
              },
              {
                path: 'cell',
                title: 'Cell',
              },
              {
                path: 'config-provider',
                title: 'ConfigProvider',
              },
              {
                path: 'icon',
                title: 'Icon',
              },
              {
                path: 'popup',
                title: 'Popup',
              },
              {
                path: 'style',
                title: 'Built-in style',
              },
              {
                path: 'toast',
                title: 'Toast',
              },
            ]
          },
          {
            title: 'Form Components',
            items: [
              {
                path: 'checkbox',
                title: 'Checkbox',
              },
              {
                path: 'field',
                title: 'Field',
              },
              {
                path: 'form',
                title: 'Form',
              },
              {
                path: 'radio',
                title: 'Radio',
              },
              {
                path: 'stepper',
                title: 'Stepper',
              },
            ]
          },
          {
            title: 'Action Components',
            items: [
              {
                path: 'overlay',
                title: 'Overlay',
              },
            ]
          },
          {
            title: 'Display Components',
            items: [
              {
                path: 'badge',
                title: 'Badge',
              },
            ]
          }
        ]
      }
    }
  },
}