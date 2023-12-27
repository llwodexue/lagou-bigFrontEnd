import { cbtPrint } from 'hy-algokit'

class Heap<T> {
  private data: T[] = []
  private length: number = 0
  private isMax: boolean
  constructor(arr: T[] = [], isMax = true) {
    this.isMax = isMax
    if (arr.length === 0) return
    this.buildHeap(arr)
  }
  private swap(i: number, j: number) {
    const temp = this.data[i]
    this.data[i] = this.data[j]
    this.data[j] = temp
  }
  private compare(i: number, j: number) {
    if (this.isMax) {
      return this.data[i] >= this.data[j]
    } else {
      return this.data[i] <= this.data[j]
    }
  }
  insert(value: T) {
    // 1.将元素放到数组的尾部
    this.data.push(value)
    this.length++
    // 2.维护最大堆的特性（最后位置的元素需要进行上滤操作）
    this.percolateUp()
  }
  private percolateUp() {
    let index = this.length - 1
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2)
      if (this.compare(parentIndex, index)) {
        break
      }
      this.swap(index, parentIndex)
      index = parentIndex
    }
  }
  extract(): T | undefined {
    // 1.判断元素个数为0或1的情况
    if (this.length === 0) return undefined
    if (this.length === 1) {
      this.length--
      return this.data.pop()!
    }
    // 2.提取并且需要返回的最大值
    const topValue = this.data[0]
    this.data[0] = this.data.pop()!
    this.length--
    // 3.维护最大堆的特性：下滤操作
    this.percolateDown(0)
    return topValue
  }
  private percolateDown(start: number) {
    // 1.定义索引位置
    let index = start
    while (2 * index + 1 < this.length) {
      // 2.找到左右子节点
      let leftChildIndex = 2 * index + 1
      let rightChildIndex = leftChildIndex + 1
      // 3.找到左右子节点较大的值
      let largeIndex = leftChildIndex
      if (
        rightChildIndex < this.length &&
        this.compare(rightChildIndex, leftChildIndex)
      ) {
        largeIndex = rightChildIndex
      }
      // 4.较大的值和index位置进行比较
      if (this.compare(index, largeIndex)) {
        break
      }
      // 5.交换位置
      this.swap(index, largeIndex)
      index = largeIndex
    }
  }
  peek(): T | undefined {
    return this.data[0]
  }
  size() {
    return this.length
  }
  isEmpty() {
    return this.length === 0
  }
  buildHeap(arr: T[]) {
    // 1.使用arr的值：数组长度
    this.data = arr
    this.length = arr.length
    // 2.从第一个非叶子节点，开始进行下滤操作
    const start = Math.floor((this.length - 1) / 2)
    for (let i = start; i >= 0; i--) {
      this.percolateDown(i)
    }
  }
  print() {
    cbtPrint(this.data)
  }
}

// const arr = [19, 100, 36, 17, 3, 25, 1, 2, 7]
// const heap = new Heap<number>()
// arr.forEach(item => heap.insert(item))
// heap.print()
// console.log(heap.extract())
// heap.print()

// const arrNew = [9, 11, 20, 56, 23, 45]
// const heapNew = new Heap<number>(arrNew, false)
// heapNew.print()

export default Heap
