var a = 1
function foo() {
  var b = 2
  return function (c) {
    console.log(c + b++)
  }
}
var f = foo()
f(5) // 7 b->3
f(10) // 13 b->4
