const express = require('express')
const path = require('path')

const app = express()
let count = 0

app.post('/analytics', (req, res) => {
  count++
  console.log('post', count, req.query)
  res.send({
    code: 200,
    msg: 'success',
    data: [{ info: 'post请求成功', data: count }]
  })
})

app.get('/analytics', (req, res) => {
  count++
  console.log('get', count, req.params)
  setTimeout(() => {
    res.send({
      code: 200,
      msg: 'success',
      data: [{ info: 'get请求成功' }]
    })
  }, 2000)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

const port = 8090

app.listen(port, () => console.log(`http://127.0.0.1:${port}`))