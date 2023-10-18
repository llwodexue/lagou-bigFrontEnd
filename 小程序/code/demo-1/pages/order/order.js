// pages/order/order.js
Page({
  data: {},
  onLoad() {
    // 1.获取app实例对象
    const app = getApp()

    console.log(app)
    // 2.从app实例对象获数据
    const token = app.globalData.token
    const userInfo = app.globalData.userInfo
    console.log(token, userInfo)

    // 3.拿到token目的发送网络请求

    // 4.将数据展示到界面上
    this.setData({
      userInfo
    })
  }
})
