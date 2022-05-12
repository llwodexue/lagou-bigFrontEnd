//执行webpack构建的入口
//1.拿到webpack.config.js配置
const options = require("./webpack.config.js");
const webpack = require("./lib/webpack.js");

new webpack(options).run();
