function compose(middleware) {
  // 这里返回的函数，就是上文中的 fnMiddleware
  return function (context, next) {
    let index = -1
    return dispatch(0)

    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      // 取出第 i 个中间件为 fn
      let fn = middleware[i]

      if (i === middleware.length) fn = next

      // 已经取到了最后一个中间件，直接返回一个 Promise 实例，进行串联
      // 这一步的意义是保证最后一个中间件调用 next 方法时，也不会报错
      if (!fn) return Promise.resolve()

      try {
        // 把 ctx 和 next 方法传入到中间件 fn 中，并将执行结果使用 Promise.resolve 包装
        // 这里可以发现，我们在一个中间件中调用的 next 方法，其实就是dispatch.bind(null, i + 1)，即调用下一个中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
