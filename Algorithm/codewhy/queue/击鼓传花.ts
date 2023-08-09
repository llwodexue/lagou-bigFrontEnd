import ArrayQueue from './queue'

function hotPotato(names: string[], num: number) {
  if (names.length === 0) return -1
  // 1.创建队列结构
  const queue = new ArrayQueue<string>()
  // 2.将所有的name入队操作
  for (const name of names) {
    queue.enqueue(name)
  }
  // 3.淘汰规则
  while (queue.size() > 1) {
    for (let i = 1; i < num; i++) {
      const name = queue.dequeue()
      if (name) queue.enqueue(name)
    }
    queue.dequeue()
  }
  return queue.dequeue()
}

const leftName = hotPotato(['why', 'james', 'kobe', 'curry'], 3)
console.log(leftName)
