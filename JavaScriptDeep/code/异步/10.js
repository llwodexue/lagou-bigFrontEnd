// 生成器函数
function* foo() {
  console.log('start')
  const res = yield 'foo'
  console.log(res)
  try {
    yield 'foobar'
  } catch (e) {
    console.log(e)
  }
}
const generator = foo()
const result = generator.next('bar')
console.log(result)
generator.next('bar')
generator.throw(new Error('Generator error'))

/* 
start
{value: 'foo', done: false}
bar
Error: Generator error
*/
