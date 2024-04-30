import { swap, testSort, cbtPrint, measureSort } from 'hy-algokit'

function heapSort(arr: number[]): number[] {
  // 1.获取数组的长度
  const n = arr.length
  // 2.对arr进行原地建堆
  // 2.1.从第一个非叶子节点开始进行下滤操作
  // const start = Math.floor(n / 2 - 1)
  const start = Math.floor((n - 1) / 2)
  for (let i = start; i >= 0; i--) {
    // 2.2.进行下滤操作
    heapDown(arr, n, i)
  }
  // 3.对最大堆进行排序操作
  for (let i = n - 1; i > 0; i--) {
    swap(arr, 0, i)
    heapDown(arr, i, 0)
  }
  return arr
}
/**
 * 下滤操作函数
 * @param arr 在数组中进行下滤操作
 * @param n 下滤操作的范围
 * @param index 哪一个位置需要进行下滤操作
 */
function heapDown(arr: number[], n: number, index: number) {
  while (2 * index + 1 < n) {
    // 1.获取左右子节点的索引
    const leftChildIndex = 2 * index + 1
    const rightChildIndex = 2 * index + 2
    // 2.找出左右子节点较大的值
    let largeIndex = leftChildIndex
    if (rightChildIndex < n && arr[rightChildIndex] > arr[leftChildIndex]) {
      largeIndex = rightChildIndex
    }
    // 3.判断index位置的值比更大的子节点，直接break
    if (arr[index] >= arr[largeIndex]) {
      break
    }
    // 4.和更大位置的进行交换操作
    swap(arr, index, largeIndex)
    index = largeIndex
  }
}

// testSort(heapSort)
console.log(heapSort([1, 3, 13, 4, 25, 76, 7, 54, 9, 5, 11]))

export {}
