// CreateTaskQueue/index.js
const createTaskQueue = () => {
  const taskQueue = []
  return {
    /**
     *
     * 向任务队列中添加任务
     */
    push: item => taskQueue.push(item),
    /**
     * 从任务队列中获取任务
     */
    pop: () => taskQueue.shift()
  }
}
export default createTaskQueue

// reconciliation/index.js
import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()

export const render = (element, dom) => {
  /**
   * 1. 向任务中添加任务
   * 2. 指定在浏览器空闲时执行任务
   * 任务就是通过 vdom 对象 构建 fiber 对象
   */
  taskQueue.push({
    dom,
    props: { children: element }
  })

  console.log(taskQueue.pop())
}

// index.js
import createElement from './createElement'
export { render } from './reconciliation' // 导出render方法
