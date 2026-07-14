# Webpack & 构建工具面试题

## Webpack 核心概念

### Loader 与 Plugin

- **Loader**：文件转换器。在模块打包之前将资源按配置交给不同 Loader 处理，本质是管道模型，同一资源可依次经过多个 Loader（`use` 数组）
- **Plugin**：扩展器。基于 Tapable 钩子机制，在编译生命周期各阶段挂载回调函数，实现自动化任务

### source map

| 选项 | 说明 |
|------|------|
| `inline` | 不生成独立文件，嵌入 bundle |
| `cheap` | 仅精确到行，不包含第三方模块 |
| `module` | 包含第三方模块和 Loader 转换前源码 |
| `eval` | 使用 eval 执行模块，通过 sourceURL 标注路径 |

- 开发环境推荐：`cheap-module-eval-source-map`
- 生产环境推荐：`nosources-source-map`（配合监控平台）或 `hidden-source-map`（仅暴露行列信息）

### 文件指纹

1. **hash**：每次构建全局唯一，文件无变化也会变
2. **chunkhash**：同一 chunk 生成相同 hash；JS 引入 CSS 时两者 hash 会绑定
3. **contenthash**：按文件内容生成，不同文件 hash 不同，最精确

### compiler 与 compilation

- **compiler**：贯穿 webpack 完整生命周期，记录环境与配置信息
- **compilation**：每次文件变动重新创建，记录单次编译的模块信息

---

## Webpack 构建流程

### 核心三要素

1. 构建的核心流程
2. Loader 的作用
3. Plugin 的常用套路

### 构建流程

```js
const webpack = require('webpack')
const compiler = webpack({ entry: './index.js' })
compiler.run((err, stats) => {
  // stats 包含构建时间与资源信息
})
```

**三个阶段：**

1. **初始化**：读取配置 → 创建 `compiler` → 初始化插件 → 执行 `compiler.run` → 确定入口
2. **编译**：调用 Loader 管道转换资源 → AST 解析 → 递归分析 `import/require` 生成依赖图
3. **生成**：模块组装为 chunk → chunk 转为独立文件 → 写入文件系统

Webpack 通过遍历 AST 识别 `import/require` 语句来确定模块依赖关系。与 Grunt/Gulp 仅执行预定义任务不同，Webpack 深入处理资源内容。

