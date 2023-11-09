// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 运行时配置
  runtimeConfig: {
    appKey: 'aabbcc', // server
    public: {
      baseURL: 'http://codercba.com'
    }
  },
  app: {
    head: {
      title: '商城',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
      meta: [
        {
          name: 'keywords',
          content: '手机商城'
        },
        {
          name: 'description',
          content: '这是一个手机商城'
        }
      ],
      link: [
        {
          rel: 'shortcut icon',
          href: 'favicon.ico',
          type: 'image/x-icon'
        }
      ]
      // style: [
      //   {
      //     children: `body { color: red }`
      //   }
      // ]
    }
  },
  css: [
    '@/assets/styles/main.css',
    '@/assets/styles/global.scss',
    '@/assets/fonts/iconfont.css'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 自动给 scss 模块添加额外的数据
          additionData: '@use "~/assets/styles/variables.scss" as *'
        }
      }
    }
  }
  // ssr: false,
  // router: {
  //   options: {
  //     hashMode: true
  //   }
  // }
  // devtools: { enabled: true }
})
