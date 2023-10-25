export default {
  name: 'vant',
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
      publicPath: '/vant/',
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
        title: 'Vant',
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
                path: 'style',
                title: 'Style 内置样式',
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
                path: 'style',
                title: 'Built-in style',
              },
            ]
          }
        ]
      }
    }
  },
}