### Plugin 钩子机制

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('MyPlugin', compilation => {
      compilation.hooks.optimizeChunkAssets.tap('MyPlugin', assets => {})
    })
  }
}
```

**常用钩子：**

| 钩子 | 时机 | 参数 | 典型应用 |
|------|------|------|----------|
| `compiler.hooks.compilation` | 创建 compilation 后 | compilation | 获取 compilation 实例 |
| `compiler.hooks.make` | 正式编译开始 | compilation | EntryPlugin 初始化入口 |
| `compilation.hooks.optimizeChunks` | chunk 构建完毕 | chunks, chunkGroups | SplitChunksPlugin 拆分 |
| `compiler.hooks.done` | 编译完成 | stats | bundle-analyzer 分析 |

钩子回调中通过修改状态、调用上下文 API 对 webpack 产生副作用。

### Loader 原理

- `runLoaders` 调用配置的 Loader 集合读取、转译资源
- css-loader：将 CSS 转为 `export default str` 的 JS 代码
- style-loader：将样式注入 `<head>` 的 `<style>` 标签
- Webpack 原生只支持 JS，其他资源均需 Loader 转换

### AST 流程

1. **parse**：源码 → AST
2. **traverse**：遍历 AST，按需修改
3. **generate**：AST → 代码

---

## 性能优化

### 资源优化

- CSS 压缩（`css-minimizer-webpack-plugin`）、JS 压缩（`TerserPlugin`）
- 图片压缩（`image-minimizer-webpack-plugin`）、图片 BASE64 转码（`url-loader`）
- 响应式图片（`srcset`、`sizes`）

### 构建优化

- **代码拆分**：`splitChunks`、`runtimeChunk`、多入口、动态 `import()`
- **Tree Shaking**：基于 ES Module 静态分析，标记未使用代码（CJS 不支持）
- **Scope Hoisting**：将模块合并到同一函数作用域，减少包装函数开销

### 传输加载优化

- gzip/brotli 压缩（nginx）、HTTP 缓存（`contenthash` 持久化缓存）

### 代码优化

- 按需引入、路由懒加载、`preload`（关键资源）、`prefetch`（非关键资源）

### Webpack 生产环境优化

- `noParse`（跳过无需解析的库）、`oneOf`（匹配命中即停止）
- `thread-loader`（Babel 多线程）、`externals`（CDN 外链）
- `DllPlugin`（预编译第三方依赖）

### 开发环境优化

- 优化 source-map 策略：开发用 `cheap-module-eval-source-map`

### 运行时优化

`runtimeChunk` 提取 manifest：将 chunk 映射关系从 app.js 独立出来，避免因 chunk ID 变化导致 app.js 缓存失效。

---

## 热更新原理（HMR）

`webpack-dev-server` + `HotModuleReplacementPlugin` 配合工作：

1. **WDS** 提供 bundle server，通过 `localhost` 访问 bundle 文件，支持 livereload
2. **HMR Plugin** 注入 runtime 到 bundle 中
3. 文件变更 → HMR Server 将变更模块信息通过 **WebSocket** 推送给浏览器中的 HMR Runtime
4. Runtime 向 server 请求更新补丁（JSON + JS chunk）
5. Runtime 接受/拒绝更新，执行模块替换，无需刷新浏览器

**热更新流程：** 文件监听 → 编译变更模块 → WebSocket 推送 → 浏览器请求补丁 → 模块替换

---

## Code Splitting 原理

- 动态 `import()` 在构建时被识别，runtime.js 通过 `jsonp` 机制按需加载 chunk
- 核心函数 `webpackJsonpCallback`，配合 `Promise.all()` 实现并发加载

```js
// splitChunks 分包策略示例
optimization: {
  splitChunks: {
    cacheGroups: {
      libs: {
        name: 'chunk-libs',
        priority: 10,
        chunks: 'initial',
        test: /[\\/]node_modules[\\/]/
      }
    }
  }
}
```

## Tree Shaking 原理

- 基于 ES Module 的静态结构分析（无副作用、无动态导入）
- 编译时标记 unused 导出，压缩阶段移除死代码
- CJS 不支持 Tree Shaking（运行时动态解析）
- 组件库按需加载：`babel-plugin-import` 转换导入语句 + `sideEffects` 字段声明

---

## Webpack 深度

### Module Federation（模块联邦）

**原理**：Webpack5 内置插件，允许多个独立构建的项目在运行时动态共享模块。每个项目暴露（exposes）自己的模块，消费方（remotes）远程加载并使用。

**使用场景**：微前端架构，各子应用独立部署、独立发布，运行时动态组合。

```js
// host 应用配置
const { ModuleFederationPlugin } = require('webpack').container
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ]
}

// remote 应用配置
new ModuleFederationPlugin({
  name: 'remoteApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button'
  },
  shared: ['react', 'react-dom']
})
```

**核心概念**：
- `remotes`：远程应用引用地址
- `exposes`：暴露给其他应用使用的模块
- `shared`：共享依赖，避免重复打包
- `remoteEntry.js`：远程应用的入口描述文件

### Webpack5 新特性

**持久化缓存**：`cache: { type: 'filesystem' }`，将构建中间结果缓存到磁盘，二次构建速度大幅提升。

```js
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
}
```

**ecmascriptModule 优化**：Webpack5 为每个模块增加 `esm` 属性标记，更精确判断模块是否支持 Tree Shaking。

**新增内置 Loader**：
- `asset/inline`：替代 `url-loader`
- `asset/resource`：替代 `file-loader`
- `asset/source`：替代 `raw-loader`
- `asset`：自动选择最优策略

```js
module: {
  rules: [
    { test: /\.png$/, type: 'asset', parser: { dataUrlCondition: { maxSize: 8 * 1024 } } }
  ]
}
```

### 自定义 Plugin 编写

```js
class CustomPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CustomPlugin', (compilation, callback) => {
      // compilation.assets 中可读写输出文件
      compilation.assets['custom.txt'] = {
        source: () => 'Hello Webpack',
        size: () => 13
      }
      callback()
    })
  }
}
module.exports = CustomPlugin
```

### 自定义 Loader 编写

```js
// 同步 Loader
module.exports = function (source) {
  return source.replace(/@import\s+['"](.+?)['"]/g, (match, path) => {
    return `/* imported: ${path} */`
  })
}

