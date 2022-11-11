const BaseController = require('./base')
const md5 = require('md5')
const HashSalt = ':hope@good#$!%'
const jwt = require('jsonwebtoken')

class UserController extends BaseController {
  /**
   * 用户登录接口
   */
  async login() {
    const { ctx, app } = this
    const { username, password, captcha } = ctx.request.body

    // 验证码是否与 session 存储的验证码一致
    if (captcha && captcha.toLocaleLowerCase() !== ctx.session.captcha.toLocaleLowerCase())
      return this.error('验证码输入错误')

    const user = await ctx.model.User.findOne({
      username,
      password: md5(password + HashSalt)
    })

    if (!user) return this.error('用户名或密码错误~')

    // 将用户信息加密成 token 返回给前端
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      app.config.jwt.secret,
      {
        expiresIn: '1h'
      }
    )

    this.success({ token: token, nickname: user.nickname })
  }

  /**
   * 用户注册接口
   */
  async register() {
    const { ctx } = this
    const { username, nickname, password, captcha, emailcode } = ctx.request.body

    // 验证码是否与 session 存储的验证码一致
    if (captcha && captcha.toLocaleLowerCase() !== ctx.session.captcha.toLocaleLowerCase())
      return this.error('验证码输入错误')

    // 邮箱验证
    //if(emailcode && emailcode == ctx.session.emailcode) return this.error("验证码输入错误");

    // 用户名是否存在
    if (await this.checkUserName(username)) return this.error('用户名已存在')

    const ret = await ctx.model.User.create({
      username,
      password: md5(password + HashSalt), // 前端传过来的密码再一次进行 md5
      nickname
    })

    return ret._id ? this.success('注册成功~') : this.error('注册失败,请重试~')
  }

  /**
   * 用户信息接口
   */
  async info() {
    const { ctx } = this

    // 从 token 里面去读取用户数据, 这一步交给中间件 jwt 去处理, 因为后面很多路由可能会用到这个中间件;
    const { username, userid } = ctx.state
    const ret = await ctx.model.User.findOne({ username, _id: userid })
    this.success(ret)
  }

  async checkUserName(username) {
    return await this.ctx.model.User.findOne({ username })
  }

  async verify() {
    this.success({ name: 'hope' })
  }
}

module.exports = UserController
