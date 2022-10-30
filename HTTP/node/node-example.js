const http = require('http')
const server = http.createServer((req, res) => {
  if (req.url === '/cache') {
    res.setHeader('Content-Type', 'text/json')
    res.setHeader('cache-control', 'max-age=100')
    res.setHeader('age', '90')
    res.end('Cache 100s')
  }
})
server.listen(3003, () => {
  console.log('Listening: http://localhost:3003')
})
