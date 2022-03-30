const user1 = { age: 11 }
const user2 = { age: 22 }
// 即使脚本执行完，因为在全局还是找到到，所以不会被回收
const nameList = [user1.age, user2.age]

function fn() {
  // 因为挂载在window上，即使fn执行完毕，计数也不是0
  num1 = 1
  // 加上const后只在作用域内起作用，从全局是找不到的，计数为0
  const num2 = 2
}
fn()
