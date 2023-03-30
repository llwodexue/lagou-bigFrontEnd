const Koa = require('../Koa')

const app = new Koa()

// app.use(ctx => {
//   ctx.body = 'hahaha'
// })

const delay = () => Promise.resolve(resolve => setTimeout(() => resolve(), 2000))
app.use(async (ctx, next) => {
  ctx.body = '1'
  await next()
  ctx.body += '5'
})
app.use(async (ctx, next) => {
  ctx.body += '2'
  await delay()
  await next()
  ctx.body += '4'
})
app.use(async (ctx, next) => {
  ctx.body += '3'
})

app.listen(3000, () => {
  console.log('监听端口已启动')
})
