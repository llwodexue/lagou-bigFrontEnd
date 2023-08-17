import ListNode from './ListNode'

function reverseList(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head
  const newHead = reverseList(head.next)
  // 第一次来这里的时候，是倒数第二个节点
  head.next.next = head
  head.next = null
  return newHead
}

const node1 = new ListNode(1)
node1.next = new ListNode(2)
node1.next.next = new ListNode(3)
const newHead = reverseList(node1)
let current = newHead
while (current) {
  console.log(current.val)
  current = current.next
}

export {}
