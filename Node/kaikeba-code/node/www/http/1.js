// var value = 1
// function foo() {
//   console.log(value)
// }
// function bar(){
//   var value = 2
//   foo()
// }
// bar() // 1

// var scope = 'global'
// function checkScope() {
//   var scope = 'local'
//   function f() {
//     return scope
//   }
//   return f()
// }
// console.log(checkScope()()) // local
// var scope = 'global'
// function checkScope() {
//   var scope = 'local'
//   function f() {
//     return scope
//   }
//   return f
// }
// console.log(checkScope()()) // local

// function foo() {
//   console.log(a)
//   a = 1
// }
// foo() // ReferenceError: a is not defined
// function bar() {
//   a = 1
//   console.log(a)
// }
// bar() // 1

console.log(foo) // [Function: foo]
function foo() {
  console.log('foo')
}
var foo = 1
