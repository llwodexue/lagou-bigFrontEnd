import ArrayQueue from '../queue/queue'

class ArrayDeque<T> extends ArrayQueue<T> {
  addFront(value: T) {
    this.data.unshift(value)
  }
  removeBack(): T | undefined {
    return this.data.pop()
  }
}

const deque = new ArrayDeque<string>()
deque.enqueue('aaa')
deque.enqueue('bbb')
deque.enqueue('ccc')
console.log(deque)

export {}
