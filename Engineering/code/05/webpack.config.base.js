//base公共配置

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

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

  plugins: [new CleanWebpackPlugin()],
};
