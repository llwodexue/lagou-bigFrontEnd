// 全局变量
var i,
  str = ''
function packageDom1() {
  for (i = 0; i < 1000; i++) {
    str += i
  }
}
packageDom1()

// 局部变量
function packageDom2() {
  let str = ''
  for (let i = 0; i < 1000; i++) {
    str += i
  }
}
packageDom2()