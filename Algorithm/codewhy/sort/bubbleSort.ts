import { swap } from '../utils'

function bubbleSort(arr: number[]): number[] {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1)
      }
    }
  }
  return arr
}

const num = [18, 45, 27, 9, 15, 88, 65]
const newNum = bubbleSort(num)
console.log(newNum)

export {}
