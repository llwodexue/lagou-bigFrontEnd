// pages/profile/profile.js
Page({
  data: {
    avatarURL: '',
    listCount: 60
  },
  onPullDownRefresh() {
    console.log('下拉刷新')
    setTimeout(() => {
      // 停止下拉刷新
      this.setData({
        listCount: 30
      })
      wx.stopPullDownRefresh({
        success: res => {
          console.log('成功停止了下拉刷新', res)
        }
      })
    }, 1000)
  },
  onReachBottom() {
    this.setData({
      listCount: this.data.listCount + 30
    })
  }
})
