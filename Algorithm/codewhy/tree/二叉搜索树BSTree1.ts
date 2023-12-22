import { btPrint, PrintableNode } from 'hy-algokit'

class Node<T> {
  data: T
  constructor(value: T) {
    this.data = value
  }
}
class Product {
  constructor(public name: string, public price: number) {}
  valueOf() {
    return this.price
  }
}
class TreeNode<T> extends Node<T> implements PrintableNode {
  left: TreeNode<T> | null = null
  right: TreeNode<T> | null = null
  get value() {
    const data = this.data as Product
    return `${data.name}-${data.price}`
  }
  parent: TreeNode<T> | null = null
  get isLeft(): boolean {
    return !!(this.parent && this.parent.left === this)
  }
  get isRight(): boolean {
    return !!(this.parent && this.parent.right === this)
  }
}
class BSTree<T> {
  private root: TreeNode<T> | null = null
  print() {
    btPrint(this.root)
  }
  private searchNode(value: T): TreeNode<T> | null {
    let current = this.root
    let parent: TreeNode<T> | null = null
    while (current) {
      if (current.data === value) return current
      parent = current
      if (current.data < value) {
        current = current.right
      } else {
        current = current.left
      }
      if (current) current.parent = parent
    }
    return null
  }
  /** 插入数据的操作 */
  insert(value: T) {
    // 1.根据传入value创建Node(TreeNode)节点
    const newNode = new TreeNode(value)
    // 2.判断当前是否已经有了根节点
    if (!this.root) {
      // 当前树为空
      this.root = newNode
    } else {
      // 树中已经有其他值
      this.insertNode(this.root, newNode)
    }
  }
  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>) {
    if (newNode.data < node.data) {
      // 去左边继续查找空白位置
      if (node.left === null) {
        node.left = newNode
      } else {
        this.insertNode(node.left, newNode)
      }
    } else {
      // 去右边继续查找空白位置
      if (node.right === null) {
        node.right = newNode
      } else {
        this.insertNode(node.right, newNode)
      }
    }
  }
  /** 遍历的操作 */
  /** 先序遍历 */
  preOrderTraverse() {
    this.preOrderTraverseNode(this.root)
  }
  private preOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      console.log(node.data)
      this.preOrderTraverseNode(node.left)
      this.preOrderTraverseNode(node.right)
    }
  }
  preOrderTraversalNoRecursion() {
    let stack: TreeNode<T>[] = []
    let current: TreeNode<T> | null = this.root
    while (current !== null || stack.length !== 0) {
      while (current !== null) {
        console.log(current.data)
        stack.push(current)
        current = current.left
      }
      current = stack.pop()!
      current = current.right
    }
  }
  /** 中序遍历 */
  inOrderTraverse() {
    this.inOrderTraverseNode(this.root)
  }
  private inOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      this.inOrderTraverseNode(node.left)
      console.log(node.data)
      this.inOrderTraverseNode(node.right)
    }
  }
  inOrderTraversalNoRecursion() {
    let stack: TreeNode<T>[] = []
    let current: TreeNode<T> | null = this.root
    while (current !== null || stack.length !== 0) {
      while (current !== null) {
        stack.push(current)
        current = current.left
      }
      current = stack.pop()!
      console.log(current.data)
      current = current.right
    }
  }
  /** 后序遍历 */
  postOrderTraverse() {
    this.postOrderTraverseNode(this.root)
  }
  private postOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      this.postOrderTraverseNode(node.left)
      this.postOrderTraverseNode(node.right)
      console.log(node.data)
    }
  }
  postOrderTraversalNoRecursion() {
    let stack: TreeNode<T>[] = []
    let current: TreeNode<T> | null = this.root
    let lastVisitedNode: TreeNode<T> | null = null
    while (current !== null || stack.length !== 0) {
      while (current !== null) {
        stack.push(current)
        current = current.left
      }
      current = stack[stack.length - 1]
      if (current.right === null || current.right === lastVisitedNode) {
        console.log(current.data)
        lastVisitedNode = current
        stack.pop()
        current = null
      } else {
        current = current.right
      }
    }
  }
  /** 层序遍历 */
  levelOrderTraverse() {
    // 1.如果没有根节点，那么不需要遍历
    if (!this.root) return
    // 2.创建队列结构
    const queue: TreeNode<T>[] = []
    queue.push(this.root)
    // 3.遍历队列中所有的节点（依次出队）
    while (queue.length) {
      // 3.1访问节点的过程
      const current = queue.shift()!
      console.log(current.data)
      // 3.2将左子节点放入队列
      if (current.left) {
        queue.push(current.left)
      }
      // 3.3将右子节点放入到队列
      if (current.right) {
        queue.push(current.right)
      }
    }
  }
  /** 获取最值操作：最大值 */
  getMaxValue(): T | null {
    let current = this.root
    while (current && current.right) {
      current = current.right
    }
    return current?.data ?? null
  }
  /** 获取最值操作：最小值 */
  getMinValue(): T | null {
    let current = this.root
    while (current && current.left) {
      current = current.left
    }
    return current?.data ?? null
  }
  /** 搜索特定的值 */
  searchNoRecursion(value: T): boolean {
    let current = this.root
    while (current) {
      // 找到了节点
      if (current.data === value) return true
      if (current.data < value) {
        current = current.right
      } else {
        current = current.left
      }
    }
    return false
  }
  search(value: T): boolean {
    return !!this.searchNode(value)
  }
  searchNodeValue(node: TreeNode<T> | null, value: T): boolean {
    // 1.如果节点为null，那么就直接退出递归
    if (node === null) return false
    // 2.判断node节点的value和传入的value的大小
    if (node.data > value) {
      return this.searchNodeValue(node.left, value)
    } else if (node.data < value) {
      return this.searchNodeValue(node.right, value)
    } else {
      return true
    }
  }
  /** 删除操作 */
  private getSuccessor(delNode: TreeNode<T>) {
    // 获取右子树
    let current = delNode.right
    let successor: TreeNode<T> | null = null
    while (current) {
      successor = current
      current = current.left
      if (current) {
        current.parent = successor
      }
    }
    // 拿到后继节点
    if (successor !== delNode.right) {
      successor!.parent!.left = successor!.right
      successor!.right = delNode.right
    }

    // 将删除节点的 left，赋值给后继节点的 left
    successor!.left = delNode.left
    return successor
  }
  remove(value: T): boolean {
    // 1.搜索当前是否有这个value
    const current = this.searchNode(value)
    if (!current) return false
    // 2.获取到三个东西：当前节点/父节点是否属于父节点的左子节点还是右子节点
    if (current.left === null && current.right === null) {
      // 2.1.如果删除的是叶子节点
      if (current === this.root) {
        // 根节点
        this.root = null
      } else if (current.isLeft) {
        // 父节点的左子节点
        current.parent!.left = null
      } else {
        current.parent!.right = null
      }
    } else if (current.right === null) {
      // 2.2.只有一个子节点，只有左子节点
      if (current === this.root) {
        this.root = current.left
      } else if (current.isLeft) {
        current.parent!.left = current.left
      } else {
        current.parent!.right = current.left
      }
    } else if (current.left === null) {
      // 2.3.只有一个子节点，只有右子节点
      if (current === this.root) {
        this.root = current.right
      } else if (current.isLeft) {
        current.parent!.left = current.right
      } else {
        current.parent!.right = current.right
      }
    } else {
      // 2.4.两个子节点
      const successor = this.getSuccessor(current)
      if (current === this.root) {
        this.root = successor
      } else if (current.isLeft) {
        current.parent!.left = successor
      } else {
        current.parent!.right = successor
      }
    }
    return true
  }
}

