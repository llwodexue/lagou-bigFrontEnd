## vue2.7升级指南

> [vue2.7升级指南](https://v2.cn.vuejs.org/v2/guide/migration-vue-2-7.html#升级指南)

之前的架子使用的是 [panjiachen](https://github.com/PanJiaChen/vue-element-admin)，使用的是 vue2.6.14，现在升级为 vue2.7.x

### 升级@vue/cli

**vue upgrade**

这里推荐使用 `vue upgrade` 命令自动升级

```bash
# 确保安装全局 @vue/cli
$ npm install -g @vue/cli
$ vue upgrade

WARN  There are uncommitted changes in the current repository, it's recommended to commit or stash them first.
? Still proceed? Yes
✔  Gathering package information...
  Name                    Installed       Wanted          Latest          Command to upgrade
  @vue/cli-service        4.4.4           4.4.4           5.0.8           vue upgrade @vue/cli-service
  @vue/cli-plugin-babel   4.4.4           4.4.4           5.0.8           vue upgrade @vue/cli-plugin-babel
  @vue/cli-plugin-eslint  4.4.4           4.4.4           5.0.8           vue upgrade @vue/cli-plugin-eslint
? Continue to upgrade these plugins? Yes
Upgrading @vue/cli-service from 4.4.4 to 5.0.8
🚀  Running migrator of @vue/cli-service
✔  Successfully invoked migrator for plugin: @vue/cli-service
Upgrading @vue/cli-plugin-babel from 4.4.4 to 5.0.8
🚀  Running migrator of @vue/cli-plugin-babel
✔  Successfully invoked migrator for plugin: @vue/cli-plugin-babel
Upgrading @vue/cli-plugin-eslint from 4.4.4 to 5.0.8
🚀  Running migrator of @vue/cli-plugin-eslint
📦  Installing additional dependencies...
✔  Successfully invoked migrator for plugin: @vue/cli-plugin-eslint
 eslint  ESLint upgraded from v5. to v7
```

这里发现有 3 个文件发生了修改，`babel.config.js` 实际上没有发生改变

![image-20230810101857391](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230810101857391.png)

**vue upgrade 帮你做的事情**

如果不这么做，需要进行如下操作，十分麻烦。如果依赖冲突，可以使用 `npm i --legacy-peer-deps` 进行安装

1. 将 `@vue/cli-xxx` 依赖升级至最新版本范围，这里我打算使用 vue-cli5

   - v4 升级至 `~4.5.18`
   - v5 升级至 `~5.0.6`

   ```bash
   $ npm i @vue/cli-plugin-babel@5 @vue/cli-plugin-eslint@5 @vue/cli-service@5 -D
   
   - "@vue/cli-plugin-babel": "4.4.4"
   - "@vue/cli-plugin-eslint": "4.4.4"
   - "@vue/cli-service": "4.4.4"
   + "@vue/cli-plugin-babel": "^5.0.8"
   + "@vue/cli-plugin-eslint": "^5.0.8"
   + "@vue/cli-service": "^5.0.8"
   ```

2. 升级 `eslint`，并安装 `@babel/core`

   ```bash
   $ npm i eslint@7 eslint-plugin-vue@8 -D
   - "eslint": "6.7.2"
   - "eslint-plugin-vue": "6.2.2"
   + "eslint": "^7.32.0"
   + "eslint-plugin-vue": "^8.0.3"
   + "@babel/core": "^7.12.16"
   ```

   还需要升级 `eslint` 对应的 parser，安装 `@babel/eslint-parse`

   ```bash
   $ npm un babel-eslint
   $ npm i @babel/eslint-parser@7 @babel/core@7
   
   - "babel-eslint": "10.1.0"
   + "@babel/eslint-parser": "^7.12.16"
   ```

   之后修改 `.eslintrc.js` 对应的 parse

   ```js
   module.exports = {
     parserOptions: {
       parser: '@babel/eslint-parser'
     }
   }
   ```

### 解决@vue/cli报错

升级完 vue-cli 需要解决一下 vue-cli 语法升级报的错，需要修改 `vue.config.js`

1. 之前使用 JSDoc 的形式可以改为 `defineConfig` 帮手函数

   ```js
   /**
    * @type {import('@vue/cli-service').ProjectOptions}
    */
   module.exports = { }
   
   // 需要改为如下内容
   const { defineConfig } = require('@vue/cli-service')
   module.exports = defineConfig({ })
   ```

2. `devtool` 更加严格，填写之前去 webpack 官网查一下：

   [https://www.webpackjs.com/configuration/devtool/](https://www.webpackjs.com/configuration/devtool/)

   ```bash
   # 报错信息
   ValidationError: Invalid configuration object. Webpack has been initialized using a configuration object that does not match the API schema.
   	- configuration.devtool should match pattern "^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$".
   	BREAKING CHANGE since webpack 5: The devtool option is more strict.
   Please strictly follow the order of the keywords in the pattern
   ```

   比如：你写 `cheap-module-eval-source-map` 是不合法的，需要改为 `eval-cheap-module-source-map`

   ```js
   config.when(process.env.NODE_ENV === 'development', config => config.devtool('eval-cheap-module-source-map'))
   ```

3. devServer 有很多配置发生了变化,比如：

   ```js
   {
     devServer: {
       hotOnly: true
       overlay: {
         warnings: false,
         errors: true
       },
       before: require('./mock/mock-server.js'),
       disableHostCheck: true
     }
   }
   
   // 需要改为
   {
     devServer: {
       hot: "only",
       onBeforeSetupMiddleware: require('./mock/mock-server.js'),
       client: {
         overlay: {
           warnings: false,
           errors: true
         }
       },
       allowedHosts: "all"
     }
   }
   ```

   可以参考：[https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md](https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md)

   比如这里报错 'disableHostCheck' 是未知属性，就可以在这个文档中查一下，看看它改成了什么

   ```bash
   # 报错信息
   ValidationError: Invalid options object. Dev Server has been initialized using an options
   
   object that does not match the API schema.
   	- options has an unknown property 'disableHostCheck'. These properties are valid:        
   	object { allowedHosts?, bonjour?, client?, compress?, devMiddleware?, headers?, historyApiFallback?, host?, hot?, http2?, https?, ipc?, liveReload?, magicHtml?, onAfterSetupMiddleware?, onBeforeSetupMiddleware?, onListening?, open?, port?, proxy?, server?, setupExitSignals?, setupMiddlewares?, static?, watchFiles?, webSocketServer? }
   ```

4. svg 报错问题

   ```bash
   ERROR in ./src/pages/xx/icons/svg/wechat.svg
   Module build failed (from ./node_modules/svg-sprite-loader/lib/loader.js):
   Error: Cannot find module 'webpack/lib/RuleSet'
   ```

   升级 `svg-sprite-loader` 即可

   ```bash
   $ npm i svg-sprite-loader@6
   - "svg-sprite-loader": "4.1.3"
   + "svg-sprite-loader": "^6.0.11"
   ```

5. path 模块找不到问题

   ```bash
   Module not found: Error: Can't resolve 'path' in 'E:\xx\src\pages\xx\components\layout\components\Sidebar'
   
   BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
   
   This is no longer the case. Verify if you need this module and configure a polyfill for it.
   If you want to include a polyfill, you need to:
   	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
   	- install 'path-browserify'
   If you don't want to include a polyfill, you can use an empty module like this: resolve.fallback: { "path": false }
   ```

   webpack5 不再自动填充 Node 核心模块，如果你想使用的话需要从 npm 安装兼容的模块并自己包含它们。其它模块同理

   [https://webpack.js.org/configuration/resolve/#resolvefallback](https://webpack.js.org/configuration/resolve/#resolvefallback)

   ```bash
   $ npm i path-browserify -D
   + "path-browserify": "^1.0.1"
   ```

   引入即可。不过这里我尝试用链式调用的写法去写，没生效

   ```js
   {
     configureWebpack: {
       resolve: {
         fallback: {
           path: require.resolve('path-browserify')
         }
       }
     }
   }
   ```

6. npm i 报错

   可以使用 `npm i --legacy-peer-deps` 解决

   ```bash
   npm ERR! Fix the upstream dependency conflict, or retry
   npm ERR! this command with --force, or --legacy-peer-deps
   npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
   ```

   不过也要统一把对应插件的版本全部升级一遍。比如：`copy-webpack-plugin`、`html-webpack-plugin`

   - `copy-webpack-plugin@5` 对应 `webpack@4`

     里面的配置写法稍有变更，照着提示改下即可

   - `html-webpack-plugin@3` 对应 `webpack@4` 

   - `script-ext-html-webpack-plugin@2` 对应 `webpack@4`

     内联 runtime 的代码就直接删掉了

   ```bash
   $ npm i copy-webpack-plugin@11 -D
   - "copy-webpack-plugin": "5.0.5"
   + "copy-webpack-plugin": "^11.0.0"
   
   $ npm i html-webpack-plugin@5
   - "html-webpack-plugin": "3.2.0"
   + "html-webpack-plugin": "^5.5.3"
   
   $ npm un script-ext-html-webpack-plugin
   - "script-ext-html-webpack-plugin": "2.1.3"
   ```

7. css 全局变量

   需要把 `pretendData` 改为 `additionalData `

   ```js
   {
     css: {
       loaderOptions: {
         sass: {
           additionalData: '@import "~@/styles/variables.scss";'
         }
       }
     }
   }
   ```

8. 多入口 plugin 异常问题（没有使用多入口的可以跳过这个问题）

   ```bash
   # 报错信息
   Error: Cannot call .tap() on a plugin that has not yet been defined. Call plugin('preload')
   ```

   可以参考：[https://cli.vuejs.org/zh/config/#pages](https://cli.vuejs.org/zh/config/#pages) 这里面的提示

   如果你试图修改 `html-webpack-plugin` 和 `preload-webpack-plugin` 插件的选项，可以使用 `vue inspect --plugins` 看看都有哪些 plugin

   ```bash
   $ npm i @vue/preload-webpack-plugin -D
   + "@vue/preload-webpack-plugin": "^2.0.0"
   ```

   之前直接使用 tap 连接即可，现在需要指定 plugin

   ```js
   Object.keys(pages).forEach(name => {
     config.plugin(`preload-${name}`).tap(() => [
       {
         rel: 'preload',
         fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
         include: 'initial'
       }
     ])
     config.plugins.delete(`prefetch-${name}`)
   })
   
   // 需要改为如下内容
   Object.keys(pages).forEach(name => {
     config.plugin(`preload-${name}`).use(require('@vue/preload-webpack-plugin'), [
       {
         rel: 'preload',
         fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
         include: 'initial'
       }
     ])
     config.plugins.delete(`prefetch-${name}`)
   })
   ```

9. sass 警告问题

   ```bash
   Deprecation Warning: Using / for division outside of calc() is deprecated and will be removed in Dart Sass 2.0.0.
   Recommendation: math.div($--tooltip-arrow-size, 2) or calc($--tooltip-arrow-size / 2)
   More info and automated migrator: https://sass-lang.com/d/slash-div
      ╷
   89 │     margin-bottom: #{$--tooltip-arrow-size / 2};
      │                      ^^^^^^^^^^^^^^^^^^^^^^^^^
      ╵
       node_modules\element-ui\packages\theme-chalk\src\popper.scss 89:22         @content
       node_modules\element-ui\packages\theme-chalk\src\mixins\mixins.scss 74:5   b()
       node_modules\element-ui\packages\theme-chalk\src\popper.scss 4:1           @import
       node_modules\element-ui\packages\theme-chalk\src\select-dropdown.scss 3:9  @import
       node_modules\element-ui\packages\theme-chalk\src\select.scss 4:9           @import
       node_modules\element-ui\packages\theme-chalk\src\pagination.scss 4:9       @import
       node_modules\element-ui\packages\theme-chalk\src\index.scss 2:9            @import
       stdin 25:9                                                                 root stylesheet
   Warning: 33 repetitive deprecation warnings omitted.
   ```

   升级 sass 版本 和 sass-loader 版本，注意里面 deep 写法也需要改变，需要改为 `::v-deep`

   ```bash
   $ npm i sass sass-loader@12
   - "sass": "1.26.2"
   - "sass-loader": "8.0.2"
   + "sass": "^1.44.0"
   + "sass-loader": "^12.6.0"
   ```

### 升级vue

1. 升级 `vue` 至 2.7。同时可以将 `vue-template-compiler` 从依赖中移除

   如果你在使用 `@vue/test-utils`，那么 `vue-template-compiler` 需要保留

   ```bash
   $ npm i vue@2.7
   $ npm un vue-template-compiler
   
   - "vue": "2.6.10",
   - "vue-template-compiler": "^2.6.11",
   + "vue": "^2.7.14",
   ```

2. 这里我没有使用 vite，很多和 vite 相关的就没必要处理了
