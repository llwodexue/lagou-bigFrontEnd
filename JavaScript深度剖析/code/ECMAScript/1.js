/* for (var i = 0; i < 3; i++) {
  for (var i = 0; i < 3; i++) {
    console.log(i) // 0 1 2
  }
}
for (let i = 0; i < 3; i++) {
  for (let i = 0; i < 3; i++) {
    console.log(i) // 0 1 2 0 1 2 0 1 2
  }
} */
var el = [{}, {}, {}]
for (var i = 0; i < el.length; i++) {
  el[i].onClick = function () {
    console.log(i)
  }
}
el[2].onClick() // 3

console.log(foo) // undefined
var foo = 'bird'

const obj = {}
obj.name = 'bird'
obj = {}
