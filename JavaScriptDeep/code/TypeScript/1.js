// 程序上的异常需要等到运行时才能发现
const obj = {}
setTimeout(() => {
  obj.foo()
}, 1000)
// 类型不明确造成功能改变
function sum(a, b) {
  return a + b
}
console.log(100, '100')
// 对象索引错误用法
obj[true] = 100
console.log(foo['true'])

