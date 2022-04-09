const obj = {
  a: 1,
  b: [1, 2, { c: true }],
  c: { e: 2, f: 3 },
  g: null,
}
// 转换为
let objRes = {
  a: 1,
  'b[0]': 1,
  'b[1]': 2,
  'b[2].c': true,
  'c.e': 2,
  'c.f': 3,
  g: null,
}
// https://juejin.cn/post/7013309942576709640
const flatten = function flatten(object) {
  const result = {}
  function flat(obj, target) {
    Object.entries(obj).forEach(([key, value]) => {
      console.log(key, value)
      let newKey = target
      if (Array.isArray(value)) {
        newKey = newKey ? `${target}[${key}]` : key
      } else {
        newKey = newKey ? `${target}.${key}` : key
      }
      if (value && typeof value === 'object') {
        flat(value, newKey)
      } else {
        result[newKey] = value
      }
    })
  }
  flat(object, '')
  return result
}
console.log(flatten(obj))
