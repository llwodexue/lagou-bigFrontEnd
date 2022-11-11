const Controller = require('./controller');
const http = require('http');
const server = http.createServer();

const controller = new Controller();

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-type', 'text/plain;charset=utf-8');
  if (req.method === 'OPTIONS') {
    res.status = 200;
    res.end();
    return;
  }

  if (req.url === '/merge') {
    await controller.handleMerge(req, res);
    return;
  }

  if (req.url === '/clear') {
    await controller.handleClear(req, res);
    return;
  }

  if (req.url === '/verify') {
    res.setHeader('Content-type', 'application/json;charset=utf-8');
    await controller.handleVerifyUpload(req, res);
    return;
  }

  if (req.url === '/') {
    controller.handleFormData(req, res);
  }
});

server.listen(3000, () => console.log('正在监听 3000 端口'));
