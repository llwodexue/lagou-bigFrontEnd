const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })

wss.on('connection', ws => {
  console.log('连接进来了！')
  ws.on('message', () => {
    ws.send('举头望明月，低头思故乡')
  })
  ws.on('close', () => {
    console.log('连接走了~')
  })
})
