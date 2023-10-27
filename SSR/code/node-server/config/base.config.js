const { VueLoaderPlugin } = require('vue-loader/dist/index')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    // 项目导入文件就无需扩展名
    extensions: ['.js', '.json', '.wasm', '.jsx', '.vue']
  }
}
