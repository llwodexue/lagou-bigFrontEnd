## 升级之路

之前的架子使用的是 [panjiachen](https://github.com/PanJiaChen/vue-element-admin)，使用的是 vue2.6.14，现在升级为 vue2.7.x

1. 首先需要升级 eslint

   ```bash
   npm i eslint@8 eslint-plugin-vue@9 -D
   
   - "eslint": "6.7.2",
   - "eslint-plugin-vue": "6.2.2",
   
   + "eslint": "^8.39.0",
   + "eslint-plugin-vue": "^9.11.0",
   ```

2. 升级 vue-cli

   ```bash
   npm i @vue/cli-plugin-babel@5 @vue/cli-plugin-eslint@5 @vue/cli-service@5 -D
   
   - "@vue/cli-plugin-babel": "4.4.4",
   - "@vue/cli-plugin-eslint": "4.4.4",
   - "@vue/cli-service": "4.4.4",
   
   + "@vue/cli-plugin-babel": "^5.0.8",
   + "@vue/cli-plugin-eslint": "^5.0.8",
   + "@vue/cli-service": "^5.0.8",
   ```

3. 修改 vue.config.js

   之前使用 JSDoc 的形式可以改为 `defineConfig` 帮手函数

   ```js
   /**
    * @type {import('@vue/cli-service').ProjectOptions}
    */
   module.exports = { }
   
   const { defineConfig } = require('@vue/cli-service')
   module.exports = defineConfig({ })
   ```

   preloadPlugin 需要单独下载并引入

   ```bash
   npm i @vue/preload-webpack-plugin -D
   ```

   之前直接使用 tap 连接即可，现在需要指定 plugin

   ```js
   config.plugin('preload').tap(() => [
     {
       rel: 'preload',
       fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
       include: 'initial'
     }
   ])
   
   config.plugin('preload').use(PreloadWebpackPlugin, [
     {
       rel: 'preload',
       fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
       include: 'initial'
     }
   ])
   ```

4. 升级 vue

   ```bash
   npm i vue@2
   
   - "vue": "2.6.10",
   + "vue": "^2.7.14",
   ```

   

