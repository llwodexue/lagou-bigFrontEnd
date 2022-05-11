//生产配置
const path = require('path')
const baseConfig = require('./webpack.config.base.js')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const proConfig = {
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
    publicPath: 'https://cdn.kaikeba.com/assets/'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.less$/,
        include: path.resolve(__dirname, './src'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              //css modules 开启
              modules: true
            }
          },
          {
            loader: 'postcss-loader'
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash:6].[ext]',
            outputPath: 'images/',
            limit: 12 * 1024 //单位是字节 1024=1kb
          }
        }
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'), //引入cssnano引擎
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      }
    }),
    new HtmlWebpackPlugin({
      //选择html模板
      title: '首页',
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联css
      }
    })
  ]
}

module.exports = merge(baseConfig, proConfig)
