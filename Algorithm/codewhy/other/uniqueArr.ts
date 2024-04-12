const arr = [
  1,
  1,
  '2',
  3,
  1,
  2,
  { name: '张三', id: { n: 1 } },
  { name: '张三', id: { n: 1 } },
  { name: '张三', id: { n: 2 } }
]

// function uniqueArr(arr: any[]) {
//   let newArr = arr.map(item => JSON.stringify(item))
//   return Array.from(new Set(newArr)).map(item => JSON.parse(item))
// }

function uniqueArr(arr: any[]) {
  function isObject(obj: any) {
    return typeof obj === 'object' && obj !== null
  }
  function isEqual(obj1: any, obj2: any) {
    // 至少有一个是基本数据类型
    if (!isObject(obj1) || !isObject(obj2)) {
      return obj1 === obj2
    }
    // 两个都是对象
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) return false
    for (const key in obj1) {
      let res = isEqual(obj1[key], obj2[key])
      if (!res) return true
    }
    return true
  }
  const res: any[] = []
  for (const item of arr) {
    let flag = true
    for (const resItem of res) {
      if (isEqual(item, resItem)) {
        flag = false
        break
      }
    }
    if (flag) res.push(item)
  }
  return res
}

console.log(uniqueArr(arr))
