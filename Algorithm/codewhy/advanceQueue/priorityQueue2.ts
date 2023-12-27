import Heap from '../heap/heap'

class PriorityQueue2<T> {
  private heap: Heap<T> = new Heap()
  enqueue(value: T) {
    this.heap.insert(value)
  }
  dequeue(): T | undefined {
    return this.heap.extract()
  }
  peek(): T | undefined {
    return this.heap.peek()
  }
  isEmpty() {
    return this.heap.isEmpty()
  }
  size() {
    return this.heap.size()
  }
}

class Student {
  name: string
  score: number
  constructor(name: string, score: number) {
    this.name = name
    this.score = score
  }
  valueOf() {
    return this.score
  }
}

const pQueue = new PriorityQueue2<Student>()
pQueue.enqueue(new Student('kobe', 20))
pQueue.enqueue(new Student('faker', 23))
pQueue.enqueue(new Student('james', 18))
while (!pQueue.isEmpty()) {
  console.log(pQueue.dequeue())
}

export {}
