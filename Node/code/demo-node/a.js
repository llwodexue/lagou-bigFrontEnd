const express = require('express')

const app = express()

app.get('/', (req, res) => {
  console.log('get', req.params)
  setTimeout(() => {
    res.send({
      code: 200,
      msg: 'success',
      data: [{ info: 'get请求成功' }]
    })
  }, 2000)
})

const port = 9090

app.listen(port, () => console.log(`http://127.0.0.1:${port}`))
