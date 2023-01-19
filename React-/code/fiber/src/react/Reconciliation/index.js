import { createTaskQueue, arrified, createStateNode, getTag } from '../Misc'

const taskQueue = createTaskQueue()

/**
 * 要执行的子任务
 */
let subTask = null

let pendingCommit = null

const commitAllWork = fiber => {
  fiber.effects.forEach(item => {
    if (item.effectTag === 'placement') {
      item.parent.stateNode.appendChild(item.stateNode)
    }
  })
}

/**
 * 指的不是获取任务队列中的第一个任务，而是任务队列的第一个子任务
 */
const getFirstTask = () => {
  /**
   * 从任务列队获取任务
   */
  const task = taskQueue.pop()
  /**
   * 返回最外层节点的 fiber 对象
   */
  return {
    props: task.props,
    stateNode: task.dom,
    tag: 'host_root',
    effects: [],
    child: null
  }
}

const reconcileChildren = (fiber, children) => {
  /**
   * children 可能是对象也可能是数组，将 children 转换成数组
   */
  const arrifiedChildren = arrified(children)
  let index = 0
  const numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null
  while (index < numberOfElements) {
    /**
     * 子级 virtualDOM 对象
     */
    element = arrifiedChildren[index]
    /**
     * 子级 fiber 对象
     */
    newFiber = {
      type: element.type,
      props: element.props,
      tag: getTag(element),
      effects: [],
      effectTag: 'placement',
      stateNode: null,
      parent: fiber
    }

    /**
     * 为 fiber 节点添加 DOM 对象或组件实例对象
     */
    newFiber.stateNode = createStateNode(newFiber)

    // 为父级 fiber 添加子级 fiber
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 为 fiber 添加下一个兄弟 fiber
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
    index++
  }
}

/**
 * 如果子级存在返回子级
 * 将这个子级当做父级，构建这个父级下的子级
 */
const executeTask = fiber => {
  reconcileChildren(fiber, fiber.props.children)

  if (fiber.child) {
    return fiber.child
  }

  let currentExecuteFiber = fiber
  while (currentExecuteFiber.parent) {
    currentExecuteFiber.parent.effects = currentExecuteFiber.parent.effects.concat(
      currentExecuteFiber.effects.concat([currentExecuteFiber])
    )
    if (currentExecuteFiber.sibling) {
      return currentExecuteFiber.sibling
    }
    currentExecuteFiber = currentExecuteFiber.parent
  }
  pendingCommit = currentExecuteFiber
}

const workLoop = deadline => {
  /**
   * 如果子任务不存在，就去获取子任务
   */
  if (!subTask) {
    subTask = getFirstTask()
  }
  /**
   * 如果任务存在并且浏览器有空余时间
   * 就调用 executeTask 方法执行任务，接收任务返回新的任务
   */
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

const performTask = deadline => {
  /**
   * 执行任务
   */
  workLoop(deadline)
  /**
   * 判断任务是否存在
   * 判断任务队列中是否还有任务没有执行
   * 再一次告诉浏览器在空闲的时间执行任务
   */
  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask)
  }
}

/**
 * 1.向任务队列中添加任务
 * 2.指定在浏览器空闲时执行任务
 * 任务就是通过 vdom 构建 fiber 对象
 */
export const render = (element, dom) => {
  taskQueue.push({
    dom,
    props: { children: element }
  })

  /**
   * 在浏览器空闲的时间去执行任务
   */
  requestIdleCallback(performTask)
}
