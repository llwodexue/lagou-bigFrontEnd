let a = 10
function foo(a) {
  return function (b) {
    console.log(b + ++a)
  }
}
let fn = foo(10)
fn(5) // 16 私有a->11
foo(6)(7) // 14
fn(20) // 32 私有a->12
console.log(a) // 10
