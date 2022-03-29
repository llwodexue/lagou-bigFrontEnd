async function async1() {
  console.log('AAA')
  async2()
  console.log('BBB')
}
async function async2() {
  console.log('CCC')
}
console.log('DDD')
setTimeout(function () {
  console.log('FFF')
}, 0)
async1()
new Promise(function (resolve) {
  console.log('GGG')
  resolve()
}).then(function () {
  console.log('HHH')
})
console.log('III')
/* 
DDD
AAA
CCC
BBB
GGG
III
HHH
FFF
*/