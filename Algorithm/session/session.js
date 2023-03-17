const express = require('express')
const sessions = require('express-session')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const username_DB = 'bird'
const password_DB = '123456'
let session_DB

app.use(
  sessions({
    secret: '给 session ID 的签名',
    name: 'connect.sid',
    cookie: { maxAge: 15000, secure: false },
    resave: false,
    saveUninitialized: false
  })
)

app.get('/', (req, res) => {
  session_DB = req.session
  if (session_DB.username) {
    res.send(`
    <h1>欢迎回来${session_DB.username}</h1>
    <h2>req.session${JSON.stringify(req.session)}</h2>
    <h2>req.sessionID${req.sessionID}</h2>
    <a href="/logout">登出</a>
    `)
  } else {
    res.sendFile(__dirname + '/index.html')
  }
})

app.post('/login', (req, res) => {
  if (req.body.username === username_DB && req.body.password === password_DB) {
    session_DB = req.session
    session_DB.username = req.body.username
    res.send(`
    <h1>欢迎回来${session_DB.username}</h1>
    <h2>req.session${JSON.stringify(req.session)}</h2>
    <h2>req.sessionID${req.sessionID}</h2>
    <a href="/logout">登出</a>
    `)
  } else {
    res.send(`<h1>欢迎回来${session_DB.username}</h1>`)
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.listen('3838', () => console.log('http://127.0.0.1:3838'))
