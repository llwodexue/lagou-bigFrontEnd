type INode<T> = Node<T> | null

class Node<T> {
  value: T
  next: INode<T>
  constructor(value: T) {
    this.value = value
    this.next = null
  }
}

class LinkedList<T> {
  private head: INode<T> = null
  private size: number = 0
  private getNode(position: number): INode<T> {
    let index = 0
    let current = this.head
    while (index++ < position && current) {
      current = current.next
    }
    return current
  }
  get len() {
    return this.size
  }

  traverse() {
    const values: T[] = []
    let current = this.head
    while (current) {
      values.push(current.value)
      current = current.next
    }
    console.log(values.join('->'))
  }

  insert(value: T, position: number): boolean {
    if (position > this.size || position < 0) return false
    const newNode = new Node(value)
    if (position === 0) {
      newNode.next = this.head
      this.head = newNode
    } else {
      let previous = this.getNode(position - 1)
      newNode.next = previous?.next ?? null
      previous!.next = newNode
    }
    this.size++
    return true
  }

  append(value: T): boolean {
    return this.insert(value, this.size)
  }

  removeAt(position: number): T | null {
    if (position > this.size || position < 0) return null
    let current = this.head
    if (position === 0) {
      this.head = current!.next
    } else {
      const previous = this.getNode(position - 1)
      previous!.next = previous!.next!.next
    }
    this.size--
    return current!.value
  }

  get(position: number): T | null {
    if (position < 0 || position >= this.size) return null
    return this.getNode(position)!.value
  }

  update(value: T, position: number): boolean {
    if (position < 0 || position >= this.size) return false
    const currentNode = this.getNode(position)
    currentNode!.value = value
    return true
  }

  indexOf(value: T): number {
    let current = this.head
    let index = 0
    while (current) {
      if (current.value === value) {
        return index
      }
      current = current.next
      index++
    }
    return -1
  }

  remove(value: T): T | null {
    const index = this.indexOf(value)
    return this.removeAt(index)
  }

  isEmpty() {
    return this.size === 0
  }
}

const linkedList = new LinkedList<string>()
linkedList.append('aaa')
linkedList.append('bbb')
linkedList.append('ccc')
linkedList.append('ddd')
linkedList.traverse()

console.log('\n-----测试insert-----')
linkedList.insert('abc', 0)
linkedList.traverse()
linkedList.insert('cba', 2)
linkedList.traverse()
linkedList.insert('bca', 6)
linkedList.traverse()

console.log('\n-----测试removeAt-----')
linkedList.removeAt(0)
linkedList.traverse()
linkedList.removeAt(1)
linkedList.traverse()

console.log('\n-----测试get-----')
console.log(linkedList.get(2))

console.log('\n-----测试update-----')
console.log(linkedList.update('ppp', 1))
linkedList.traverse()

console.log('\n-----测试indexOf-----')
console.log(linkedList.indexOf('ccc'))

console.log('\n-----测试remove-----')
linkedList.remove('ccc')
linkedList.traverse()

export {}
