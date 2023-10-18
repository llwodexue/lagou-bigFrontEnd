// pages/favor/favor.js
Page({
  data: {
    // 1.数据绑定mustache语法
    message: 'hello world',
    // 2.列表数据
    movies: ['满江红', '孤注一掷', '独行月球'],
    // 3.计数器
    counter: 0
  },
  increment() {
    // 修改data，并且希望页面重新渲染，这里必须使用setData
    this.setData({ counter: this.data.counter + 1 })
  },
  decrement() {
    this.setData({ counter: this.data.counter - 1 })
  }
})
