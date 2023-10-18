// app.js
App({
  // 数据不是响应式的，共享的数据通常是固定的数据
  globalData: {
    userInfo: {
      name: 'bird',
      age: 12
    }
  },
  onLaunch(options) {
    // 0.从本地获取token/userInfo
    // const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')

    // 1.进行登录操作（判断逻辑）
    // 将登录成功的数据，保存到storage
    if (!userInfo) {
      // wx.setStorageSync('token', 'Bearer dog')
      wx.setStorageSync('userInfo', { name: 'dog', age: 3 })
    }

    // 2.将获取到数据保存到globalData中
    this.globalData.userInfo = userInfo

    // 3.发送网络请求，优先请求一些必要的数据
  },
  onShow(options) {
    // console.log(options)
  }
})
