export {} // 确保跟其它示例没有成员冲突

// 解决办法1: IIFE 提供独立作用域
;(function () {
  const a = 123
})()

// 解决办法2: 在当前文件使用 export，也就是把当前文件变成一个模块
const a = 123
export {}
