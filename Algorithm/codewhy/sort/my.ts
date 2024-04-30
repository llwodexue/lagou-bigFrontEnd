import { swap, testSort } from 'hy-algokit'

// function mergeSort(arr: number[]): number[] {
//   const len = arr.length
//   if (len <= 1) return arr
//   const mid = Math.floor(len / 2)
//   const leftArr = arr.slice(0, mid)
//   const rightArr = arr.slice(mid)
//   const newLeftArr = mergeSort(leftArr)
//   const newRightArr = mergeSort(rightArr)
//   let i = 0
//   let j = 0
//   const newArr: number[] = []
//   while (i < newLeftArr.length && j < newRightArr.length) {
//     if (newLeftArr[i] <= newRightArr[j]) {
//       newArr.push(newLeftArr[i])
//       i++
//     } else {
//       newArr.push(newRightArr[j])
//       j++
//     }
//   }
//   if (i < newLeftArr.length) {
//     newArr.push(...newLeftArr.slice(i))
//   }
//   if (j < newRightArr.length) {
//     newArr.push(...newRightArr.slice(j))
//   }
//   return newArr
// }

// const arr = mergeSort([7, 9, 1, 5, 4, 6, 2, 3, 8])
// console.log(arr)

function quickSort(arr: number[]): number[] {
  partition(0, arr.length - 1)
  function partition(left: number, right: number) {
    if (left >= right) return
    const pivot = arr[right]
    let i = left
    let j = right - 1
    while (i <= j) {
      while (arr[i] < pivot) {
        i++
      }
      while (arr[j] > pivot) {
        j--
      }
      if (i <= j) {
        swap(arr, i, j)
        i++
        j--
      }
    }
    swap(arr, i, right)
    partition(left, j)
    partition(i + 1, right)
  }
  return arr
}

testSort(quickSort)

export {}
