const Koa = require('koa')
const app = new Koa()

/**
 * 反射型 XSS
 * 
 * 访问：http://127.0.0.1:3000?userName=<script>alert("反射型 XSS 攻击")</script>
 * 
 * 在实际的开发过程中，我们会碰到这样的场景
 * 在页面A中点击某个操作，这个按钮操作是需要登录权限的，所以需要跳转到登录页面，登录完成之后再跳转回A页面
 * 我们是这么处理的，跳转登录页面的时候，会加一个参数 returnUrl，表示登录完成之后需要跳转到哪个页面
 * 即这个地址是这样的 http://xxx.com/login?returnUrl=http://xxx.com/A
 * 假如这个时候把returnUrl改成一个script脚本，而你在登录完成之后
 * 如果没有对returnUrl进行合法性判断，而直接通过window.location.href=returnUrl，这个时候这个恶意脚本就会执行
 */
app.use(async ctx => {
  // ctx.body 即服务端响应的数据
  ctx.body = ctx.query.userName
})

app.listen(3000, () => {
  console.log('启动成功')
})
