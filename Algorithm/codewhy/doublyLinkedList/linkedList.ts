import ILinkedList from './ILinkedList'
class Node<T> {
  value: T
  next: Node<T> | null = null
  constructor(value: T) {
    this.value = value
  }
}

class LinkedList<T> implements ILinkedList<T> {
  protected head: Node<T> | null = null
  protected length: number = 0
  protected tail: Node<T> | null = null
  // 根据position获取到当前的节点（不是节点的value，而是获取节点）
  protected getNode(position: number) {
    let index = 0
    let current = this.head
    while (index++ < position && current) {
      current = current.next
    }
    return current
  }
  // 判断是否是最后一个节点
  private isTail(node: Node<T>) {
    return this.tail === node
  }
  size() {
    return this.length
  }
  peek() {
    return this.head?.value
  }

  append(value: T) {
    // 1.根据value创建一个新节点
    const newNode = new Node(value)
    // 2.判断this.head是否为null
    if (!this.head) {
      this.head = newNode
    } else {
      this.tail!.next = newNode
    }
    this.tail = newNode
    this.length++
  }

  traverse() {
    const values: T[] = []
    let current = this.head
    while (current) {
      values.push(current.value)
      if (this.isTail(current)) {
        current = null
      } else {
        current = current.next
      }
    }
    // 循环链表
    if (this.head && this.tail?.next === this.head) {
      values.push(this.head.value)
    }
    console.log(values.join('->'))
  }

  insert(value: T, position: number) {
    // 1.越界的判断
    if (position < 0 || position > this.length) return false
    // 2.根据value创建新的节点
    const newNode = new Node(value)
    // 3.判断是否需要插入头部
    if (position === 0) {
      // 新节点next指向头部节点、头部
      newNode.next = this.head
      this.head = newNode
    } else {
      const previous = this.getNode(position - 1)
      newNode.next = previous?.next ?? null
      previous!.next = newNode
      if (position === this.length) {
        this.tail = newNode
      }
    }
    this.length++
    return true
  }

  removeAt(position: number) {
    // 1.越界的判断
    if (position < 0 || position >= this.length) return null
    // 2.判断是否是删除第一个节点
    let current = this.head
    if (position === 0) {
      this.head = current?.next ?? null
      if (this.length === 1) {
        this.tail = null
      }
    } else {
      const previous = this.getNode(position - 1)
      current = previous!.next
      previous!.next = previous?.next?.next ?? null
      if (position === this.length - 1) {
        this.tail = previous
      }
    }
    this.length--
    return current?.value ?? null
  }

  get(position: number) {
    // 1.越界的判断
    if (position < 0 || position >= this.length) return null
    // 2.查找元素，并且返回元素
    return this.getNode(position)?.value ?? null
  }

  update(value: T, position: number) {
    if (position < 0 || position >= this.length) return false
    const currentNode = this.getNode(position)
    // 获取对应位置的节点，直接更新即可
    currentNode!.value = value
    return true
  }

  indexOf(value: T) {
    let current = this.head
    let index = 0
    while (current) {
      if (current.value === value) {
        return index
      }
      if (this.isTail(current)) {
        current = null
      } else {
        current = current.next
      }
      index++
    }
    return -1
  }

  remove(value: T) {
    const index = this.indexOf(value)
    return this.removeAt(index)
  }

  isEmpty() {
    return this.length === 0
  }
}

export default LinkedList
