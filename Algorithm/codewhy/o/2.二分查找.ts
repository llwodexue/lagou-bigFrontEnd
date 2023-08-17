function binarySearch(array: number[], num: number) {
  // 1.定义左边的索引
  let left = 0
  // 2.定义右边的索引
  let right = array.length - 1
  // 3.开始查找
  while (left <= right) {
    let mid = Math.floor((left + right) / 2)
    const midNum = array[mid]
    if (midNum === num) {
      return mid
    } else if (midNum < num) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
}

// const index = binarySearch([1, 3, 5, 10, 100, 222, 333], 222)
// console.log(index)

export default binarySearch
