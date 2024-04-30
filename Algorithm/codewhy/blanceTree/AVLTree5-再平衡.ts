import AVLTreeNode from './AVLTree4-左旋转'
import { BSTree } from './TreeNode'

class AVLTree<T> extends BSTree<T> {
  // 如果去找到不平衡的节点 先不管

  // 假设已经找到了，那么我们如何让这个节点变的不平衡
  /**
   * 根据不平衡的节点的情况(LL/LR/RL/RR)
   * @param root 找到不平衡的节点
   */
  reBalance(root: AVLTreeNode<T>) {
    const pivot = root.higherChild
    const current = pivot?.higherChild
    let resultNode: AVLTreeNode<T> | null = null
    if (pivot?.isLeft) {
      if (current?.isLeft) {
        // LL
        resultNode = root.rightRotation()
      } else {
        // LR
        pivot.leftRotation()
        resultNode = root.rightRotation()
      }
    } else {
      if (current?.isLeft) {
        // RL
        pivot?.rightRotation()
        resultNode = root.leftRotation()
      } else {
        // RR
        resultNode = root.leftRotation()
      }
    }
    // 判断返回的 pivot 是否有父节点
    if (!resultNode.parent) {
      this.root = resultNode
    }
  }
}

const avlTree = new AVLTree<number>()
avlTree.insert(50)
avlTree.insert(100)
avlTree.insert(150)
avlTree.print()

export {}