import { TreeNode } from './TreeNode'
import { btPrint } from 'hy-algokit'

class AVLTreeNode<T> extends TreeNode<T> {
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
  /** 权重：平衡因子（左height - 右height） */
  getBalanceFactor(): number {
    const leftHeight = this.left ? this.left.getHeight() : 0
    const rightHeight = this.right ? this.right.getHeight() : 0
    return leftHeight - rightHeight
  }
  /** 直接判断当前节点是否平衡 */
  get isBalanced(): boolean {
    const factor = this.getBalanceFactor()
    return Math.abs(factor) <= 1
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
    const isLeft = this.isLeft
    const isRight = this.isRight
    // 1.处理pivot节点
    const pivot = this.left!
    pivot.parent = this.parent
    // 2.处理pivot的right
    this.left = pivot.right
    if (pivot.right) {
      pivot.right.parent = this
    }
    // 3.处理root
    pivot.right = this
    this.parent = pivot
    // 4.挂载pivot
    if (!pivot.parent) {
      // pivot直接作为tree的根
      return pivot
    } else if (isLeft) {
      // pivot作为父节点的左子节点
      pivot.parent.left = pivot
    } else if (isRight) {
      // pivot作为父节点的右子节点
      pivot.parent.right = pivot
    }
    return pivot
  }
}

const avlNode = new AVLTreeNode(10)
avlNode.left = new AVLTreeNode(8)
avlNode.left.parent = avlNode
avlNode.left.left = new AVLTreeNode(5)
avlNode.left.left.parent = avlNode.left
const parent = new AVLTreeNode(12)
avlNode.parent = parent
parent.left = avlNode
btPrint(parent)
avlNode.rightRotation()
btPrint(parent)


export {}
