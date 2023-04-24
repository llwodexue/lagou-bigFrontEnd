const router = require('koa-router')()

router.prefix('/react17') // 添加前缀 http://localhost:3000/react17

router.post('/login', function (ctx, next) {
  // ctx.request.body   // 获取POST请求参数
  ctx.body = 'this is respose' 
})



module.exports = router
