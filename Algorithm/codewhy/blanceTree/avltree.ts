import { TreeNode } from './BSTree'

class AVLTreeNode<T> extends TreeNode<T> {
  // 保证获取到的left/right节点的类型是AVLTreeNode
  left: AVLTreeNode<T> | null = null
  right: AVLTreeNode<T> | null = null
  parent: AVLTreeNode<T> | null = null
  height: number = 1
  /** 获取每个节点的高度 */
  getHeight(): number {
    const leftHeight = this.left ? this.left.getHeight() : 0
    const rightHeight = this.right ? this.right.getHeight() : 0
    return Math.max(leftHeight, rightHeight) + 1
  }
  /** 权重：平衡因子(左边height-右边height) */
  getBalanceFactor(): number {
    const leftHeight = this.left ? this.left.getHeight() : 0
    const rightHeight = this.right ? this.right.getHeight() : 0
    return leftHeight - rightHeight
  }
  /** 直接判断当前节点是否平衡 */
  get isBalanced(): boolean {
    const factor = this.getBalanceFactor()
    return factor >= -1 && factor <= 1
  }
  /** 获取更高子节点 */
  public get higherChild(): AVLTreeNode<T> | null {
    const leftHeight = this.left ? this.left.getHeight() : 0
    const rightHeight = this.right ? this.right.getHeight() : 0
    if (leftHeight > rightHeight) return this.left
    if (leftHeight < rightHeight) return this.right
    return this.isLeft ? this.left : this.right
  }
  /** 旋转操作：右旋转 */
  rightRotation() {
    // 1.处理pivot节点，获取不平衡节点的左子节点和右子节点
    const pivot = this.left!
    const pivotRightChild = pivot.right
    pivot.parent = this.parent
    // 2.处理pivot的right
    this.left = pivotRightChild
    if (pivotRightChild) {
      pivotRightChild.parent = this
    }
    // 3.处理root
    pivot.right = this
    this.parent = pivot
    // 4.挂载pivot
  }
}

const avlNode = new AVLTreeNode(10)
avlNode.right = new AVLTreeNode(15)
avlNode.right.right = new AVLTreeNode(20)
console.log(avlNode.getHeight())
console.log(avlNode.getBalanceFactor())
console.log(avlNode.isBalanced)

export {}