class Node<T> {
  value: T
  next: Node<T> | null = null
  constructor(value: T) {
    this.value = value
  }
}

class LinkedList<T> {
  private head: Node<T> | null = null
  private size: number = 0
  get lenght() {
    return this.size
  }
  // 根据position获取到当前的节点（不是节点的value，而是获取节点）
  private getNode(position: number): Node<T> | null {
    let index = 0
    let current = this.head
    while (index++ < position && current) {
      current = current.next
    }
    return current
  }

  append(value: T) {
    // 1.根据value创建一个新及诶单
    const newNode = new Node(value)
    // 2.判断this.heade是否为null
    if (!this.head) {
      this.head = newNode
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = newNode
    }
    this.size++
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
    // 1.越界的判断
    if (position < 0 || position > this.size) return false
    // 2.根据value创建新的节点
    const newNode = new Node(value)
    // 3.判断是否需要插入头部
    if (position === 0) {
      // 新节点next指向头部节点、头部
      newNode.next = this.head
      this.head = newNode
    } else {
      // let current = this.head
      // let previous: Node<T> | null = null
      // let index = 0
      // while (index++ < position && current) {
      //   previous = current
      //   current = current.next
      // }
      // newNode.next = current
      // previous!.next = newNode

      const previous = this.getNode(position - 1)
      newNode.next = previous?.next ?? null
      previous!.next = newNode
    }
    this.size++
    return true
  }

  removeAt(position: number): T | null {
    // 1.越界的判断
    if (position < 0 || position >= this.size) return null
    // 2.判断是否是删除第一个节点
    let current = this.head
    if (position === 0) {
      this.head = current?.next ?? null
    } else {
      // let previous: Node<T> | null = null
      // let index = 0
      // while (index++ < position && current) {
      //   previous = current
      //   current = current.next
      // }
      // previous!.next = current?.next ?? null

      const previous = this.getNode(position - 1)
      previous!.next = previous?.next?.next ?? null
    }
    this.size--
    return current?.value ?? null
  }

  get(position: number): T | null {
    // 1.越界的判断
    if (position < 0 || position >= this.size) return null
    // 2.查找元素，并且返回元素
    return this.getNode(position)?.value ?? null
  }

  update(value: T, position: number): boolean {
    if (position < 0 || position >= this.size) return false
    const currentNode = this.getNode(position)
    // 获取对应位置的节点，直接更新即可
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
linkedList.removeAt(2)
linkedList.traverse()

console.log('\n-----测试get-----')
console.log(linkedList.get(2))

console.log('\n-----测试update-----')
console.log(linkedList.update('ppp', 1))
linkedList.traverse()

console.log('\n-----测试indexOf-----')
console.log(linkedList.indexOf('ccc'))

console.log('\n-----测试remove-----')
console.log(linkedList.remove('ccc'))
linkedList.traverse()

export {}
