const Controller = require('egg').Controller

class BaseController extends Controller {
  success(data, message = '请求成功~') {
    this.ctx.body = {
      code: 0,
      data: data,
      message: message
    }
  }

  error(message, code = -1, errors = {}) {
    this.ctx.body = {
      code,
      message,
      errors
    }
  }
}

module.exports = BaseController
