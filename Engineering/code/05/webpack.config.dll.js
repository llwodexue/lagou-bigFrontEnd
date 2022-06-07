//构建动态链接库文件的
const path = require('path')
const { DllPlugin } = require('webpack')
module.exports = {
  mode: 'production',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, './dist/dll/'),
    filename: '[name].dll.js',
    library: 'kkb'
  },
  plugins: [
    new DllPlugin({
      // manifest.json文件的输出位置
      path: path.join(__dirname, './dist/dll/', '[name]-manifest.json'),
      // 定义打包的公共vendor文件对外暴露的函数名
      name: 'kkb'
    })
  ]
}
