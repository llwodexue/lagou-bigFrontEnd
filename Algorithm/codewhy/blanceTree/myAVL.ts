class Node<T> {
  data: T
  constructor(value: T) {
    this.data = value
  }
}

class TreeNode<T> extends Node<T> {}

class AVLTreeNode<T> extends TreeNode<T> {
  left: AVLTreeNode<T> | null = null
  right: AVLTreeNode<T> | null = null
  parent: AVLTreeNode<T> | null = null
  height: number = 1

  getHeight(): number {
    const leftHeight = this.left ? this.left.getHeight() : 0
    const rightHeight = this.right ? this.right.getHeight() : 0
    return Math.max(leftHeight, rightHeight) + 1
  }
  getBalancedFactor(): number {
    const leftHeight = this.left ? this.left.getHeight() : 0
    const rightHeight = this.right ? this.right.getHeight() : 0
    return leftHeight - rightHeight
  }
  get isBalanced(): boolean {
    const factor = this.getBalancedFactor()
    return Math.abs(factor) <= 1
  }
}

const avlNode = new AVLTreeNode(10)
avlNode.right = new AVLTreeNode(15)
avlNode.right.right = new AVLTreeNode(20)
console.log(avlNode.isBalanced)

export {}
