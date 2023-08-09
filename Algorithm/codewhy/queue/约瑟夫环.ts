import ArrayQueue from './queue'

// function lastRemaining(n: number, m: number) {
//   // 1.创建队列
//   const queue = new ArrayQueue<number>()
//   // 2.将所有的数字加入队列中
//   for (let i = 0; i < n; i++) {
//     queue.enqueue(i)
//   }
//   // 3.判断队列中是否还有数字
//   while (queue.size() > 1) {
//     for (let i = 1; i < m; i++) {
//       queue.enqueue(queue.dequeue()!)
//     }
//     queue.dequeue()
//   }
//   return queue.dequeue()
// }

function lastRemaining(n: number, m: number) {
  let position = 0
  for (let i = 2; i <= n; i++) {
    position = (position + m) % i
  }
  return position
}

console.log(lastRemaining(5, 3)) // 3
console.log(lastRemaining(10, 17)) // 2
