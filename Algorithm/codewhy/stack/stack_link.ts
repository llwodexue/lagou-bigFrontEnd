import { IStack } from './IStack'

class LinkedStack<T> implements IStack<T> {
  private data: T[] = []
  push(element: T) {
    this.data.push(element)
  }
  pop() {
    return this.data.pop()
  }
  peek() {
    return this.data[this.data.length - 1]
  }
  isEmpty() {
    return this.data.length === 0
  }
  size() {
    return this.data.length
  }
}

const stack1 = new LinkedStack<string>()
stack1.push('aaa')
stack1.push('bbb')

console.log(stack1.peek())
console.log(stack1.pop())
const res = stack1.pop()
console.log(res?.split(''))
console.log(stack1.isEmpty())
console.log(stack1.size())

export {}
