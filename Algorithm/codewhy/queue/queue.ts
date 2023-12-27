import IQueue from './IQueue'

class ArrayQueue<T> implements IQueue<T> {
  // 内部是通过数组保存
  protected data: T[] = []
  enqueue(element: T): void {
    this.data.push(element)
  }
  dequeue(): T | undefined {
    return this.data.shift()
  }
  peek(): T | undefined {
    return this.data[0]
  }
  isEmpty(): boolean {
    return this.data.length === 0
  }
  size(): number {
    return this.data.length
  }
}

export default ArrayQueue
