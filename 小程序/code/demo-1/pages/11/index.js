// pages/11/index.js
Page({
  data: {
    name: 'kobe',
    age: 23,
    message: '哈哈哈'
  },
  onNavTap() {
    const name = this.data.name
    const age = this.data.age
    wx.navigateTo({
      url: `/pages2/detail/detail?name=${name}&age=${age}`,
      events: {
        backEvent(data) {
          console.log('back', data)
        }
      }
    })
  }
})
