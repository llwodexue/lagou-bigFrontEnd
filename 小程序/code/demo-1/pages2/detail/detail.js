// pages2/detail/detail.js
Page({
  onLoad(options) {
    const name = options.name
    const age = options.age
    this.setData({
      name,
      age
    })
  },
  onBackTap() {
    // 1.返回导航
    wx.navigateBack()
    // 2.给上一级页面传递数据
    const pages = getCurrentPages()
    const prePage = pages[pages.length - 2]
    prePage.setData({ message: '呵呵呵' })
  },
  onUnload() {
    // 2.给上一级页面传递数据
    // const pages = getCurrentPages()
    // const prePage = pages[pages.length - 2]
    // prePage.setData({ message: '呵呵呵' })
  },
  onBackEventTap() {
    wx.navigateBack()
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('backEvent', { name: 'back', age: 11 })
  }
})
