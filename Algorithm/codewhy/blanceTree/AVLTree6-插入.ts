import AVLTreeNode from './AVLTree4-左旋转'
import { BSTree, TreeNode } from './TreeNode'

class AVLTree<T> extends BSTree<T> {
  protected createNode(value: T): TreeNode<T> {
    return new AVLTreeNode(value)
  }
  // 如果去找到不平衡的节点
  checkBalance(node: AVLTreeNode<T>, isAdd = true) {
    let current = node.parent
    while (current) {
      if (!current.isBalanced) {
        this.reBalance(current)
        // 这个位置是旋转完成后的操作
        // break 决定不会进一步去查找父节点有没有平衡的情况
        // 添加的情况是不需要进一步向上查找的，直到 break
        // 删除的情况是需要进一步向上查找的，不能 break
        if (isAdd) break
      }
      current = current.parent
    }
  }

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
const delNumber: number[] = []
for (let i = 0; i < 16; i++) {
  const randomNum = Math.floor(Math.random() * 200)
  if (i % 2 === 0 && delNumber.length < 8) {
    delNumber.push(randomNum)
  }
  avlTree.insert(randomNum)
}
avlTree.print()

for (const delNum of delNumber) {
  avlTree.remove(delNum)
}

avlTree.print()

export {}
