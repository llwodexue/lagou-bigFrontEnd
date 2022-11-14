class Stack {
  constructor() {
    this.data = []
    this.count = 0
  }
  push(item) {
    this.data[this.count] = item
    this.count++
  }
  pop() {
    if (this.isEmpty()) {
      console.log('栈为空！')
      return
    }
    const temp = this.data[this.count - 1]
    delete this.data[--this.count]
    return temp
  }
  isEmpty() {
    return this.count === 0
  }
  top() {
    if (this.isEmpty) {
      console.log('栈为空！')
      return
    }
    return this.data[this.count - 1]
  }
  size() {
    return this.count
  }
  clear() {
    this.data = []
    this.count = 0
  }
}

const s = new Stack()
s.push('a')
s.push('b')
s.push('c')
console.log(s)
s.pop()
console.log(s)
console.log(s.size())
