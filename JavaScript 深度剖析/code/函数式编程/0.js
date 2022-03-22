// 第一种：
use: ['style-loader', 'css-loader']
// 第二种：
loader: ['style-loader', 'css-loader']
// 第三种：（常用，方便添加配置项）
use: [
  {
    loader: 'style-loader',
  },
  {
    loader: 'css-loader',
  },
]
