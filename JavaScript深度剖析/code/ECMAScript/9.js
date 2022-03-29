const arr = [100, 200, 300, 400]

for (const item of arr) {
  console.log(item)
  if (item > 100) break
}
// 不能跳出循环（除非报错）通常都是使用 some 或 every 代替
arr.forEach(() => {})

const s = new Set(['foo', 'bar'])
for (const item of s) {
  console.log(item)
}

const m = new Map()
m.set('foo', '123')
m.set('bar', '345')
for (const [key, value] of m) {
  console.log(key, value)
}
