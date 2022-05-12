//开发配置
const path = require("path");
const baseConfig = require("./webpack.config.base.js");

const merge = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const devConfig = {
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  mode: "development",
  devtool: "cheap-inline-source-map",
  module: {
    rules: [
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          "style-loader",
          // MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              //css modules 开启
              modules: true,
            },
          },
          {
            loader: "postcss-loader",
          },
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        include: path.resolve(__dirname, "./src"),
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash:6].[ext]",
            outputPath: "images/",
            limit: 12 * 1024, //单位是字节 1024=1kb
          },
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "./src"),
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devServer: {
    //可以是相对路径
    contentBase: "./dist",
    open: true,
    hot: true,
    //即便HMR没有生效，浏览器也不要自动刷新。
    hotOnly: true,
    //代理
    proxy: {
      "/api": {
        target: "http://localhost:9092",
      },
    },
    //mock server
    before(app, server) {
      app.get("/api/mock.json", (req, res) => {
        res.json({
          hello: "express",
        });
      });
    },
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      //选择html模板
      title: "首页",
      template: "./src/index.html",
      filename: "index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(baseConfig, devConfig);
