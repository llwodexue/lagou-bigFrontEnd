Promise.resolve(1)
  // .then(x => x)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

// 事件循环, 主线程
while (macroQueue.waitForMessage()) {
  // 1. 执行完调用栈上当前的宏任务(同步任务)
  // call stack

  // 2. 遍历微任务队列，把微任务队里上的所有任务都执行完毕(清空微任务队列)
  // 微任务又可以往微任务队列中添加微任务
  for (let i = 0; i < microQueue.length; i++) {
    // 获取并执行下一个微任务(先进先出)
    microQueue[i].processNextMessage()
  }

  // 3. 渲染（渲染线程）

  // 4. 从宏任务队列中取 一个 任务，进入下一个消息循环
  macroQueue.processNextMessage()
}