// 异步 Loader
module.exports = function (source) {
  const callback = this.async()
  doSomethingAsync(source, (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}
```

### 多进程构建

**thread-loader**：将 Loader 执行转移到 worker 池，适合计算密集型任务（如 Babel 编译）。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        'thread-loader',
        { loader: 'babel-loader', options: { cacheDirectory: true } }
      ]
    }
  ]
}
```

**happypack**（Webpack4 方案，Webpack5 已被 thread-loader 替代）：缓存 + 多进程并行处理 Loader。

---

## Vite

### Vite 原理

- **开发环境**：基于浏览器原生 ES Module，不打包，利用浏览器解析 import 的能力直接请求源码，通过内置插件链做按需编译
- **生产环境**：使用 Rollup 打包，输出优化后的静态资源
- **核心优势**：启动快（无需打包）、热更新快（ESM 粒度替换）

### Vite vs Webpack

| 维度 | Vite | Webpack |
|------|------|---------|
| 开发模式 | 基于 ESM，不打包 | 全量打包后提供 |
| 构建工具 | Rollup | 自研打包器 |
| 启动速度 | 极快（秒级） | 较慢（项目越大越慢） |
| HMR | ESM 级别替换 | 基于 runtime 补丁 |
| 插件生态 | 自研插件 API | 成熟丰富 |
| 浏览器兼容 | 不支持 IE | 广泛兼容 |

### Vite 插件编写

```js
export function myPlugin() {
  return {
    name: 'my-plugin',
    // 开发环境转换
    transform(code, id) {
      if (id.endsWith('.custom')) {
        return { code: `export default '${code}'`, map: null }
      }
    },
    // 构建配置
    configResolved(config) {
      console.log(config.root)
    },
    // 构建输出
    generateBundle(options, bundle) {
      bundle['custom.txt'] = {
        fileName: 'custom.txt',
        code: 'Hello Vite',
        isEntry: false
      }
    }
  }
}
```

### Vite 优化

**依赖预构建**：`optimizeDeps.include` 指定需要预构建的依赖，将 CJS/UMD 转为 ESM，合并请求。

```js
export default {
  optimizeDeps: {
    include: ['lodash', 'moment'],
    exclude: ['my-local-package']
  }
}
```

**构建优化**：`build.rollupOptions` 配置 Rollup 分包策略。

```js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
}
```

---

## Rollup

### 适用场景

- **库/组件打包**：输出 ESM/CJS/UMD 多格式，供其他项目引用
- 不适合大型应用（缺乏代码拆分、动态导入等能力）

### Rollup vs Webpack

| 维度 | Rollup | Webpack |
|------|--------|---------|
| 定位 | 库打包 | 应用打包 |
| 输出格式 | ESM 优先 | 多种格式 |
| Tree Shaking | 原生支持，更彻底 | 依赖配置 |
| 代码拆分 | 有限支持 | 完善 |
| 生态 | 轻量 | 庞大 |

### Tree Shaking 实现

Rollup 基于 ESM 静态分析，默认开启 Tree Shaking：

```js
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true
  },
  treeshake: {
    moduleSideEffects: false, // 标记所有模块无副作用
    propertyReadSideEffects: false
  }
}
```

配合 `package.json` 的 `sideEffects` 字段声明无副作用模块。

---

## Turbopack / esbuild / swc

### esbuild

- **Go 编写**，编译为原生二进制，启动速度极快
- **多线程**并行处理，打包速度比 Webpack 快 10-100 倍
- 适合：快速原型、替代 Babel 做转译、作为 bundler 使用

```js
// esbuild API 使用
const esbuild = require('esbuild')
esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  target: ['es2015'],
  platform: 'browser'
})
```

```bash
# CLI 使用
npx esbuild src/index.js --bundle --minify --outfile=dist/bundle.js
```

### swc

- **Rust 编写**，定位为 Babel 的极速替代方案
- 兼容 Babel 配置（`.babelrc`），支持 TypeScript 编译
- 集成于 Next.js、Rspack 等项目

```json
// .swcrc
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true
    },
    "transform": {
      "react": { "runtime": "automatic" }
    }
  },
  "module": { "type": "es6" }
}
```

### Turbopack

- **Vercel 出品**，用 Rust 编写，Webpack 的替代品
- **增量构建**：仅重新构建变更模块及其依赖，支持 HMR
- 核心特性：细粒度依赖追踪、持久化缓存、并行处理
- Next.js 已默认集成 Turbopack 作为开发时 bundler

```bash
# Next.js 中使用 Turbopack
next dev --turbo
```

### Rspack

- **字节跳动出品**，用 Rust 编写，兼容 Webpack 生态
- 核心优势：极速启动和构建，支持 Webpack 插件/Loader API
- 内置 swc 做 JS/TS 转译，替代 Babel

```js
// rspack.config.js — 与 webpack 配置几乎一致
module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'swc-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};
```

### Farm

- 用 Rust 编写，专注于极速构建
- 核心特性：并行化、细粒度依赖缓存、增量构建
- 自研插件体系，不完全兼容 Webpack 生态

### 构建工具对比

| 工具 | 语言 | 速度 | Webpack 兼容 | 适用场景 |
|------|------|------|-------------|----------|
| Webpack | JS | 慢 | - | 成熟生态，大型项目 |
| Vite | Rust/JS | 快 | 否 | 现代前端开发 |
| esbuild | Go | 极快 | 否 | 转译、简单打包 |
| swc | Rust | 极快 | 部分 | Babel 替代 |
| Rspack | Rust | 快 | 高 | 需要 Webpack 生态的提速方案 |
| Turbopack | Rust | 快 | 部分 | Next.js 生态 |
| Farm | Rust | 极快 | 否 | 追求极致构建速度 |

---

## Monorepo 管理

### Workspace 方案

**pnpm workspace**（推荐）：

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

| 方案 | 特点 |
|------|------|
| pnpm workspace | 硬链接 + 符号链接，磁盘占用少，依赖隔离严格 |
| npm workspace | npm7+ 内置，hoist 到根目录 |
| yarn workspace | yarn berry 支持 PnP，性能优秀 |

### 构建编排工具

**Turborepo**：基于任务依赖图的增量构建编排，支持远程缓存。

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.ts", "test/**/*.ts"]
    },
    "dev": { "cache": false }
  }
}
```

**Nx**：功能更全面的 Monorepo 工具，支持依赖图可视化、affected 命令。

```json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "production": ["default", "!{projectRoot}/**/*.spec.ts"]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"]
    }
  }
}
```

### Lerna + pnpm

```bash
# 初始化
npx lerna init
# 在 pnpm-workspace.yaml 中配置 packages

