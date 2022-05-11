const baseConfig = require("./webpack.config.base.js");
const devConfig = require("./webpack.config.dev.js");
const proConfig = require("./webpack.config.pro.js");
const merge = require("webpack-merge");

console.log(process.env.NODE_ENV);

module.exports = (env) => {
  console.log("1111111111111111111111111111111111111111", env);
  // 如果外部传进env.production 是生产
  // 如果外部没有env.xxx 是开发
  if (env && env.production) {
    return merge(baseConfig, proConfig);
  } else {
    return merge(baseConfig, devConfig);
  }
};
