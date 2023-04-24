// node 执行命令的包
const childProcess = require('child_process')
// node 获取路径的包
const path = require('path')

const filePath = {
  vue2: path.resolve(__dirname, '../vue2'), // 获取根目录, 再连接
  vue3: path.resolve(__dirname, '../vue3'),
  react15: path.resolve(__dirname, '../react15'),
  react17: path.resolve(__dirname, '../react17'),
  // 添加启动service命令
  service: path.join(__dirname, '../service')
}
// cd 子应用目录 && npm start 启动项目
function runChild() {
  // 获取子应用的路径,  然后执行命令
  Object.values(filePath).forEach(item => {
    childProcess.spawn(`cd ${item} && npm start`, {
      // 执行shell脚本配置
      stdio: 'inherit',
      shell: true
    })
  })
}

// 运行子应用
runChild()
