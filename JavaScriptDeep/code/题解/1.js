const list = [1, 2, 3]
const square = num => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}
/* list.forEach(async x => {
  const res = await square(x)
  console.log(res)
}) */

/* // 基于递归处理
let index = 0
const test = async function test() {
  if (index >= list.length) return
  let x = list[index++]
  const res = await square(x)
  console.log(res)
  test()
}
test()
 */

// 基于for await of循环处理
const test = async function test() {
  // 这个方法遵循generator+iterator，返回迭代器对象
  // 每一轮循环都是迭代器对象.next
  let index = 0
  list[Symbol.asyncIterator] = async function* () {
    yield square(list[index++])
    yield square(list[index++])
    yield square(list[index++])
  }
  for await (let res of list) {
    console.log(res)
  }
}
test()