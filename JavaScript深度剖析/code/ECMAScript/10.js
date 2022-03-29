/* const set = new Set(['foo', 'bar', 'baz'])

const iterator = set[Symbol.iterator]()
while (true) {
  const current = iterator.next()
  if (current.done) break
  console.log(current.value) // foo bar baz
}*/

/* const obj = {
  store: ['foo', 'bar', 'baz'],
  [Symbol.iterator]: function () {
    let index = 0
    const self = this
    // 实现迭代器接口 iterator  内部需要有一个next方法
    return {
      next: function () {
        // IteratorResult 实现迭代结果接口
        return {
          value: self.store[index],
          done: index++ >= self.store.length,
        }
      },
    }
  },
}

for (const item of obj) {
  console.log(item) // foo bar baz
}*/

/* const todos = {
  life: ['吃饭', '睡觉', '打豆豆'],
  learn: ['语文', '数学', '外语'],
  work: ['喝茶'],
  [Symbol.iterator]: function () {
    const all = [].concat(this.life, this.learn, this.work)
    let index = 0
    return {
      next: function () {
        return {
          value: all[index],
          done: index++ >= all.length,
        }
      },
    }
  },
}

for (const item of todos) {
  console.log(item)
}
 */

/* function* foo() {
  console.log('zce')
  return 100
}

// 生成器对象也实现了iterator接口
function* foo() {
  yield 100
  // yield不会结束方法的执行  yield值作为next结果返回
  yield 200
  yield 300
}
const generator = foo()
console.log(generator.next()) // { value: 100, done: false }
console.log(generator.next()) // { value: 200, done: false }
console.log(generator.next()) // { value: 300, done: false }
console.log(generator.next()) // { value: undefined, done: true } */

// ECMAScript 2016
/* const arr = ['foo', 1, NaN, false]
// 找到返回元素下标
console.log(arr.indexOf('foo')) // 0
// 找不到返回 -1
console.log(arr.indexOf('bar')) // -1
// 无法找到数组中的 NaN
console.log(arr.indexOf(NaN)) // -1
// 直接返回是否存在指定元素
console.log(arr.includes('foo')) // true
// 能够查找 NaN
console.log(arr.includes(NaN)) // true

// 指数运算符
console.log(Math.pow(2, 10))
console.log(2 ** 10) */

// ECMAScript 2017

/* const obj = {
  foo: 'value1',
  bar: 'value2',
}
console.log(Object.values(obj)) // [ 'value1', 'value2' ]
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value) // foo value1 // bar value2
}*/

/* const p1 = {
  firstName: 'Lei',
  lastName: 'Wang',
  get fullName() {
    return this.firstName + ' ' + this.lastName
  },
}
console.log(p1.fullName) // Lei Wang
const p2 = Object.assign({}, p1)
p2.firstName = 'zce'
// Object.assign 在复制是只是把 fullName 当做普通属性复制了
console.log(p2.fullName) // Lei Wang

const descriptors = Object.getOwnPropertyDescriptors(p1)
const p3 = Object.defineProperties({}, descriptors)
p3.firstName = 'zce'
console.log(p3.fullName) // zce Wang */

// String.prototype.padStart / String.prototype.padEnd  --------------------

/* const books = {
  html: 5,
  css: 16,
  javascript: 128,
}
for (const [name, count] of Object.entries(books)) {
  console.log(`${name.padEnd(16, '-')}|${count.toString().padStart(3, '0')}`)
} */

// 在函数参数中添加尾逗号  
function foo(bar, baz,) {}
const arr = [100, 200, 300,]
