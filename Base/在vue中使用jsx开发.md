## 安装 JSX 插件

在 Vue2 中要想使用 jsx 开发，需要安装 `@vue/babel-preset-jsx` 等插件，之后在 babel 里指定即可，详细可以参考下面的 Vue2 GitHub 文档

> Vue2：[GitHub 文档 —— Babel Preset JSX](https://github.com/vuejs/jsx-vue2)

最近在使用 Vue3，突然想用 jsx 进行开发部分页面，顺便记录一下，也可以参考下面的 Vue3 GitHub 文档

> Vue3：[GitHub 文档 —— Babel Plugin JSX for Vue 3.0](https://github.com/vuejs/babel-plugin-jsx)

构建工具使用的是 vite，要想使用 jsx 开发，需要安装 `@vitejs/plugin-vue-jsx`，之后配置 `vite.config.js` 里的 plugins 即可

```js
// vite.config.js
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    plugins: [vueJsx()]
  }
})
```

接下来着重说一下在使用 `.vue` 文件和 `.jsx` 文件在使用语法上的差异

## 使用语法差异

### 模板

之前在 template 里写的 html 代码需要放到 render 函数或 setup 函数里，Vue3 在 setup 里写会好一点

```html
<!-- .vue -->
<template>
  <div>Hello World</div>
</template>

<!-- .jsx -->
<script>
export default defineComponent({
  setup() {
    return () => (
      <div>Hello World</div>
    )
  }
})
</script>
```

### 指令

需要把双引号改为单括号

- `v-if`、`v-show`、`v-html` 等同理
- `v-bind` 也是一样的，不过需要把动态绑定需要去掉 `:`

**注意：**

- 在 `.vue` 文件中，ref 在模板中会自动进行解包，所以不需要使用 `.value`
- 但是在 `.jsx` 文件中，ref 在模板中不会自动解包，所以需要使用 `.value`

```html
<!-- .vue -->
<el-input v-model="queryParams.pageNumber" />
<el-form model="queryParams" :inline="true">...</el-form>

<!-- .jsx -->
<el-input v-model={queryParams.value.pageNumber} />
<el-form model={queryParams.value} inline={true}>...</el-form>
```

### 事件修饰符

- 想使用事件修饰符可以把 `v-model` 改为一个数组，事件修饰符需要以**数组的形式传递**

  如果需要传递参数，需要在数组第二个参数中**以字符串形式传递**

- 推荐：可以使用 `_` 来分割事件修饰符，GitHub 里没有特殊声明，但是 `Babel Plugin JSX for Vue 3.0` 源码里做了判断，可以参考： [parseDirectives.ts#L52-L61](https://github.com/vuejs/babel-plugin-jsx/blob/dev/packages/babel-plugin-jsx/src/parseDirectives.ts#L52-L61)

```html
<!-- .vue -->
<el-input v-model.trim={ queryParams.name } />

<!-- .jsx -->
<el-input v-model={ [queryParams.value.name, ['trim'] } />
<!-- 或 -->
<el-input v-model_trim={ refVal.value } />
```

**自定义指令**

如下示例为：添加 `.event` 事件修饰符并传递 arg 参数，直接打印 `binding` 效果如下：

![image-20220901105132150](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220901105132150.png)

```html
<!-- .vue -->
<el-button
  v-hasPermission:arg.event="['xxx:add']"
  type="primary"
  plain
  icon="Plus"
  @click="handleAdd"
>
  新增
</el-button>

<!-- .jsx -->
<el-button
  v-hasPermission={[['xxx:add'], 'arg', ['event']]}
  type='primary'
  plain
  icon="Plus"
  onClick={handleAdd}
>
  新增
</el-button>
```

### v-for

- `v-for` 无法直接使用，需要使用 map 去实现循环遍历渲染

```html
<!-- .vue -->
<h1 v-for="item in list" :key="item">{{item}}</h1>

<!-- .jsx -->
<script>
{list.value.map(item => (
  <h1>{item}</h1>
))}
</script>
```

**注意：**

- 如果遍历时需要判断每一项其是否显示，不能使用 `v-if`，需要使用三元运算符
- `v-for` 与 `v-if` 不能一起使用

```html
<!-- .vue -->
<template v-for="col in columns">
  <el-table-column
    v-if="col.visible"
    :key="col.key"
    :label="col.label"
    :prop="col.field"
  />
</template>

<!-- .jsx -->
{columns.value.map(col =>
  col.visible ? (
    <el-table-column
      key={col.id}
      label={col.label}
      prop={col.field}
    />
  ) : null
)}
```

### v-on

- `v-on` 无法直接使用，需要使用原生绑定事件的方式去实现（`@ -> on`，之后进行驼峰）

```html
<!-- .vue -->
<el-button @click="handleQuery">搜索</el-button>

<!-- .jsx -->
<el-button onClick={handleQuery}>搜索</el-button>
```

系统按键修饰符不能通过 `.xxx` 形式书写，需要自己进行判断，比如如下示例是按回车时进行搜索

- 这里顺便说一下 style，由于里面是 `:` 形式表示，需要改为对象形式书写

```html
<!-- .vue -->
<el-input
  v-model.trim="queryParams.number"
  clearable
  style="width: 180px"
  @keyup.enter="handleQuery"
/>

<!-- .jsx -->
<el-input
  v-model_trim={queryParams.value.number}
  clearable
  style={{ width: '180px' }}
  onKeyup={e => e.code === 'Enter' && handleQuery()}
/>
```

### 插槽

在 jsx 中，应该使用 `v-slots` 代替 `v-slot`，且插槽需要是函数式组件

```html
<!-- .vue -->
<el-dialog
  v-model="configOpen"
  title="弹出框"
  append-to-body
  >
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="configOpen = false">取 消</el-button>
    </div>
  </template>
</el-dialog>

<!-- .jsx -->
<el-dialog
  v-model={configOpen.value}
  title='弹出框'
  append-to-body
  v-slots={{
    footer: () => (
      <div class='dialog-footer'>
        <el-button
          onClick={() => {
            configOpen.value = false
          }}
        >
          取 消
        </el-button>
      </div>
    )
  }}
  >
  <!-- ... -->
</el-dialog>
```

