## Web Components

> [css-doodle](css-doodle.com)
>
> [fancy-components](https://github.com/fancy-components/fancy-components)

### vue 配置

![image-20230418105647523](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230418105647523.png)

vue 需要对 web components 做单独处理

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: tag => tag.startsWith('fc-')
        }
        return options
      })
  }
}

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('fc-')
        }
      }
    })
  ]
})
```

html 里使用 web components

```html
<template>
  <slot name="h1"></slot>
  <slot name="h2"></slot>
</template>

<script>
  const dom = document.currentScript.ownerDocument.querySelector('template')

  customElements.define(
    'my-span',
    class extends HTMLElement {
      constructor() {
        super()
        this.attachShadow({ mode: 'open' }).appendChild(dom)
      }
    }
  )
</script>
```

```html
<link rel="import" href="my-span.html" />

<my-span>
  <h1 slot="h1">h1</h1>
  <h2 slot="h2">h2</h2>
</my-span>
```

### 技术集合

1. HTML Imports 废弃

   可以使用 HTML Modules `<script type="module"></script>`

2. HTML templates

3. Custom Elements

4. Shadow DOM

```js
// 创建一个 <a-b-c> 的元素，名为 el
const el = document.createElement('a-b-c')

// 定义一个名为 <a-b-c> 的组件
customElements.define('a-b-c', class extends HTMLElement {})

// 获取 <a-b-c> 组件的构造函数
customElements.get('a-b-c')

// 升级我们之前创建的 el 元素
customElements.upgrade(el)

// 当 <a-b-c> 组件定义后
customElements.whenDefined('a-b-c').then(() => {
  /* 当 <a-b-c> 组件定义后的回掉函数 */
})
```

生命周期

```html
<fancy-components></fancy-components>

<script>
  customElements.define(
    'fancy-components',
    class extends HTMLElement {
      constructor() {
        super()
        // 相当于 Vue 的 setup
        console.log('先运行构造函数')
      }
      connectedCallback() {
        // 相当于 Vue 的 mounted
        console.log('再运行连接回调')
      }
      disconnectedCallback() {
        // 相当于 Vue 的 unmounted
        console.log('当删除组件时才会运行失联回调')
      }
      adoptedCallback() {
        // 当使用 document.adoptNode 后会触发该生命周期
        console.log('当使用 document.adoptNode 后会运行收养回调')
      }
    }
  )
</script>
```

