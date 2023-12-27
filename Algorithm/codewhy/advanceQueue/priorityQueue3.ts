class PriorityQueue3<T> {
  private list: { value: T; priority: number }[] = []
  enqueue(value: T, priority: number) {
    const newElement = { value, priority }
    if (this.isEmpty()) {
      this.list.push(newElement)
    } else {
      const size = this.size()
      for (let i = 0; i < size; i++) {
        if (priority > this.list[i].priority) {
          this.list.splice(i, 0, newElement)
          return
        }
      }
      this.list.push(newElement)
    }
  }
  dequeue() {
    return this.list.shift()
  }
  isEmpty() {
    return this.list.length ? false : true
  }
  size() {
    return this.list.length
  }
  print() {
    console.log(this.list)
  }
}

const pQueue = new PriorityQueue3<string>()
pQueue.enqueue('bird', 11)
pQueue.enqueue('cat', 13)
pQueue.enqueue('dog', 12)
// while (!pQueue.isEmpty()) {
//   console.log(pQueue.dequeue())
// }
pQueue.print()
