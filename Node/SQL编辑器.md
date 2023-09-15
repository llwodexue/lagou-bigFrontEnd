## @codemirror

> [https://codemirror.net/docs/ref/](https://codemirror.net/docs/ref/)

@codemirror 里面有两个重要的模块：state 和 view

- state 为编辑器提供状态和数据结构
- view 为编辑器提供界面展示

如下是最原始的编辑器，如果想要语言高亮展示、行号展示、撤销历史记录等功能，需要添加更多扩展

```js
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

let myView = new EditorView({
  doc: 'hello',
  extensions: [keymap.of(defaultKeymap)],
  parent: document.body
})
```

## state

最基本的编辑器中只需要有 document 和 selection 即可

- 编辑状态类（[EditorState](https://codemirror.net/docs/ref/#state.EditorState)）是一个不可变的数据结构，要更新状态，需要创建一个事务用于生成一个新的状态实例，而无需修改原始对象

![image-20230911143015172](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230911143015172.png)

EditorState，里面存放了很多有用的方法和属性

- doc 当前编辑器文本
- selection 当前光标区域
- create 根据对应事务创建一个状态
- tabSize 

## language

存储在解析器顶部语法节点，提供存储该语言的数据

- bracketMatching

  括号匹配高亮

- indentOnInput、indentUnit

  `indentUnit.of("   ")` 或 `EditorState.tabSize.of(4)`

- syntaxHighlighting

  与 defaultHighlightStyle 配合使用

  `syntaxHighlighting(highlightStyle, { fallback: true })`

## view

- EditorView 初始化
  - lineWrapping 换行展示
- keymap 快捷键
- dropCursor 选中拖拽
- highlightSpecialChars
- highlightActiveLineGutter 高亮当前行
- lineNumbers 展示行号
- rectangularSelection 按住 alt 可以框住多行

## commands

- defaultKeymap
- standardKeymap
- indentWithTab
- history
- historyKeymap

## autocomplete

- autocompletion
- closeBrackets

## lang-sql

SQL 扩展的选项

![image-20230911092148511](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230911092148511.png)

dialect 属性可以为如下配置

- StandardSQL
  - 标准 SQL
- PostgreSQL
  - [https://www.postgresql.org/](https://www.postgresql.org/)
- MySQL
  - [https://dev.mysql.com/](https://dev.mysql.com/)
- MariaSQL
  - MySQL 的变体，[https://mariadb.org/](https://mariadb.org/)
- MSSQL
  - 微软 [https://www.microsoft.com/en-us/sql-server](https://www.microsoft.com/en-us/sql-server)
- SQLite
  - [https://sqlite.org/](https://sqlite.org/)
- Cassandra
  - [https://cassandra.apache.org/](https://cassandra.apache.org/)
- PL/SQL
  - [https://en.wikipedia.org/wiki/PL/SQL/](https://en.wikipedia.org/wiki/PL/SQL/)

## 正则

```js
const sql = 'SELECT * FROM table WHERE condition1 AND condition2 AND condition3'
/** 使用matchAll */
const regex1 = /and\s+(\w+)/gi
const matches1 = [...sql.matchAll(regex1)]
const words1 = matches1.map(match => match[1])
console.log(words1) // 输出 ["condition2", "condition3"]

/** 使用exec */
const regex2 = /and\s+(\w+)/gi
const matches2 = []
let match2
while ((match2 = regex2.exec(sql)) !== null) {
  const word2 = match2[1]
  matches2.push(word2)
}
console.log(matches2) // 输出 ["condition2", "condition3"]

const regex3 = /and\s+(\w+)/gi
const matches3 = sql.match(regex3)
console.log(matches3) // 输出 ["AND condition2", "AND condition3"]
```

