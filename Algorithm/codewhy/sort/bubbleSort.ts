import { swap } from '../utils'
import { measureSort } from 'hy-algokit'

function bubbleSort(arr: number[]): number[] {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    let swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1)
        swapped = true
      }
    }
    if (!swapped) break
  }
  return arr
}

// const num = [18, 45, 27, 9, 15, 88, 65]
// const newNum = bubbleSort(num)
// console.log(newNum)
measureSort(bubbleSort, 100000)

export { bubbleSort }
