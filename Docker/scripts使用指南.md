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

