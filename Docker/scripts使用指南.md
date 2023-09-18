> [npm scripts 使用指南](http://ruanyifeng.com/blog/2016/10/npm_scripts.html)

## npm 脚本

npm 允许在 `package.json` 文化中，使用 `scripts` 定义脚本命令

```json
"scripts": {
  "build": "node build.js"
}
```

`build` 命令对应的脚本是 `node build.js`

```bash
$ npm run build
# 等同于执行
$ node build.js
```

## 脚本原理

每当执行 `npm run`，就会自动新建一个 shell，在这个 shell 里执行指定的脚本命令

- 比较特别的是，`npm run` 新建的这个 shell，会将当前目录的 `node_modules/.bin` 子目录加入 PATH 变量，执行结束后，再将 PATH 变量恢复原样
- 意味着，当前目录的 `node_modules/.bin` 子目录里面的所有脚本，都可以直接用脚本名调用，而不必加路径

```json
"test": "mocha test"
// 等同于执行
"test": "./node_modules/.bin/mocha test"
```

npm 脚本唯一要求就是可以在 shell 执行，因此它不一定是 node 脚本，任何可执行文集那都可以写在里面。npm 脚本的退出码，也遵循 shell 脚本规则，如果退出码不是 0，npm 救人位这个脚本执行失败

![image-20230914162316946](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230914162316946.png)

## 通配符

由于 npm 脚本就是 shell 脚本，因此可以使用 shell 通配符

- `*` 表示任意文件名，`**` 表示任意一层子目录
- 如果要将通配符传入原始命令，防止被 Shell 转义，要将星号转义

```json
"lint": "jshint *.js"
"lint": "jshint **/*.js"

"test": "tap test/\*.js"
```

## 传参

向 npm 脚本传入参数，要使用 `--` 标明

```json
"lint": "jshint **.js"
```

向上面的 `npm run lint` 命令传入参数，必须写成下面这样

```bash
$ npm run lint --  --reporter checkstyle > checkstyle.xml
```

## 执行顺序

如果 npm 脚本里面需要执行多个任务，那么需要明确它们的执行顺序

如果使并行执行（即同时的平行执行），可以使用 `&` 符号

```bash
$ npm run script1.js & npm run script2.js
```

如果使继发执行（即只有前一个任务成功，才执行下一个任务），可以使用 `&&` 符号

```bash
$ npm run script1.js && npm run script2.js
```

这两个符号是 Bash 的功能。此外，还可以使用 node 的任务管理模块：[script-runner](https://github.com/paulpflug/script-runner)、[npm-run-all](https://github.com/mysticatea/npm-run-all)、[redrun](https://github.com/coderaiser/redrun)

## 默认值

一般来说，npm 脚本由用户提供。但是，npm 对两个脚本提供了默认值。也就是说，这两个脚本不用定义，就可以直接使用

```json
"start": "node server.js"，
"install": "node-gyp rebuild"
```

- `npm run start` 的默认值是 `node server.js`，前提是项目根目录下有 `server.js` 这个脚本
- `npm run install` 的默认值是 `node-gyp rebuild`，前提是项目根目录下有 `binding.gyp` 文件

## 钩子

npm 脚本由 `pre` 和 `post` 两个钩子。举例来说，`build`脚本命令的钩子就是`prebuild`和`postbuild`

```json
"prebuild": "echo I run before the build script",
"build": "cross-env NODE_ENV=production webpack",
"postbuild": "echo I run after the build script"
```

用户执行 `npm run build` 的时候，会自动按照下面的顺序执行

```bash
npm run prebuild && npm run build && npm run postbuild
```

npm 默认提供下面这些钩子

- prepublish，postpublish
- preinstall，postinstall
- preuninstall，postuninstall
- preversion，postversion
- pretest，posttest
- prestop，poststop
- prestart，poststart
- prerestart，postrestar

自定义的脚本命令也可以加上 `pre` 和 `post` 钩子

- 比如，`myscript` 这个脚本命令，也有 `premyscript` 和 `postmyscript` 钩子
- 不过，双重的 `pre` 和 `post` 无效，比如 `prepretest` 和 `postposttest` 是无效的

npm 提供一个 `npm_lifecycle_event` 变量，返回当前正在运行的脚本名称

- 比如 `pretest`、`test`、`posttest` 等等
- 所以，可以利用这个变量，在同一个脚本文件里面，为不同的 `npm scripts` 命令编写代码

```javascript
const TARGET = process.env.npm_lifecycle_event

if (TARGET === 'test') {
  console.log(`Running the test task!`)
}
if (TARGET === 'pretest') {
  console.log(`Running the pretest task!`)
}
if (TARGET === 'posttest') {
  console.log(`Running the posttest task!`)
}
```

注意：`prepublish` 这个钩子不仅会在 `npm publish` 命令之前执行，还会在 `npm install`（不带任何参数）命令之前允许

- 这种行为很容易让用户感到困惑，所以 npm 4 引入了一个新的钩子 `prepare`，行为等同于 `prepublish`
- 而从 npm5 开始，`prepublish` 将只在 `npm publish` 命令之前运行

## 简写形式

四个常用的 npm 脚本由简写形式

- `npm start` 是 `npm run start`
- `npm stop` 是 `npm run stop` 的简写
- `npm test` 是 `npm run test` 的简写
- `npm restart` 是 `npm run stop && npm run restart && npm run start` 的简写

执行顺序如下

1. prerestart
2. prestop
3. stop
4. poststop
5. restart
6. prestart
7. start
8. poststart
9. postrestart

## 变量

npm 脚本有一个非常强大的功能，就是可以使用 npm 的内部变量

首先，通过 `npm_package_` 前缀，npm 脚本可以拿到 `package.json` 里面的字段

```json
{
  "name": "foo", 
  "version": "1.2.5",
  "scripts": {
    "view": "node view.js"
  }
}
```

我们通过环境变量 `process.env` 对象，拿到 `package.json` 的字段值

```javascript
console.log(process.env.npm_package_name) // foo
console.log(process.env.npm_package_version) // 1.2.5
```

如果是 Bash 脚本，可以用 `$npm_package_name` 和 `$npm_package_version` 取到这两个值

`npm_package_` 前缀也支持嵌套的 `package.json` 字段

```json
"repository": {
  "type": "git",
  "url": "xxx"
},
scripts: {
  "view": "echo $npm_package_repository_type"
}
```

npm 脚本还可以通过 `npm_config_` 前缀，拿到 npm 的配置变量，即 `npm config get xxx` 命令返回的值。比如，当前模块的发行标签，可以通过 `npm_config_tag` 取到

```json
"view": "echo $npm_config_tag"
```

注意，`package.json` 里面的 `config` 对象，可以被环境变量覆盖

```json
{ 
  "name" : "foo",
  "config" : { "port" : "8080" },
  "scripts" : { "start" : "node server.js" }
}
```

上面代码中，`npm_package_config_port` 变量返回的是 `8080`。这个值可以用下面的方法覆盖

```bash
$ npm config set foo:port 80
```

最后，`env` 命令可以列出所有环境变量

```json
"env": "env"
```

