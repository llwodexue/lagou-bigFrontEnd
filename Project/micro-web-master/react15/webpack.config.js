/*
 * @Author: Sunny
 * @Date: 2021-11-07 23:25:54
 * @LastEditors: Suuny
 * @LastEditTime: 2022-04-19 17:08:36
 * @Description:
 * @FilePath: /micro-front-end-teach-asset/react15/webpack.config.js
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const port = 9082
module.exports = {
  entry: {
    path: ['./index.js']
  },
  module: {
    rules: [
      {
        test: /\.js(|x)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(c|sc)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader'
        }
      }
    ]
  },
  optimization: {
    splitChunks: false,
    minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react15.js',
    library: 'react15',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: `http://localhost:${port}/`
  },
  devServer: {
    // 配置允许跨域
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: port,
    historyApiFallback: true,
    hot: true
  },
  performance: {
    //  就是为了加大文件允许体积，提升报错门栏。
    hints: 'warning', // 枚举
    maxAssetSize: 500000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 500000000, // 整数类型（以字节为单位）
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
    }
  }
}
