# HTML5

## Preload

preload 是一个 HTML5 的新特性，是一个新的标签，对于浏览器加载来说，对于主资源 HTML 和 CSS 的优先级最高，其他资源优先级不统一。我们使用 preload 属性，可以让支持的浏览器提前加载资源，但加载时并不执行，等待需要时才进行执行

这样做的好处就是我们可以将加载和执行分离开，同时可以控制提前加载一些大型文件，防止使用时获取的页面闪烁

我们就可以用来指定页面加载后很快会被用到的资源，所以在页面加载的过程中，我们希望在浏览器开始主体渲染之前尽早 preload

默认情况下，一个 Vue CLI 应用会为所有初始化渲染需要的文件自动生成 preload 提示。这些提示会被 `@vue/preload-webpack-plugin` 注入，并且可以通过 `chainWebpack` 的 `config.plugin('preload')` 进行修改和删除

## Prefetch

是一种 resource hint，用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户可能会访问的内容

默认情况下，一个 Vue CLI 应用会为所有作为 async chunk 生成的 JavaScript 文件（通过动态 `import()` 按需 code spliting 的产物）自动生成 prefetch 提示

这些提示会被 `@vue/preload-webpack-plugin` 注入，并且可以通过 `chainWebpack` 的 `config.plugin('prefetch')` 进行修改和删除

当 prefetch 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码区块：

webpack 的运行时会在父级区块被加载之后注入 prefetch 链接

`import(/* webpackPrefetch: true */ './someAsyncComponent.vue')`