# 常用命令
lerna run build          # 所有包执行 build
lerna run build --scope=@my/pkg  # 指定包执行
lerna run build --since=main     # 自 main 分支以来有变动的包
lerna publish            # 统一发布
```

---

## 工程化实践

### 脚手架开发

核心依赖：`commander`（命令行解析）、`inquirer`（交互式提问）、`download-git-repo`（模板下载）、`handlebars`（模板渲染）。

```js
// bin/cli.js
#!/usr/bin/env node
const { Command } = require('commander')
const prompts = require('prompts')
const fs = require('fs')
const path = require('path')

const program = new Command()

program
  .command('create <app-name>')
  .description('创建新项目')
  .action(async (name) => {
    const answers = await prompts([
      { type: 'select', name: 'template', message: '选择模板', choices: ['vue', 'react', 'vanilla'] },
      { type: 'select', name: 'css', message: 'CSS 方案', choices: ['tailwind', 'sass', 'none'] }
    ])
    console.log(`创建项目 ${name}，模板: ${answers.template}`)
  })

program.parse()
```

### 组件库开发

**打包配置（Rollup）**：

```js
// rollup.config.js
export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.esm.js', format: 'es' },
      { file: 'dist/index.cjs.js', format: 'cjs' }
    ],
    external: ['vue']
  }
]
```

**package.json 多入口**：

```json
{
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  }
}
```

**Storybook**：组件独立开发与文档。

```bash
npx storybook init
# 生成 .storybook/ 目录和 stories 文件
```

### CI/CD 集成

**GitHub Actions**：

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run test
      - run: pnpm run build
```

**Jenkins**：通过 Pipeline 脚本定义构建流程，配合 Docker 实现环境隔离。

---

## npm 脚本原理

执行 `npm run` 时，将 `node_modules/.bin` 加入 PATH 环境变量，执行完毕后恢复。

## package.json 字段

| 字段 | 用途 |
|------|------|
| `main` | CJS 入口 |
| `module` | ESM 入口 |
| `browser` | 浏览器环境入口 |
| `bin` | 可执行命令 |
| `exports` | 条件导出（Node 支持） |
| `sideEffects` | Tree Shaking 副作用声明 |

## 组件库发布

- 打包格式：CJS（Node 环境）、ESM（现代构建工具）
- 项目内使用 Monorepo 保证开发与包同步（pnpm workspace / Lerna）
- 依赖类型：`dependencies`（运行时）、`devDependencies`（开发时）、`peerDependencies`（宿主提供）