const bst1 = new BSTree<Product>()
const p1 = new Product('iphone', 150)
const p2 = new Product('huawei', 120)
const p3 = new Product('xiaomi', 80)
const p4 = new Product('vivo', 100)
const p5 = new Product('oppo', 70)
bst1.insert(p2)
bst1.insert(p1)
bst1.insert(p3)
bst1.insert(p4)
bst1.insert(p5)
bst1.print()

// const bst = new BSTree<number>()
// bst.insert(11)
// bst.insert(7)
// bst.insert(15)
// bst.insert(5)
// bst.insert(3)
// bst.insert(9)
// bst.insert(8)
// bst.insert(10)
// bst.insert(13)
// bst.insert(12)
// bst.insert(14)
// bst.insert(20)
// bst.insert(18)
// bst.insert(25)
// bst.insert(6)
// bst.print()
// console.log('\n')

// bst.preOrderTraverse()
// bst.preOrderTraversalNoRecursion()
// bst.inOrderTraverse()
// bst.inOrderTraversalNoRecursion()
// bst.postOrderTraverse()
// bst.postOrderTraversalNoRecursion()
// bst.levelOrderTraverse()
// console.log(bst.getMaxValue())
// console.log(bst.getMinValue())
// console.log(bst.searchNoRecursion(11))
// console.log(bst.searchNoRecursion(19))
// console.log('\n')

// bst.remove(3)
// bst.remove(12)
// bst.remove(6)
// bst.remove(25)
// console.log('\n')
// bst.remove(20)
// bst.remove(13)
// bst.print()

// bst.remove(11)
// bst.print()
// bst.remove(15)
// bst.print()
// bst.remove(9)
// bst.print()
// bst.remove(7)
// bst.print()

export {}
