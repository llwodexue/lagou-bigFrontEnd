const resolvedPromise = Promise.resolve()
let currentFlushPromise = null
function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise
  // bind 实际绑定的是 this
  return fn ? p.then(fn) : p
}

// 是否正在刷新
let isFlushing = false

// 是否有任务需要刷新
let isFlushPending = false

// 刷新任务队列
function queueFlush() {
  // 如果正在刷新，并且没有任务需要刷新
  if (!isFlushing && !isFlushPending) {
    // 将 isFlushPending 设置为 true，表示有任务需要刷新
    isFlushPending = true

    // 将 currentFlushPromise 设置为一个 Promise, 并且在 Promise 的 then 方法中执行 flushJobs
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

// 任务队列
const queue = []
// 当前正在刷新的任务队列的索引
let flushIndex = 0
// 刷新任务
function flushJobs(seen) {
  // 将 isFlushPending 设置为 false，表示当前没有任务需要等待刷新了
  isFlushPending = false

  // 将 isFlushing 设置为 true，表示正在刷新
  isFlushing = true

  // 非生产环境下，将 seen 设置为一个 Map
  if (process.env.NODE_ENV !== 'production') {
    seen = seen || new Map()
  }

  // 刷新前，需要对任务队列进行排序
  // 这样可以确保：
  // 1. 组件的更新是从父组件到子组件的。
  //    因为父组件总是在子组件之前创建，所以它的渲染优先级要低于子组件。
  // 2. 如果父组件在更新的过程中卸载了子组件，那么子组件的更新可以被跳过。
  queue.sort(comparator)

  // 非生产环境下，检查是否有递归更新
  // checkRecursiveUpdates 方法的使用必须在 try ... catch 代码块之外确定，
  // 因为 Rollup 默认会在 try-catch 代码块中进行 treeshaking 优化。
  // 这可能会导致所有警告代码都不会被 treeshaking 优化。
  // 虽然它们最终会被像 terser 这样的压缩工具 treeshaking 优化，
  // 但有些压缩工具会失败（例如：https://github.com/evanw/esbuild/issues/1610)
  const check =
    process.env.NODE_ENV !== 'production' ? job => checkRecursiveUpdates(seen, job) : NOOP

  // 检测递归调用是一个非常巧妙的操作，感兴趣的可以去看看源码，这里不做讲解
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && job.active !== false) {
        if (process.env.NODE_ENV !== 'production' && check(job)) {
          continue
        }

        // 执行任务
        callWithErrorHandling(job, null, 14 /* ErrorCodes.SCHEDULER */)
      }
    }
  } finally {
    // 重置 flushIndex
    flushIndex = 0

    // 快速清空队列，直接给 数组的 length属性 赋值为 0 就可以清空数组
    queue.length = 0

    // 刷新生命周期的回调
    flushPostFlushCbs(seen)

    // 将 isFlushing 设置为 false，表示当前刷新结束
    isFlushing = false

    // 将 currentFlushPromise 设置为 null，表示当前没有任务需要刷新了
    currentFlushPromise = null

    // pendingPostFlushCbs 存放的是生命周期的回调，
    // 所以可能在刷新的过程中又有新的任务需要刷新
    // 所以这里需要判断一下，如果有新添加的任务，就需要再次刷新
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen)
    }
  }
}

// 添加任务，这个方法会在下面的 queueFlush 方法中被调用
function queueJob(job) {
  // 通过 Array.includes() 的 startIndex 参数来搜索任务队列中是否已经存在相同的任务
  // 默认情况下，搜索的起始索引包含了当前正在执行的任务
  // 所以它不能递归地再次触发自身
  // 如果任务是一个 watch() 回调，那么搜索的起始索引就是 +1，这样就可以递归调用了
  // 但是这个递归调用是由用户来保证的，不能无限递归
  if (
    !queue.length ||
    !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)
  ) {
    // 如果任务没有 id 属性，那么就将任务插入到任务队列中
    if (job.id == null) {
      queue.push(job)
    }

    // 如果任务有 id 属性，那么就将任务插入到任务队列的合适位置
    else {
      queue.splice(findInsertionIndex(job.id), 0, job)
    }

    // 刷新任务队列
    queueFlush()
  }
}
