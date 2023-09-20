const express = require('express')

const app = express()
let count = 0

app.post('/analytics', (req, res) => {
  count++
  console.log('post', count, req.query)
  res.send({
    code: 200,
    msg: 'success',
    data: [{ info: 'post请求成功' }]
  })
})

app.get('/analytics', (req, res) => {
  console.log('get', req.params)
  setTimeout(() => {
    res.send({
      code: 200,
      msg: 'success',
      data: [{ info: 'get请求成功' }]
    })
  }, 2000)
})

const port = 8089

app.listen(port, () => console.log(`http://127.0.0.1:${port}`))
