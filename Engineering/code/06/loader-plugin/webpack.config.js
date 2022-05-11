const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  resolveLoader: {
    modules: ["node_modules", "./myLoaders"],
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [
      //     "kkbloader",
      //     {
      //       loader: "kkbloaderAsync",
      //       options: {
      //         name: "开课吧",
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.less$/,
        use: ["style-loader", "lessLoader"],
      },
    ],
  },
};
