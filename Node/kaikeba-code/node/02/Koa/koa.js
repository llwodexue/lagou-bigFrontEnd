const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Koa {
  constructor() {
    this.middleWares = []
  }
  listen(...args) {
    // 创建 http 服务
    const server = http.createServer(async (req, res) => {
      // 创建上下文
      let ctx = this.createContext(req, res)

      // this.callback(ctx)
      // 合成
      const fn = this.compose(this.middleWares)
      await fn(ctx)

      // 数据响应
      res.end(ctx.body)
    })
    // 启动监听
    server.listen(...args)
  }
  // use(callback) {
  //   this.callback = callback
  // }
  use(middleWares) {
    this.middleWares.push(middleWares)
  }
  /**
   * 创建上下文
   * @param {*} req
   * @param {*} res
   * @returns
   */
  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)

    ctx.req = ctx.request.req = req
    ctx.res = ctx.request.res = res
    return ctx
  }
  /**
   * 合成函数
   * @param {*} middleWares
   */
  compose(middleWares) {
    return function (ctx) {
      function dispatch(i) {
        const fn = middleWares[i]
        if (!fn) {
          return Promise.resolve()
        }
        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1)
          })
        )
      }
      return dispatch(0)
    }
  }
}

module.exports = Koa
