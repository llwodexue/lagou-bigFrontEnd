import LinkedList from './linkedList'

class CircularLinkedList<T> extends LinkedList<T> {
  append(value: T): void {
    super.append(value)
    this.tail!.next = this.head
  }
  insert(value: T, position: number): boolean {
    const isSuccess = super.insert(value, position)
    if (isSuccess && (position === this.length - 1 || position === 0)) {
      this.tail!.next = this.head
    }
    return isSuccess
  }
  removeAt(position: number): NonNullable<T> | null {
    const value = super.removeAt(position)
    if (value && this.tail && (position === 0 || position === this.length)) {
      this.tail!.next = this.head
    }
    return value
  }
}

const cLinkedList = new CircularLinkedList<string>()
cLinkedList.append('aaa')
cLinkedList.append('bbb')
cLinkedList.append('ccc')
cLinkedList.append('ddd')
cLinkedList.traverse()

console.log('\n-----测试insert-----')
cLinkedList.insert('abc', 0)
cLinkedList.traverse()
cLinkedList.insert('cba', 2)
cLinkedList.traverse()
cLinkedList.insert('bca', 6)
cLinkedList.traverse()

console.log('\n-----测试removeAt-----')
cLinkedList.removeAt(0)
cLinkedList.traverse()
cLinkedList.removeAt(2)
cLinkedList.traverse()
cLinkedList.removeAt(4)
cLinkedList.traverse()

console.log('\n-----测试get-----')
console.log(cLinkedList.get(2))

console.log('\n-----测试update-----')
console.log(cLinkedList.update('ppp', 1))
cLinkedList.traverse()

console.log('\n-----测试indexOf-----')
console.log(cLinkedList.indexOf('ccc'))
console.log(cLinkedList.indexOf('ggg'))

console.log('\n-----测试remove-----')
cLinkedList.remove('ccc')
cLinkedList.traverse()

export {}
