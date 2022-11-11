'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const jwt = app.middleware.jwt({ app })

  router.get('/', controller.home.index)

  // 验证码
  router.get('/captcha', controller.common.captcha)

  // 邮件验证
  router.get('/sendEmail', controller.common.sendEmail)

  // 文件上传
  router.post('/uploadFile', controller.common.uploadFile)

  // 文件合并
  router.post('/merge', controller.common.mergeFile)

  // 检查文件是否有上传过
  router.post('/checkfile', controller.common.checkfile)

  // 路由组
  router.group({ name: 'user', prefix: '/user' }, router => {
    const { login, register, verify, info } = controller.user

    router.post('/login', login)
    router.post('/register', register)

    // 获取用户信息的路由需要jwt鉴权中间件;
    router.get('/info', jwt, info)

    router.get('/verify', verify)
  })
}
