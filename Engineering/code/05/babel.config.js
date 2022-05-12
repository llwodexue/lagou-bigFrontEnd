module.exports = {
  //语法转换插件 preset-env
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        corejs: 2,
        useBuiltIns: "usage",
      },
    ],
    "@babel/preset-react",
  ],
};
