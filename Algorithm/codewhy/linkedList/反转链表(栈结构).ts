import ListNode from './ListNode'

// function reverseList(head: ListNode | null): ListNode | null {
//   // 1.head本身是null情况
//   if (head === null) return null
//   // 2.只有head一个节点
//   if (head.next === null) return head
//   const stack: ListNode[] = []

//   let current: ListNode | null = head
//   while (current) {
//     stack.push(current)
//     current = current.next
//   }
//   const newHead: ListNode = stack.pop()!
//   let newHeadCurrent = newHead
//   while (stack.length) {
//     const node = stack.pop()!
//     newHeadCurrent.next = node
//     newHeadCurrent = newHeadCurrent.next
//   }
//   newHeadCurrent.next = null
//   return newHead
// }

function reverseList(head: ListNode | null): ListNode | null {
  if (head === null) return null
  if (head.next === null) return head
  const stack: ListNode[] = []
  let current: ListNode | null = head
  while (current) {
    stack.push(current)
    current = current.next
  }
  let newHead: ListNode = stack.pop()!
  let newHeadCurrent = newHead
  while (stack.length) {
    const node = stack.pop()!
    newHeadCurrent.next = node
    newHeadCurrent = newHeadCurrent.next
  }
  newHeadCurrent.next = null
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
