const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const username_DB = 'bird'
const password_DB = '123456'
const jwtSecret = '服务器的JWT密码'

app.post('/login', (req, res) => {
  if (req.body.username === username_DB && req.body.password === password_DB) {
    const token = jwt.sign({ name: 'jwt校验' }, jwtSecret, {
      algorithm: 'HS256',
      expiresIn: 10000
    })
    res.send(token)
  } else {
    res.send('账号或密码错误')
  }
})

app.post('/vip', (req, res) => {
  jwt.verify(req.body.token, jwtSecret, (err, decoded) => {
    if (err) {
      res.send('账号或密码错误')
    } else {
      res.send(`欢迎VIP用户${decoded.name}`)
    }
  })
})

app.listen('3839', () => console.log('http://127.0.0.1:3839'))
