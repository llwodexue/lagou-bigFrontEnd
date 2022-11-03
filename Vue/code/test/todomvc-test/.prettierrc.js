module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾不需要有分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: true,
  // jsx 标签的反尖括号需要换行
  bracketSameLine: false,
  // 末尾不需要有逗号
  trailingComma: 'none',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // 箭头函数，只有一个参数的时候，不需要括号
  arrowParens: 'avoid',
  // 所有元素间的空格都会被忽略，直接另起一行
  htmlWhitespaceSensitivity: 'ignore',
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: 'lf',
  // 格式化模板字符串里的内容
  embeddedLanguageFormatting: 'auto',
  // html, vue, jsx 中每个属性占一行
  singleAttributePerLine: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  spaceBeforeFunctionParen: true
}
