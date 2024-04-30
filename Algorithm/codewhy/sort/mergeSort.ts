import { testSort, measureSort } from 'hy-algokit'

function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr
  // 1.分解(divide)：对数组进行分解(分解成两个小数组)
  // 1.1 切割数组
  const mid = Math.floor(arr.length / 2)
  const leftArr = arr.slice(0, mid)
  const rightArr = arr.slice(mid)
  // 1.2递归的切割leftArr和rightArr
  const newLeftArr = mergeSort(leftArr)
  const newRightArr = mergeSort(rightArr)
  // 2.合并(merge)：将两个数组进行合并(双指针)
  // 2.1.定义双指针
  let i = 0
  let j = 0
  const newArr: number[] = []
  while (i < newLeftArr.length && j < newRightArr.length) {
    if (newLeftArr[i] <= newRightArr[j]) {
      newArr.push(newLeftArr[i])
      i++
    } else {
      newArr.push(newRightArr[j])
      j++
    }
  }
  // 2.2.判断是否某一个数组还有剩余的元素
  // 循环完左边还有剩余
  if (i < newLeftArr.length) {
    newArr.push(...newLeftArr.slice(i))
  }
  // 循环完右边还有剩余
  if (j < newRightArr.length) {
    newArr.push(...newRightArr.slice(j))
  }
  return newArr
}

measureSort(mergeSort)

export { mergeSort }

