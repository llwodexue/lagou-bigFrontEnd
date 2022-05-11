const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

//
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    publicPath: "https://cdn.kaikeba.com/assets/",
  },
  module: {
    //loader是一个消耗性能的大户
    //2065ms
    //1710ms
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./src"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
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
            //推荐使用url-loader 因为url-loader支持limit
            //推荐小体积的图片资源转成base64
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
  resolve: {
    //查找第三方依赖
    modules: [path.resolve(__dirname, "./node_modules")],
    alias: {
      //减少查找过程
      //起别名
      "@": path.resolve(__dirname, "./src/css"),
      react: "./node_modules/react/umd/react.production.min.js",
      "react-dom": "./node_modules/react-dom/umd/react-dom.production.min.js",
    },
    extensions: [".js", ".json"],
  },
  externals: {
    //jquery通过script引入之后，全局中即有了 jQuery 变量
    lodash: "_",
  },
  devtool: "cheap-inline-source-map",
  // devServer: {
  //   //可以是相对路径
  //   contentBase: "./dist",
  //   open: true,
  //   hot: true,
  //   //即便HMR没有生效，浏览器也不要自动刷新。
  //   hotOnly: true,
  //   //代理
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:9092",
  //     },
  //   },
  //   //mock server
  //   before(app, server) {
  //     app.get("/api/mock.json", (req, res) => {
  //       res.json({
  //         hello: "express",
  //       });
  //     });
  //   },
  //   port: 8080,
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name]-[contenthash:8].css",
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require("cssnano"), //引入cssnano引擎
      cssProcessorOptions: {
        discardComments: { removeAll: true },
      },
    }),
    new HtmlWebpackPlugin({
      //选择html模板
      title: "首页",
      template: "./src/index.html",
      filename: "index.html",
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true, // 压缩内联css
      },
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ],
};
