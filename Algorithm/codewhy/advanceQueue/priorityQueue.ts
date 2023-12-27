import Heap from '../heap/heap'

class PriorityNode<T> {
  priority: number
  value: T
  constructor(value: T, priority: number) {
    this.value = value
    this.priority = priority
  }
  valueOf() {
    return this.priority
  }
}

class PriorityQueue<T> {
  private heap: Heap<PriorityNode<T>> = new Heap()
  enqueue(value: T, priority: number) {
    const newNode = new PriorityNode(value, priority)
    this.heap.insert(newNode)
  }
  dequeue(): T | undefined {
    return this.heap.extract()?.value
  }
  peek(): T | undefined {
    return this.heap.peek()?.value
  }
  isEmpty() {
    return this.heap.isEmpty()
  }
  size() {
    return this.heap.size()
  }
}

const pQueue = new PriorityQueue<string>()
pQueue.enqueue('bird', 11)
pQueue.enqueue('cat', 13)
pQueue.enqueue('dog', 12)
while (!pQueue.isEmpty()) {
  console.log(pQueue.dequeue())
}

export {}
