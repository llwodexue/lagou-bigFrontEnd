const router = require('koa-router')()

router.prefix('/vue2') // 添加前缀 http://localhost:3000/vue2

router.get('/car/list', function (ctx, next) {
  // ctx.request.query   // 获取GET请求参数
  
  ctx.body = [
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
    {
      img: 'https://youjia-image.cdn.bcebos.com/modelImage/f9037020cac55360e436c2a4add6cef9/16593358938844266694.jpg@!1200_width',
      name: '沃尔沃'
    },
  ]
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
