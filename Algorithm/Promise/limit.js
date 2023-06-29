class LimitPromise {
  constructor(max) {
    // 异步并发的并发上限
    this._max = max || 6
    // 当前正在执行任务数量
    this._count = 0
    // 等待执行的任务队列
    this._taskQueue = []
    // 当前实例
    this.instance = null
  }

  run(caller) {
    // 主入口
    // 输入：外部传入要添加的请求
    // 输出：队列处理的 promise
    return new Promise((resolve, reject) => {
      // 创建一个处理任务
      const task = this._createTask(caller, resolve, reject)
      // 当前任务数量是否达到上限
      if (this._count >= this._max) {
        this._taskQueue.push(task)
      } else {
        task()
      }
    })
  }

  _createTask(caller, resolve, reject) {
    return () => {
      caller()
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          this._count--
          if (this._taskQueue.length) {
            // 完成任务清出
            const task = this._taskQueue.shift()
            task()
          }
        })
        this._count++
    }
  }

  // 单例暴露
  static getInstance(max) {
    if (!this.instance) {
      this.instance = new LimitPromise(max)
    }
    return this.instance
  }
}
