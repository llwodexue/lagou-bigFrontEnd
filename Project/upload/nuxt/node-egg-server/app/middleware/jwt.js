// 解析 token 的中间件, 也可以使用 egg-jwt

const jwt = require('jsonwebtoken')

module.exports = ({ app }) => {
  return async function verity(ctx, next) {
    if (!ctx.request.header.authorization) {
      return (ctx.body = {
        code: -1,
        message: '登录已过期,请重新登录~'
      })
    }
    const token = ctx.request.header.authorization.replace('Hope ', '')
    try {
      const ret = await jwt.verify(token, app.config.jwt.secret)
      ctx.state.username = ret.username
      ctx.state.userid = ret.id

      await next()
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        ctx.body = {
          code: 466,
          message: '登录过期~'
        }
      } else {
        ctx.body = {
          code: -1,
          message: '用户信息出错~'
        }
      }
    }
  }
}
