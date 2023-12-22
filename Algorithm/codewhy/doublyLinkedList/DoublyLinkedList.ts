import LinkedList from './linkedList'
import { DoublyNode } from './DoublyNode'

class DoublyLinkedList<T> extends LinkedList<T> {
  protected head: DoublyNode<T> | null = null
  protected tail: DoublyNode<T> | null = null
  append(value: T): void {
    const newNode = new DoublyNode(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail!.next = newNode
      // 不能将一个父类的对象，赋值给一个子类的类型
      // 可以将一个子类的对象，赋值给一个父类的类型（多态）
      newNode.prev = this.tail
      this.tail = newNode
    }
    this.length++
  }
  prepend(value: T): void {
    const newNode = new DoublyNode(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      newNode.next = this.head
      this.head.prev = newNode
      this.head = newNode
    }
    this.length++
  }
  postTraverse() {
    const values: T[] = []
    let current = this.tail
    while (current) {
      values.push(current.value)
      current = current.prev
    }
    console.log(values.join('->'))
  }
  insert(value: T, position: number): boolean {
    if (position < 0 && position > this.length) return false
    if (position === 0) {
      this.prepend(value)
    } else if (position === this.length) {
      this.append(value)
    } else {
      const newNode = new DoublyNode(value)
      const current = this.getNode(position) as DoublyNode<T>
      current.prev!.next = newNode
      newNode.next = current
      newNode.prev = current.prev
      current.prev = newNode
      this.length++
    }
    return true
  }
  removeAt(position: number): NonNullable<T> | null {
    if (position < 0 && position >= this.length) return null
    let current = this.head
    if (position === 0) {
      if (this.length === 1) {
        this.head = null
        this.tail = null
      } else {
        this.head = this.head!.next
        this.head!.prev = null
      }
    } else if (position === this.length - 1) {
      current = this.tail
      this.tail = this.tail!.prev
      this.tail!.next = null
    } else {
      current = this.getNode(position) as DoublyNode<T>
      current.next!.prev = current.prev
      current.prev!.next = current.next
    }
    this.length--
    return current?.value ?? null
  }
}

const dLinkedList = new DoublyLinkedList<string>()
dLinkedList.append('aaa')
dLinkedList.append('bbb')
dLinkedList.append('ccc')
dLinkedList.append('ddd')
dLinkedList.traverse()

dLinkedList.prepend('eee')
dLinkedList.prepend('fff')
dLinkedList.traverse()

dLinkedList.insert('111', 0)
dLinkedList.insert('222', 7)
dLinkedList.insert('333', 3)
dLinkedList.traverse()

dLinkedList.removeAt(0)
dLinkedList.removeAt(7)
dLinkedList.removeAt(2)
dLinkedList.traverse()

console.log(dLinkedList.get(0))
console.log(dLinkedList.get(1))
console.log(dLinkedList.indexOf('ccc'))

export {}
